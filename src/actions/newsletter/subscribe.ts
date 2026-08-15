'use server';

import prisma from '@/src/lib/prisma';
import { subscribeSchema } from '@/src/lib/validation/newsletter.schemas';
import { sendWelcomeEmail } from '@/src/lib/email/send';
import { rateLimit, RATE_LIMITS } from '@/src/lib/rate-limit';

export type SubscribeState = {
  success: boolean;
  error?: string;
  message?: string;
  discountCode?: string;
} | null;

export async function subscribeAction(prevState: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = formData.get('email') as string;
  const website = formData.get('website') as string; // Honeypot field

  // 1. Honeypot check for bots
  const validation = subscribeSchema.safeParse({ email, website });
  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    if (errors.website) {
      return { success: false, error: 'Spam detectado' };
    }
    return { success: false, error: errors.email?.[0] || 'Email inválido' };
  }

  const validatedEmail = validation.data.email;

  // 2. Rate limit check
  const rlKey = `newsletter:${validatedEmail}`;
  const rl = await rateLimit(rlKey, RATE_LIMITS.newsletterSubscribe.limit, RATE_LIMITS.newsletterSubscribe.windowMs);
  if (!rl.success) {
    return { 
      success: false, 
      error: 'Demasiados intentos. Por favor intenta de nuevo más tarde.' 
    };
  }

  try {
    // 3. Check if user is already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: validatedEmail }
    });

    if (existing) {
      return { 
        success: false, 
        error: 'Este correo electrónico ya está suscrito a nuestro boletín.' 
      };
    }

    // 4. Create subscriber
    const associatedUser = await prisma.user.findUnique({
      where: { email: validatedEmail }
    });

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: validatedEmail,
        userId: associatedUser?.id || null,
        verified: true,
        source: 'home',
      }
    });

    // 5. Generate unique discount code
    const cleanId = subscriber.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
    const discountCodeStr = `WELCOME-${cleanId}`;

    // Create the DiscountCode record in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.discountCode.create({
      data: {
        code: discountCodeStr,
        percent: 10,
        userId: associatedUser?.id || null,
        usageLimit: 1,
        usedCount: 0,
        expiresAt,
      }
    });

    // 6. Send welcome email
    try {
      await sendWelcomeEmail(validatedEmail, discountCodeStr);
    } catch (emailErr) {
      console.error('Error sending welcome email:', emailErr);
    }

    return {
      success: true,
      message: '¡Te has suscrito con éxito! Copia tu código de descuento o búscalo en tu correo.',
      discountCode: discountCodeStr
    };
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      success: false,
      error: 'Ocurrió un error al procesar tu suscripción. Por favor intenta de nuevo.'
    };
  }
}
