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
  if (count >= 15) return { success: true, count };

  const products = await prisma.product.findMany({ take: 10 });
  if (products.length === 0) return { success: false, message: 'No hay productos para crear pedidos de muestra' };

  const sampleOrders = [
    {
      id: 'ORD-8490',
      email: 'andrea.melendez@gmail.com',
      phone: '+503 7201 8844',
      zone: 'San Salvador, Colonia San Benito',
      notes: 'Por favor entregar por la mañana en recepción.',
      subtotal: 45.00,
      discount: 0,
      total: 45.00,
      status: OrderStatus.DELIVERED,
      trackingNumber: 'GUIA-CEX-98101',
      whatsappUrl: 'https://wa.me/50372018844',
      adminNotes: 'Entregado a la recepcionista del edificio.',
      createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8491',
      email: 'roberto.alvarado@outlook.com',
      phone: '+503 7844 1122',
      zone: 'Santa Tecla, Residencial Utila',
      subtotal: 38.00,
      discount: 0,
      total: 38.00,
      status: OrderStatus.DELIVERED,
      trackingNumber: 'GUIA-CEX-98102',
      whatsappUrl: 'https://wa.me/50378441122',
      createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000),
    },
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
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: 'ORD-8493',
      email: 'carlos.mendoza@hotmail.com',
      phone: '+503 7123 4567',
      zone: 'Santa Tecla, La Libertad',
      notes: 'Entregar en horario de tarde.',
      subtotal: 55.00,
      discount: 5.00,
      discountCode: 'BIENVENIDO20',
      total: 50.00,
      status: OrderStatus.CONFIRMED,
      whatsappUrl: 'https://wa.me/50371234567',
      adminNotes: 'Pago por transferencia verificado.',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000),
    },
    {
      id: 'ORD-8494',
      email: 'sofia.martinez@yahoo.com',
      phone: '+503 7987 6543',
      zone: 'Antiguo Cuscatlán, San Elena',
      subtotal: 35.00,
      discount: 0,
      total: 35.00,
      status: OrderStatus.SHIPPED,
      trackingNumber: 'GUIA-CEX-98214',
      whatsappUrl: 'https://wa.me/50379876543',
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8495',
      email: 'gabriel.rivas@gmail.com',
      phone: '+503 7654 3210',
      zone: 'San Salvador, Colonia Miramonte',
      notes: 'Llamar antes de llegar.',
      subtotal: 65.00,
      discount: 0,
      total: 65.00,
      status: OrderStatus.CONFIRMED,
      whatsappUrl: 'https://wa.me/50376543210',
      createdAt: new Date(Date.now() - 4 * 3600 * 1000),
    },
    {
      id: 'ORD-8496',
      email: 'daniela.flores@gmail.com',
      phone: '+503 7543 2109',
      zone: 'Soyapango, Prados de Venecia',
      subtotal: 38.00,
      discount: 0,
      total: 38.00,
      status: OrderStatus.PENDING,
      whatsappUrl: 'https://wa.me/50375432109',
      createdAt: new Date(Date.now() - 50 * 60 * 1000),
    },
    {
      id: 'ORD-8497',
      email: 'luis.henriquez@outlook.com',
      phone: '+503 7321 0987',
      zone: 'Mejicanos, Colonia Metrópolis',
      subtotal: 40.00,
      discount: 4.00,
      discountCode: 'YAM10',
      total: 36.00,
      status: OrderStatus.SHIPPED,
      trackingNumber: 'GUIA-CEX-98219',
      whatsappUrl: 'https://wa.me/50373210987',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8498',
      email: 'valeria.ramos@icloud.com',
      phone: '+503 7890 1234',
      zone: 'San Salvador, Colonia Flor Blanca',
      subtotal: 48.00,
      discount: 0,
      total: 48.00,
      status: OrderStatus.DELIVERED,
      trackingNumber: 'GUIA-CEX-98220',
      whatsappUrl: 'https://wa.me/50378901234',
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8499',
      email: 'fer.reyes@gmail.com',
      phone: '+503 7012 3456',
      zone: 'San Miguel, Colonia El Escalón',
      subtotal: 15.00,
      discount: 0,
      total: 15.00,
      status: OrderStatus.CANCELLED,
      whatsappUrl: 'https://wa.me/50370123456',
      adminNotes: 'Cliente solicitó cancelación por cambio de dirección.',
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8500',
      email: 'lucia.vasquez@gmail.com',
      phone: '+503 7432 1098',
      zone: 'Sonsonate, Centro',
      subtotal: 45.00,
      discount: 0,
      total: 45.00,
      status: OrderStatus.PENDING,
      whatsappUrl: 'https://wa.me/50374321098',
      createdAt: new Date(Date.now() - 1 * 3600 * 1000),
    },
    {
      id: 'ORD-8501',
      email: 'ale.aguilar@gmail.com',
      phone: '+503 7678 9012',
      zone: 'Santa Ana, Residencial Los Viñedos',
      subtotal: 52.00,
      discount: 5.20,
      discountCode: 'YAM10',
      total: 46.80,
      status: OrderStatus.CONFIRMED,
      whatsappUrl: 'https://wa.me/50376789012',
      createdAt: new Date(Date.now() - 3 * 3600 * 1000),
    },
    {
      id: 'ORD-8502',
      email: 'camilo.f@gmail.com',
      phone: '+503 7111 2233',
      zone: 'Apopa, San Salvador',
      subtotal: 44.00,
      discount: 0,
      total: 44.00,
      status: OrderStatus.SHIPPED,
      trackingNumber: 'GUIA-CEX-98235',
      whatsappUrl: 'https://wa.me/50371112233',
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8503',
      email: 'natalia.cruz@outlook.com',
      phone: '+503 7999 8877',
      zone: 'La Libertad, Puerto de La Libertad',
      subtotal: 39.00,
      discount: 0,
      total: 39.00,
      status: OrderStatus.DELIVERED,
      trackingNumber: 'GUIA-CEX-98240',
      whatsappUrl: 'https://wa.me/50379998877',
      createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8504',
      email: 'rodrigo.m@gmail.com',
      phone: '+503 7333 4455',
      zone: 'Ilopango, San Salvador',
      subtotal: 18.00,
      discount: 0,
      total: 18.00,
      status: OrderStatus.CANCELLED,
      whatsappUrl: 'https://wa.me/50373334455',
      adminNotes: 'Pedido duplicado por error.',
      createdAt: new Date(Date.now() - 9 * 24 * 3600 * 1000),
    },
  ];

  for (let i = 0; i < sampleOrders.length; i++) {
    const o = sampleOrders[i];
    const prod1 = products[i % products.length] || products[0];
    const prod2 = products[(i + 1) % products.length] || products[0];

    const existing = await prisma.order.findUnique({ where: { id: o.id } });
    if (!existing) {
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
          adminNotes: o.adminNotes || null,
          createdAt: o.createdAt,
          items: {
            create: [
              {
                productId: prod1.id,
                name: prod1.name,
                price: prod1.price,
                quantity: 1,
                size: prod1.size,
              },
              {
                productId: prod2.id,
                name: prod2.name,
                price: prod2.price,
                quantity: 1,
                size: 'Mediano',
              },
            ],
          },
        },
      });
    }
  }

  revalidatePath('/admin/pedidos');
  revalidatePath('/admin');

  return { success: true, count: sampleOrders.length };
}
