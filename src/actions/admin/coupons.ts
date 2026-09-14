'use server';

import prisma from '@/src/lib/prisma';
import { requireAdmin } from '@/src/lib/auth/adminGuard';
import { DiscountType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getAdminCouponsAction() {
  await requireAdmin();

  const coupons = await prisma.discountCode.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      parentCoupon: {
        select: {
          id: true,
          code: true,
        },
      },
      instances: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return coupons.map((c) => ({
    ...c,
    amount: c.amount ? Number(c.amount) : null,
    minPurchaseAmount: c.minPurchaseAmount ? Number(c.minPurchaseAmount) : null,
    user: c.user ? { id: c.user.id, name: c.user.name, email: c.user.email } : null,
    parentCoupon: c.parentCoupon ? { id: c.parentCoupon.id, code: c.parentCoupon.code } : null,
    instances: c.instances.map((i) => ({
      ...i,
      amount: i.amount ? Number(i.amount) : null,
      minPurchaseAmount: i.minPurchaseAmount ? Number(i.minPurchaseAmount) : null,
      user: i.user ? { id: i.user.id, name: i.user.name, email: i.user.email } : null,
    })),
  }));
}

export async function createCouponAction(data: {
  code: string;
  discountType: DiscountType;
  percent?: number;
  amount?: number;
  minPurchaseAmount?: number;
  usageLimit?: number;
  expiresAt?: string | null;
  userId?: string | null;
}) {
  const admin = await requireAdmin();

  const formattedCode = data.code.trim().toUpperCase().replace(/\s+/g, '');
  if (!formattedCode) {
    throw new Error('El código de descuento no puede estar vacío.');
  }

  const newCoupon = await prisma.discountCode.create({
    data: {
      code: formattedCode,
      discountType: data.discountType,
      percent: data.discountType === 'PERCENTAGE' ? (data.percent || 10) : 0,
      amount: data.discountType === 'FIXED_AMOUNT' ? (data.amount || 5) : null,
      minPurchaseAmount: data.minPurchaseAmount || null,
      usageLimit: data.usageLimit || 100,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      userId: data.userId || null,
      isActive: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'CREATE_COUPON',
      entity: 'DiscountCode',
      entityId: newCoupon.id,
      details: `Cupón ${newCoupon.code} creado (${data.discountType})${data.userId ? ' asignado a usuario' : ' (Plantilla Maestra)'}`,
    },
  });

  revalidatePath('/admin/cupones');
  revalidatePath('/admin');

  const formattedCoupon = {
    ...newCoupon,
    amount: newCoupon.amount ? Number(newCoupon.amount) : null,
    minPurchaseAmount: newCoupon.minPurchaseAmount ? Number(newCoupon.minPurchaseAmount) : null,
    user: newCoupon.user ? { id: newCoupon.user.id, name: newCoupon.user.name, email: newCoupon.user.email } : null,
    parentCoupon: null,
    instances: [],
  };

  return { success: true, coupon: formattedCoupon };
}

export async function instantiateCouponForUserAction(data: {
  templateId: string;
  userId: string;
  customConfig?: {
    percent?: number;
    amount?: number;
    usageLimit?: number;
    expiresAt?: string | null;
  };
}) {
  const admin = await requireAdmin();

  const template = await prisma.discountCode.findUnique({
    where: { id: data.templateId },
  });

  if (!template) {
    throw new Error('La plantilla de cupón especificada no existe.');
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { id: true, name: true, email: true },
  });

  if (!targetUser) {
    throw new Error('El usuario seleccionado no existe.');
  }

  const customPercent = data.customConfig?.percent !== undefined ? data.customConfig.percent : template.percent;
  const customAmount = data.customConfig?.amount !== undefined ? data.customConfig.amount : (template.amount ? Number(template.amount) : null);
  const customUsageLimit = data.customConfig?.usageLimit !== undefined ? data.customConfig.usageLimit : template.usageLimit;
  const customExpiresAt = data.customConfig?.expiresAt !== undefined 
    ? (data.customConfig.expiresAt ? new Date(data.customConfig.expiresAt) : null) 
    : template.expiresAt;

  const instance = await prisma.discountCode.create({
    data: {
      code: template.code,
      discountType: template.discountType,
      percent: template.discountType === 'PERCENTAGE' ? customPercent : 0,
      amount: template.discountType === 'FIXED_AMOUNT' ? customAmount : null,
      minPurchaseAmount: template.minPurchaseAmount,
      usageLimit: customUsageLimit,
      expiresAt: customExpiresAt,
      userId: targetUser.id,
      parentCouponId: template.id,
      isActive: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      parentCoupon: {
        select: {
          id: true,
          code: true,
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'INSTANTIATE_COUPON_USER',
      entity: 'DiscountCode',
      entityId: instance.id,
      details: `Instancia de cupón "${instance.code}" (Límite: ${customUsageLimit} usos) generada para usuario ${targetUser.email}`,
    },
  });

  revalidatePath('/admin/cupones');
  revalidatePath('/admin/usuarios');

  const formattedInstance = {
    ...instance,
    amount: instance.amount ? Number(instance.amount) : null,
    minPurchaseAmount: instance.minPurchaseAmount ? Number(instance.minPurchaseAmount) : null,
    user: instance.user ? { id: instance.user.id, name: instance.user.name, email: instance.user.email } : null,
    parentCoupon: instance.parentCoupon ? { id: instance.parentCoupon.id, code: instance.parentCoupon.code } : null,
  };

  return { success: true, coupon: formattedInstance };
}

export async function toggleCouponActiveAction(couponId: string, isActive: boolean) {
  const admin = await requireAdmin();

  const updated = await prisma.discountCode.update({
    where: { id: couponId },
    data: { isActive },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'TOGGLE_COUPON_STATUS',
      entity: 'DiscountCode',
      entityId: couponId,
      details: `Cupón ${updated.code} estado cambiado a ${isActive ? 'ACTIVO' : 'INACTIVO'}`,
    },
  });

  revalidatePath('/admin/cupones');
  return { success: true, isActive: updated.isActive };
}

export async function deleteCouponAction(couponId: string) {
  const admin = await requireAdmin();

  const deleted = await prisma.discountCode.delete({
    where: { id: couponId },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'DELETE_COUPON',
      entity: 'DiscountCode',
      entityId: couponId,
      details: `Cupón ${deleted.code} eliminado permanentemente`,
    },
  });

  revalidatePath('/admin/cupones');
  return { success: true };
}

export async function updateCouponAction(data: {
  id: string;
  code: string;
  discountType: DiscountType;
  percent?: number;
  amount?: number;
  minPurchaseAmount?: number;
  usageLimit?: number;
  expiresAt?: string | null;
  userId?: string | null;
}) {
  const admin = await requireAdmin();

  const formattedCode = data.code.trim().toUpperCase().replace(/\s+/g, '');
  if (!formattedCode) {
    throw new Error('El código de descuento no puede estar vacío.');
  }

  const existingCoupon = await prisma.discountCode.findUnique({
    where: { id: data.id },
  });
  if (!existingCoupon) {
    throw new Error('El cupón a modificar no existe.');
  }

  // Validación de duplicados según si es plantilla o instancia
  const isMaster = !existingCoupon.parentCouponId && !existingCoupon.userId;
  if (isMaster) {
    const existingMaster = await prisma.discountCode.findFirst({
      where: {
        code: formattedCode,
        parentCouponId: null,
        userId: null,
        NOT: { id: data.id },
      },
    });
    if (existingMaster) {
      throw new Error(`El código promocional "${formattedCode}" ya pertenece a otra plantilla.`);
    }
  } else if (data.userId || existingCoupon.userId) {
    const targetUserId = data.userId || existingCoupon.userId;
    const existingUserInstance = await prisma.discountCode.findFirst({
      where: {
        code: formattedCode,
        userId: targetUserId,
        NOT: { id: data.id },
      },
    });
    if (existingUserInstance) {
      throw new Error(`El usuario ya tiene otro cupón con el código "${formattedCode}".`);
    }
  }

  const updatedCoupon = await prisma.discountCode.update({
    where: { id: data.id },
    data: {
      code: formattedCode,
      discountType: data.discountType,
      percent: data.discountType === 'PERCENTAGE' ? (data.percent || 10) : 0,
      amount: data.discountType === 'FIXED_AMOUNT' ? (data.amount || 5) : null,
      minPurchaseAmount: data.minPurchaseAmount || null,
      usageLimit: data.usageLimit !== undefined ? data.usageLimit : 1,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      userId: data.userId !== undefined ? data.userId : undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      parentCoupon: {
        select: {
          id: true,
          code: true,
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'UPDATE_COUPON',
      entity: 'DiscountCode',
      entityId: updatedCoupon.id,
      details: `Cupón ${updatedCoupon.code} actualizado (${data.discountType})`,
    },
  });

  revalidatePath('/admin/cupones');
  revalidatePath('/admin');

  const formattedCoupon = {
    ...updatedCoupon,
    amount: updatedCoupon.amount ? Number(updatedCoupon.amount) : null,
    minPurchaseAmount: updatedCoupon.minPurchaseAmount ? Number(updatedCoupon.minPurchaseAmount) : null,
    user: updatedCoupon.user ? { id: updatedCoupon.user.id, name: updatedCoupon.user.name, email: updatedCoupon.user.email } : null,
    parentCoupon: updatedCoupon.parentCoupon ? { id: updatedCoupon.parentCoupon.id, code: updatedCoupon.parentCoupon.code } : null,
  };

  return { success: true, coupon: formattedCoupon };
}

export async function assignCouponToUserAction(
  couponId: string,
  userId: string,
  customParams?: {
    usageLimit?: number;
    percent?: number;
    amount?: number;
    expiresAt?: string | null;
  }
) {
  const admin = await requireAdmin();

  // Buscar el cupón plantilla de origen
  const masterCoupon = await prisma.discountCode.findUnique({
    where: { id: couponId },
  });

  if (!masterCoupon) {
    throw new Error('El cupón plantilla no existe.');
  }

  // Verificar si el usuario ya posee un cupón activo derivado de este código
  const existingUserInstance = await prisma.discountCode.findFirst({
    where: {
      code: masterCoupon.code,
      userId: userId,
      isActive: true,
    },
  });

  if (existingUserInstance) {
    throw new Error(`El usuario ya tiene una instancia activa del código "${masterCoupon.code}".`);
  }

  // Crear una nueva instancia independiente asignada al usuario
  const newInstance = await prisma.discountCode.create({
    data: {
      code: masterCoupon.code,
      discountType: masterCoupon.discountType,
      percent: customParams?.percent !== undefined ? customParams.percent : masterCoupon.percent,
      amount: customParams?.amount !== undefined ? customParams.amount : masterCoupon.amount,
      minPurchaseAmount: masterCoupon.minPurchaseAmount,
      usageLimit: customParams?.usageLimit !== undefined ? customParams.usageLimit : (masterCoupon.usageLimit || 1),
      usedCount: 0,
      isActive: true,
      expiresAt: customParams?.expiresAt !== undefined
        ? (customParams.expiresAt ? new Date(customParams.expiresAt) : null)
        : masterCoupon.expiresAt,
      userId: userId,
      parentCouponId: masterCoupon.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      parentCoupon: {
        select: {
          id: true,
          code: true,
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'ASSIGN_COUPON_INSTANCE',
      entity: 'DiscountCode',
      entityId: newInstance.id,
      details: `Instancia de cupón ${newInstance.code} creada y asignada al usuario ${newInstance.user?.email || userId} con límite de ${newInstance.usageLimit} uso(s)`,
    },
  });

  revalidatePath('/admin/cupones');
  revalidatePath('/admin/usuarios');

  const formattedCoupon = {
    ...newInstance,
    amount: newInstance.amount ? Number(newInstance.amount) : null,
    minPurchaseAmount: newInstance.minPurchaseAmount ? Number(newInstance.minPurchaseAmount) : null,
    user: newInstance.user ? { id: newInstance.user.id, name: newInstance.user.name, email: newInstance.user.email } : null,
    parentCoupon: newInstance.parentCoupon ? { id: newInstance.parentCoupon.id, code: newInstance.parentCoupon.code } : null,
  };

  return { success: true, coupon: formattedCoupon };
}

export async function searchUsersForAssignmentAction(query?: string) {
  await requireAdmin();

  const where: any = {};
  if (query && query.trim()) {
    const q = query.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: 'asc' },
    take: 20,
  });

  return users;
}
