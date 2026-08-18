'use server';

import prisma from '@/src/lib/prisma';
import { requireAdmin } from '@/src/lib/auth/adminGuard';
import { DiscountType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getAdminCouponsAction() {
  await requireAdmin();

  const coupons = await prisma.discountCode.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return coupons.map((c) => ({
    ...c,
    amount: c.amount ? Number(c.amount) : null,
    minPurchaseAmount: c.minPurchaseAmount ? Number(c.minPurchaseAmount) : null,
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
}) {
  const admin = await requireAdmin();

  const formattedCode = data.code.trim().toUpperCase().replace(/\s+/g, '');
  if (!formattedCode) {
    throw new Error('El código de descuento no puede estar vacío.');
  }

  const existing = await prisma.discountCode.findUnique({
    where: { code: formattedCode },
  });
  if (existing) {
    throw new Error(`El código promocional "${formattedCode}" ya existe.`);
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
      isActive: true,
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
      details: `Cupón ${newCoupon.code} creado (${data.discountType})`,
    },
  });

  revalidatePath('/admin/cupones');
  revalidatePath('/admin');

  return { success: true, coupon: newCoupon };
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
