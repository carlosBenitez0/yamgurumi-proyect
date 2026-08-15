'use server';

import prisma from '@/src/lib/prisma';
import { getAuthCookie, verifyToken } from '@/src/lib/auth/tokens';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createOrderSchema = z.object({
  phone: z.string().min(8, 'Teléfono requerido'),
  zone: z.string().min(1, 'Zona requerida'),
  note: z.string().optional(),
  subtotal: z.number().positive(),
  discountAmount: z.number().min(0),
  discountCode: z.string().nullable().optional(),
  total: z.number().min(0),
  whatsappUrl: z.string().url(),
});

export type CreateOrderInput = {
  phone: string;
  zone: string;
  note?: string;
  subtotal: number;
  discountAmount: number;
  discountCode?: string | null;
  total: number;
  whatsappUrl: string;
};

export async function createOrderAction(input: CreateOrderInput) {
  const token = await getAuthCookie();
  let userId: string | undefined = undefined;
  let email: string = 'cliente@yamgurumi.com';

  if (token) {
    const payload = await verifyToken(token);
    if (payload && payload.sub) {
      userId = payload.sub;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });
      if (user?.email) {
        email = user.email;
      }
    }
  }

  const validated = createOrderSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Datos de pedido inválidos' };
  }

  const { phone, zone, note, subtotal, discountAmount, discountCode, total, whatsappUrl } = validated.data;

  try {
    // Si se utilizó un código de descuento, actualizar su conteo de uso en DB
    if (discountCode) {
      const cleanCode = discountCode.trim().toUpperCase();
      const codeRecord = await prisma.discountCode.findUnique({ where: { code: cleanCode } });
      if (codeRecord && codeRecord.usedCount < codeRecord.usageLimit) {
        await prisma.discountCode.update({
          where: { code: cleanCode },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    // Crear el registro de la orden en la base de datos
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        email,
        phone,
        zone,
        notes: note || null,
        subtotal,
        discount: discountAmount,
        discountCode: discountCode || null,
        total,
        status: 'PENDING',
        whatsappUrl,
      },
    });

    // Revalidar el perfil para actualización inmediata en "Mis Pedidos"
    revalidatePath('/mi-taller');

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Error creating order in DB:', error);
    return { success: false, error: 'Error al registrar el pedido en la base de datos.' };
  }
}
