'use server';
import prisma from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth/tokens';

export async function verifyEmailAction(token: string) {
  try {
    if (!token) return { success: false, error: 'Token requerido' };

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!verificationToken || verificationToken.type !== 'EMAIL_VERIFICATION') {
      return { success: false, error: 'Token inválido' };
    }

    if (verificationToken.expiresAt < new Date()) {
      return { success: false, error: 'El token ha expirado' };
    }

    // Actualizar usuario
    const user = await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() },
    });

    // Borrar token
    await prisma.verificationToken.delete({ where: { id: verificationToken.id } });

    // Crear sesión e iniciar sesión automáticamente
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: Math.random().toString(36).substring(2),
        expiresAt,
      }
    });

    const jwt = await signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      jti: session.id,
    });
    
    await setAuthCookie(jwt);

    return { success: true, message: 'Correo verificado con éxito' };
  } catch (error) {
    console.error('Verification error:', error);
    return { success: false, error: 'Error al verificar el correo' };
  }
}
