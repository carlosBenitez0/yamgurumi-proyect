'use server';

import prisma from '@/src/lib/prisma';
import { requireAdmin } from '@/src/lib/auth/adminGuard';
import { CustomOrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getAdminCustomOrdersAction(status?: string) {
  await requireAdmin();

  const where: any = {};
  if (status && status !== 'ALL') {
    where.status = status as CustomOrderStatus;
  }

  const customOrders = await prisma.customOrderRequest.findMany({
    where,
    include: {
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

  return customOrders.map((co) => ({
    ...co,
    quotedPrice: co.quotedPrice ? Number(co.quotedPrice) : null,
  }));
}

export async function quoteCustomOrderAction(data: {
  customOrderId: string;
  status: CustomOrderStatus;
  quotedPrice?: number | null;
  adminNotes?: string | null;
}) {
  const admin = await requireAdmin();

  const updated = await prisma.customOrderRequest.update({
    where: { id: data.customOrderId },
    data: {
      status: data.status,
      ...(data.quotedPrice !== undefined && {
        quotedPrice: data.quotedPrice ? data.quotedPrice : null,
      }),
      ...(data.adminNotes !== undefined && { adminNotes: data.adminNotes }),
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'QUOTE_CUSTOM_ORDER',
      entity: 'CustomOrderRequest',
      entityId: data.customOrderId,
      details: `Solicitud a medida "${updated.title}" cotizada en $${data.quotedPrice || 0} y cambiada a ${data.status}`,
    },
  });

  revalidatePath('/admin/encargos');
  revalidatePath('/admin');

  return { success: true, customOrder: updated };
}

export async function seedSampleCustomOrdersIfEmptyAction() {
  await requireAdmin();

  const count = await prisma.customOrderRequest.count();
  if (count > 0) return { success: true, count };

  const samples = [
    {
      customerName: 'Valeria Solís',
      email: 'valeria.solis@gmail.com',
      phone: '+503 7731 1064',
      title: 'Amigurumi de mi Mascota (Perro Schnauzer 25cm)',
      description: 'Hola! Quisiera que me tejan un perrito amigurumi idéntico a mi mascota Schnauzer gris con barbillita blanca.',
      desiredSize: 'Grande (25 - 30 cm)',
      budgetRange: '$35 - $50',
      referenceImages: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80'],
      status: CustomOrderStatus.PENDING,
    },
    {
      customerName: 'Fernando Henríquez',
      email: 'fer.henriquez@outlook.com',
      phone: '+503 7731 1064',
      title: 'Muñeco de Nieve Gigante para Navidad (40cm)',
      description: 'Necesito un amigurumi gigante de muñeco de nieve con sombrero de copa y bufanda roja para centro de mesa.',
      desiredSize: 'Gigante (40 cm)',
      budgetRange: '$50 - $70',
      referenceImages: ['https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=500&q=80'],
      status: CustomOrderStatus.QUOTED,
      quotedPrice: 55.00,
      adminNotes: 'Cotización aceptada en proceso de confirmación de depósito.',
    },
    {
      customerName: 'Claudia Ramos',
      email: 'claudia.ramos@gmail.com',
      phone: '+503 7731 1064',
      title: 'Personaje de Anime "Pikachu Tejido" (20cm)',
      description: 'Para regalo de graduación de mi hijo, amigurumi de Pikachu con gorrito de graduación.',
      desiredSize: 'Mediano (20 cm)',
      budgetRange: '$30 - $40',
      referenceImages: ['https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=500&q=80'],
      status: CustomOrderStatus.IN_PRODUCTION,
      quotedPrice: 38.00,
      adminNotes: 'En tejido por el equipo artesanal. Avance 60%.',
    },
  ];

  for (const s of samples) {
    await prisma.customOrderRequest.create({
      data: s,
    });
  }

  revalidatePath('/admin/encargos');
  return { success: true, count: samples.length };
}
