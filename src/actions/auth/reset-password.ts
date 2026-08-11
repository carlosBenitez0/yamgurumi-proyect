'use server';
import prisma from '@/src/lib/prisma';
import { hashPassword } from '@/src/lib/auth/password';
import { resetPasswordSchema } from '@/src/lib/validation/auth.schemas';

export async function resetPasswordAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validated = resetPasswordSchema.safeParse(data);
    
    if (!validated.success) {
      return { success: false, error: 'Datos inválidos o las contraseñas no coinciden' };
    }

    const { token, password } = validated.data;

    const resetToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!resetToken || resetToken.type !== 'PASSWORD_RESET') {
      return { success: false, error: 'Token inválido' };
    }

    if (resetToken.expiresAt < new Date()) {
      return { success: false, error: 'El enlace ha expirado' };
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    });

    // Invalidate all existing sessions
    const user = await prisma.user.findUnique({ where: { email: resetToken.email } });
    if (user) {
      await prisma.session.deleteMany({ where: { userId: user.id } });
    }

    await prisma.verificationToken.delete({ where: { id: resetToken.id } });

    return { success: true, message: 'Contraseña actualizada con éxito' };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: 'Error al cambiar la contraseña' };
  }
}
