'use server';

import prisma from '@/src/lib/prisma';
import { requireAdmin } from '@/src/lib/auth/adminGuard';
import { revalidatePath } from 'next/cache';

export async function getAdminSettingsAction() {
  await requireAdmin();

  const settings = await prisma.storeSetting.findMany({
    orderBy: { key: 'asc' },
  });

  return settings;
}

export async function updateStoreSettingsAction(
  settings: { key: string; value: string; category?: string; description?: string }[]
) {
  const admin = await requireAdmin();

  for (const s of settings) {
    await prisma.storeSetting.upsert({
      where: { key: s.key },
      update: {
        value: s.value,
        ...(s.category && { category: s.category }),
        ...(s.description && { description: s.description }),
      },
      create: {
        key: s.key,
        value: s.value,
        category: s.category || 'general',
        description: s.description || null,
      },
    });
  }

  // Audit Log
  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'UPDATE_STORE_SETTINGS',
      entity: 'StoreSetting',
      details: `Configuraciones globales de la tienda actualizadas (${settings.length} claves)`,
    },
  });

  revalidatePath('/admin/configuracion');
  revalidatePath('/admin');

  return { success: true };
}
