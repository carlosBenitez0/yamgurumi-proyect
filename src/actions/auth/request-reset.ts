'use server';
import prisma from '@/src/lib/prisma';
import { sendResetPasswordEmail } from '@/src/lib/email/send';
import { resetRequestSchema } from '@/src/lib/validation/auth.schemas';
import { randomBytes } from 'crypto';

export async function requestResetAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validated = resetRequestSchema.safeParse(data);
    
    if (!validated.success) {
      return { success: false, error: 'Email inválido' };
    }

    const { email } = validated.data;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return { success: true, message: 'Si el correo existe, recibirás un enlace de recuperación' };
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.verificationToken.deleteMany({
      where: { email, type: 'PASSWORD_RESET' }
    });

    await prisma.verificationToken.create({
      data: {
        email,
        token,
        type: 'PASSWORD_RESET',
        expiresAt,
      },
    });

    await sendResetPasswordEmail(email, token);

    return { success: true, message: 'Si el correo existe, recibirás un enlace de recuperación' };
  } catch (error) {
    console.error('Request reset error:', error);
    return { success: false, error: 'Ocurrió un error al procesar la solicitud' };
  }
}
