'use server';
import prisma from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth/tokens';
import { jwtVerify } from 'jose';

export async function verifyEmailAction(token: string) {
  try {
    if (!token) return { success: false, error: 'Token requerido' };

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) throw new Error('JWT_SECRET not configured');
    const key = new TextEncoder().encode(secretKey);

    let payload;
    try {
      const result = await jwtVerify(token, key);
      payload = result.payload;
    } catch (e) {
      return { success: false, error: 'El enlace es inválido o ha expirado' };
    }

    const email = payload.email as string;
    const passwordHash = payload.passwordHash as string;
    const name = payload.name as string;

    if (!email || !passwordHash) {
      return { success: false, error: 'Token malformado' };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: 'El usuario ya ha sido verificado anteriormente' };
    }

    // Crear el usuario finalmente verificado
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
        role: 'CUSTOMER',
        emailVerified: new Date(),
      },
    });

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

    return { success: true, message: '¡Correo verificado! Tu cuenta ha sido creada con éxito' };
  } catch (error) {
    console.error('Verification error:', error);
    return { success: false, error: 'Error al verificar el correo y crear la cuenta' };
  }
}
