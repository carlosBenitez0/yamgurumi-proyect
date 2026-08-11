'use server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { registerSchema } from '@/lib/validation/auth.schemas';
import { sendVerificationEmail } from '@/lib/email/send';
import { randomBytes } from 'crypto';

export async function registerAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validated = registerSchema.safeParse(data);
    
    if (!validated.success) {
      return { success: false, error: 'Datos inválidos' };
    }

    const { email, password, name } = validated.data;

    // Verificar si existe
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: 'El email ya está en uso' };
    }

    // Crear usuario
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'CUSTOMER',
      },
    });

    // Generar token de verificación
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    await prisma.verificationToken.create({
      data: {
        email,
        token,
        type: 'EMAIL_VERIFICATION',
        expiresAt,
      },
    });

    // Enviar email
    try {
      await sendVerificationEmail(email, token);
    } catch (e) {
      console.error('Error enviando email:', e);
      // No fallamos el registro, idealmente debería haber retry
    }

    return { success: true, message: 'Revisa tu correo para verificar tu cuenta' };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Ocurrió un error al registrarse' };
  }
}
