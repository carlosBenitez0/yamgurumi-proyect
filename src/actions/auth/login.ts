'use server';
import prisma from '@/src/lib/prisma';
import { verifyPassword } from '@/src/lib/auth/password';
import { signToken, setAuthCookie } from '@/src/lib/auth/tokens';
import { loginSchema } from '@/src/lib/validation/auth.schemas';

export async function loginAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validated = loginSchema.safeParse(data);
    
    if (!validated.success) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    const { email, password } = validated.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    if (!user.emailVerified) {
      return { success: false, error: 'Debes verificar tu correo electrónico primero' };
    }

    // Crear sesión
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: Math.random().toString(36).substring(2),
        expiresAt,
      }
    });

    const token = await signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      jti: session.id,
    });
    
    await setAuthCookie(token);

    return { success: true, message: 'Inicio de sesión exitoso' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Ocurrió un error al iniciar sesión' };
  }
}
