'use server';

import prisma from '@/src/lib/prisma';
import { getAuthCookie, verifyToken } from '@/src/lib/auth/tokens';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
});

export async function updateProfileAction(formData: FormData) {
  const token = await getAuthCookie();
  if (!token) return { error: 'No autorizado' };

  const payload = await verifyToken(token);
  if (!payload) return { error: 'No autorizado' };

  const name = formData.get('name') as string;
  const validated = updateProfileSchema.safeParse({ name });

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || 'Datos inválidos' };
  }

  try {
    await prisma.user.update({
      where: { id: payload.sub },
      data: { name: validated.data.name },
    });

    revalidatePath('/mi-taller');
    return { success: true };
  } catch (error) {
    return { error: 'Error al actualizar el perfil' };
  }
}
