'use server';

import prisma from '@/src/lib/prisma';
import { requireAdmin } from '@/src/lib/auth/adminGuard';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getAdminUsersAction(search?: string) {
  await requireAdmin();

  const where: any = {};
  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    include: {
      orders: {
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
        },
      },
      addresses: {
        select: {
          zone: true,
          phone: true,
        },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return users.map((user) => {
    const totalSpent = user.orders.reduce((sum, o) => sum + Number(o.total), 0);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      ordersCount: user.orders.length,
      totalSpent,
      defaultPhone: user.addresses[0]?.phone || '+503 7731 1064',
      defaultZone: user.addresses[0]?.zone || 'El Salvador 🇸🇻',
    };
  });
}

export async function updateUserRoleAction(userId: string, newRole: Role) {
  const currentAdmin = await requireAdmin();

  // Evitar que el admin se quite a sí mismo el rol de ADMIN si es la misma cuenta
  if (currentAdmin.sub === userId && newRole !== Role.ADMIN) {
    throw new Error('No puedes degradar tu propio rol de administrador actual.');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  // Registrar auditoría
  await prisma.auditLog.create({
    data: {
      userId: currentAdmin.sub,
      userEmail: currentAdmin.email,
      action: 'UPDATE_USER_ROLE',
      entity: 'User',
      entityId: userId,
      details: `Rol de usuario ${updatedUser.email} actualizado a ${newRole}`,
    },
  });

  revalidatePath('/admin/usuarios');
  revalidatePath('/admin');

  return { success: true, user: updatedUser };
}
