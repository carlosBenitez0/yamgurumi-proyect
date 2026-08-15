'use server';

import prisma from '@/src/lib/prisma';
import { getAuthCookie, verifyToken } from '@/src/lib/auth/tokens';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const saveAddressSchema = z.object({
  addressId: z.string().optional(),
  name: z.string().min(2, 'Nombre requerido'),
  phone: z.string().min(8, 'Teléfono de contacto requerido'),
  zone: z.string().min(1, 'Zona o dirección requerida'),
  notes: z.string().optional(),
});

export async function saveAddressAction(formData: FormData) {
  const token = await getAuthCookie();
  if (!token) return { error: 'No autorizado' };

  const payload = await verifyToken(token);
  if (!payload || !payload.sub) return { error: 'No autorizado' };

  const userId = payload.sub;

  const addressId = (formData.get('addressId') as string) || undefined;
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const zone = formData.get('zone') as string;
  const notes = (formData.get('notes') as string) || '';

  const validated = saveAddressSchema.safeParse({ addressId, name, phone, zone, notes });
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || 'Datos inválidos' };
  }

  try {
    if (addressId) {
      // Editar una dirección existente
      await prisma.address.update({
        where: { id: addressId, userId },
        data: {
          name: validated.data.name,
          phone: validated.data.phone,
          zone: validated.data.zone,
          notes: validated.data.notes,
        },
      });
    } else {
      // Crear una nueva dirección
      const userAddressesCount = await prisma.address.count({
        where: { userId },
      });

      await prisma.address.create({
        data: {
          userId,
          name: validated.data.name,
          phone: validated.data.phone,
          zone: validated.data.zone,
          notes: validated.data.notes,
          isDefault: userAddressesCount === 0, // Si es la primera, es la principal por defecto
        },
      });
    }

    revalidatePath('/mi-taller');
    return { success: true };
  } catch (error) {
    console.error("Error al guardar la dirección:", error);
    return { error: 'Error al guardar la dirección' };
  }
}
