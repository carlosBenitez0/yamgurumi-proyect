'use server';

import prisma from '@/src/lib/prisma';
import { hashPassword } from '@/src/lib/auth/password';
import { registerSchema } from '@/src/lib/validation/auth.schemas';
import { sendVerificationEmail } from '@/src/lib/email/send';
import { SignJWT } from 'jose';

export async function registerAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validated = registerSchema.safeParse(data);
    
    if (!validated.success) {
      return { success: false, error: 'Datos inválidos' };
    }

    const { email, password, name } = validated.data;

    // Verificar si existe en DB real
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: 'El email ya está en uso' };
    }

    // No creamos el usuario, sino que empaquetamos sus datos en el token
    const passwordHash = await hashPassword(password);
    
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) throw new Error('JWT_SECRET not configured');
    const key = new TextEncoder().encode(secretKey);

    const token = await new SignJWT({ email, passwordHash, name: name || '' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(key);

    // Enviar email con el JWT
    try {
      await sendVerificationEmail(email, token);
    } catch (e: any) {
      console.error('Error enviando email de verificación:', e);
      return { 
        success: false, 
        error: `No se pudo entregar el correo de verificación (${e?.message || 'Error de entrega'}). Revisa que tu dirección sea correcta.` 
      };
    }

    return { 
      success: true, 
      emailSentTo: email,
      message: 'Te hemos enviado un correo con tu enlace de confirmación. Revisa tu bandeja de entrada o spam.' 
    };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Ocurrió un error al registrarse' };
  }
}
