'use server';

import prisma from '@/src/lib/prisma';
import { sendVerificationEmail } from '@/src/lib/email/send';
import { SignJWT } from 'jose';
import { z } from 'zod';

const resendSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Correo electrónico inválido'),
});

export async function resendVerificationAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const validated = resendSchema.safeParse({ email });

    if (!validated.success) {
      return { success: false, error: 'Ingresa un correo electrónico válido' };
    }

    // Verificar si el usuario ya está verificado en DB
    const user = await prisma.user.findUnique({ where: { email: validated.data.email } });
    if (user && user.emailVerified) {
      return { success: false, error: 'Esta cuenta ya está verificada. Puedes iniciar sesión.' };
    }

    // Crear un nuevo token JWT de verificación (expira en 24h)
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) throw new Error('JWT_SECRET not configured');
    const key = new TextEncoder().encode(secretKey);

    const token = await new SignJWT({ 
      email: validated.data.email, 
      name: user?.name || '', 
      passwordHash: user?.passwordHash || '' 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(key);

    // Intentar envío de correo
    await sendVerificationEmail(validated.data.email, token);

    return { 
      success: true, 
      message: 'Correo de verificación reenviado con éxito. Revisa tu bandeja de entrada.' 
    };
  } catch (error: any) {
    console.error('Error re-enviando correo:', error);
    return { 
      success: false, 
      error: `No se pudo entregar el correo (${error?.message || 'Error del servidor'}). Por favor intenta más tarde.` 
    };
  }
}
