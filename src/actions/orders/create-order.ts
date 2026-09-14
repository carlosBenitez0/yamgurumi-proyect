'use server';

import prisma from '@/src/lib/prisma';
import { getAuthCookie, verifyToken } from '@/src/lib/auth/tokens';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  hasBase: z.boolean().optional(),
  baseType: z.enum(['none', 'standard', 'large']).optional(),
  price: z.number().optional(),
});

const createOrderSchema = z.object({
  phone: z.string().min(8, 'Teléfono requerido'),
  zone: z.string().min(1, 'Zona requerida'),
  note: z.string().optional(),
  subtotal: z.number().positive(),
  discountAmount: z.number().min(0),
  discountCode: z.string().nullable().optional(),
  total: z.number().min(0),
  whatsappUrl: z.string().url(),
  items: z.array(orderItemSchema).min(1, 'La bolsa está vacía'),
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
  items: { productId: string; quantity: number; hasBase?: boolean; baseType?: 'none' | 'standard' | 'large'; price?: number }[];
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

  const { phone, zone, note, subtotal, discountAmount, discountCode, total, whatsappUrl, items } = validated.data;

  try {
    // Si se utilizó un código de descuento, actualizar su conteo de uso en DB
    if (discountCode) {
      const cleanCode = discountCode.trim().toUpperCase();
      const codeRecord = await prisma.discountCode.findFirst({
        where: {
          code: cleanCode,
          isActive: true,
          OR: [
            { userId: userId || undefined },
            { userId: null },
          ],
        },
        orderBy: { userId: 'desc' },
      });
      if (codeRecord && codeRecord.usedCount < codeRecord.usageLimit) {
        await prisma.discountCode.update({
          where: { id: codeRecord.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    // Verificar productos y stock disponible antes de comprometer nada
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      select: { id: true, name: true, price: true, stock: true, craftingDays: true },
    });

    // Procesar productos y distinguir entre entrega inmediata vs elaboración bajo encargo
    const itemsData: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      size: string | null;
      qtyToDecrement: number;
    }[] = [];

    for (const item of items) {
      const dbProduct = dbProducts.find((p) => p.id === item.productId);
      if (!dbProduct) continue; // producto estático: sin stock que controlar

      const availableStock = Math.max(0, dbProduct.stock);
      const qtyToDecrement = Math.min(item.quantity, availableStock);
      const cDays = dbProduct.craftingDays || '5-10 días hábiles';

      const baseLabel =
        item.baseType === 'large'
          ? 'Base Grande (+$1.50)'
          : item.baseType === 'standard'
            ? 'Base Normal (+$1.00)'
            : item.hasBase
              ? 'Con base'
              : 'Sin base';

      let statusTag = '⚡ Venta Inmediata';
      if (availableStock === 0) {
        statusTag = `🧶 Elaboración bajo encargo (${cDays})`;
      } else if (availableStock < item.quantity) {
        statusTag = `⚡ Inmediato (${availableStock}) + 🧶 Bajo encargo (${item.quantity - availableStock} @ ${cDays})`;
      }

      const fullSizeTag = `${baseLabel} · ${statusTag}`;

      const baseExtra =
        item.baseType === 'large' ? 1.5 : item.baseType === 'standard' ? 1.0 : 0;
      const unitPrice = item.price ?? (Number(dbProduct.price) + baseExtra);

      itemsData.push({
        productId: dbProduct.id,
        name: dbProduct.name,
        price: unitPrice,
        quantity: item.quantity,
        size: fullSizeTag,
        qtyToDecrement,
      });
    }

    // Transacción atómica: decrementar stock disponible y crear la orden con sus items.
    const order = await prisma.$transaction(async (tx) => {
      for (const item of itemsData) {
        if (item.qtyToDecrement > 0) {
          const decremented = await tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.qtyToDecrement } },
            data: { stock: { decrement: item.qtyToDecrement } },
          });
          if (decremented.count === 0) {
            throw new Error(`STOCK_RACE:${item.name}`);
          }
        }
      }

      return tx.order.create({
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
          items: {
            create: itemsData.map((item) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              size: item.size,
            })),
          },
        },
      });
    });

    // Revalidar vistas afectadas por el cambio de stock
    revalidatePath('/admin/pedidos');
    revalidatePath('/mi-taller');
    revalidatePath('/catalog');
    revalidatePath('/');
    revalidatePath('/admin/productos');

    return { success: true, orderId: order.id };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('STOCK_RACE:')) {
      const name = error.message.split(':')[1];
      return {
        success: false,
        error: `"${name}" se agotó justo mientras procesábamos tu pedido. Revisa tu bolsa e inténtalo de nuevo.`,
      };
    }
    console.error('Error creating order in DB:', error);
    return { success: false, error: 'Error al registrar el pedido en la base de datos.' };
  }
}
