'use server';

import prisma from '@/src/lib/prisma';
import { requireAdmin } from '@/src/lib/auth/adminGuard';
import { OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getAdminOrdersAction(params?: {
  status?: string;
  search?: string;
}) {
  await requireAdmin();

  const where: any = {};

  if (params?.status && params.status !== 'ALL') {
    where.status = params.status as OrderStatus;
  }

  if (params?.search && params.search.trim()) {
    const q = params.search.trim();
    where.OR = [
      { id: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
      { trackingNumber: { contains: q, mode: 'insensitive' } },
      { zone: { contains: q, mode: 'insensitive' } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: {
            select: {
              imageUrls: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  }));
}

export async function updateOrderStatusAction(data: {
  orderId: string;
  status: OrderStatus;
  trackingNumber?: string | null;
  adminNotes?: string | null;
}) {
  const admin = await requireAdmin();

  const updated = await prisma.order.update({
    where: { id: data.orderId },
    data: {
      status: data.status,
      ...(data.trackingNumber !== undefined && { trackingNumber: data.trackingNumber }),
      ...(data.adminNotes !== undefined && { adminNotes: data.adminNotes }),
    },
  });

  // Log de auditoría
  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'UPDATE_ORDER_STATUS',
      entity: 'Order',
      entityId: data.orderId,
      details: `Pedido #${data.orderId} cambiado a estado ${data.status}${
        data.trackingNumber ? ` (Guía: ${data.trackingNumber})` : ''
      }`,
    },
  });

  revalidatePath('/admin/pedidos');
  revalidatePath('/admin');

  return { success: true, order: updated };
}

export async function seedSampleOrdersIfEmptyAction() {
  await requireAdmin();

  const count = await prisma.order.count();
  if (count > 0) return { success: true, count };

  // Buscar algunos productos existentes para asociarlos a los pedidos de prueba
  const products = await prisma.product.findMany({ take: 5 });
  if (products.length === 0) return { success: false, message: 'No hay productos para crear pedidos de muestra' };

  const sampleOrders = [
    {
      id: 'ORD-8492',
      email: 'maria.gonzalez@gmail.com',
      phone: '+503 7812 9043',
      zone: 'San Salvador, Colonia Escalón',
      notes: 'Por favor envolver para regalo de cumpleaños con una nota azul.',
      subtotal: 42.50,
      discount: 0,
      total: 42.50,
      status: OrderStatus.PENDING,
      whatsappUrl: 'https://wa.me/50378129043',
      items: [
        {
          productId: products[0].id,
          name: products[0].name,
          price: products[0].price,
          quantity: 1,
          size: products[0].size,
        },
      ],
    },
    {
      id: 'ORD-8493',
      email: 'carlos.mendoza@hotmail.com',
      phone: '+503 7123 4567',
      zone: 'Santa Tecla, La Libertad',
      notes: 'Entregar en horario de tarde.',
      subtotal: 55.00,
      discount: 5.00,
      discountCode: 'BIENVENIDA',
      total: 50.00,
      status: OrderStatus.CONFIRMED,
      whatsappUrl: 'https://wa.me/50371234567',
      items: [
        {
          productId: products[1] ? products[1].id : products[0].id,
          name: products[1] ? products[1].name : products[0].name,
          price: products[1] ? products[1].price : products[0].price,
          quantity: 2,
          size: 'Mediano',
        },
      ],
    },
    {
      id: 'ORD-8494',
      email: 'sofia.martinez@yahoo.com',
      phone: '+503 7987 6543',
      zone: 'Antiguo Cuscatlán',
      subtotal: 35.00,
      discount: 0,
      total: 35.00,
      status: OrderStatus.SHIPPED,
      trackingNumber: 'GUIA-CEX-98214',
      whatsappUrl: 'https://wa.me/50379876543',
      items: [
        {
          productId: products[0].id,
          name: products[0].name,
          price: products[0].price,
          quantity: 1,
          size: 'Mini',
        },
      ],
    },
  ];

  for (const o of sampleOrders) {
    await prisma.order.create({
      data: {
        id: o.id,
        email: o.email,
        phone: o.phone,
        zone: o.zone,
        notes: o.notes || null,
        subtotal: o.subtotal,
        discount: o.discount,
        discountCode: o.discountCode || null,
        total: o.total,
        status: o.status,
        whatsappUrl: o.whatsappUrl,
        trackingNumber: o.trackingNumber || null,
        items: {
          create: o.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
          })),
        },
      },
    });
  }

  revalidatePath('/admin/pedidos');
  return { success: true, count: sampleOrders.length };
}
