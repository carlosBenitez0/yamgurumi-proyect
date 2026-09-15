'use server';

import prisma from '@/src/lib/prisma';
import { getAuthCookie, verifyToken } from '@/src/lib/auth/tokens';

export async function checkAndNotifyExpiringCouponsAction(): Promise<{
  success: boolean;
  expiringCount: number;
  expiredCount: number;
  error?: string;
}> {
  try {
    const token = await getAuthCookie();
    if (!token) return { success: false, expiringCount: 0, expiredCount: 0 };

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) return { success: false, expiringCount: 0, expiredCount: 0 };

    const userId = payload.sub;
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // 1. Buscar cupones asignados al usuario que vencen en los próximos 3 días
    const expiringCoupons = await prisma.discountCode.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: {
          gt: now,
          lte: threeDaysFromNow,
        },
      },
    });

    let createdExpiring = 0;
    for (const coupon of expiringCoupons) {
      if (coupon.usedCount >= coupon.usageLimit) continue;

      // Verificar si ya notificamos sobre este cupón como POR VENCER
      const existing = await prisma.notification.findFirst({
        where: {
          userId,
          couponId: coupon.id,
          type: 'COUPON_EXPIRING',
        },
      });

      if (!existing) {
        const daysLeft = Math.max(1, Math.ceil((coupon.expiresAt!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        const discountText = coupon.discountType === 'PERCENTAGE' ? `${coupon.percent}% OFF` : `$${coupon.amount} OFF`;

        await prisma.notification.create({
          data: {
            userId,
            couponId: coupon.id,
            type: 'COUPON_EXPIRING',
            title: `¡Tu cupón "${coupon.code}" vence pronto!`,
            message: `Tu descuento especial de ${discountText} vence en ${daysLeft} día(s). ¡Aprovéchalo antes de que caduque!`,
            link: '/mi-taller?tab=beneficios',
          },
        });
        createdExpiring++;
      }
    }

    // 2. Buscar cupones asignados al usuario que YA VENCIERON (en los últimos 30 días)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const expiredCoupons = await prisma.discountCode.findMany({
      where: {
        userId,
        expiresAt: {
          gte: thirtyDaysAgo,
          lte: now,
        },
      },
    });

    let createdExpired = 0;
    for (const coupon of expiredCoupons) {
      if (coupon.usedCount >= coupon.usageLimit) continue;

      // Verificar si ya notificamos sobre este cupón como VENCIDO
      const existing = await prisma.notification.findFirst({
        where: {
          userId,
          couponId: coupon.id,
          type: 'COUPON_EXPIRED',
        },
      });

      if (!existing) {
        const discountText = coupon.discountType === 'PERCENTAGE' ? `${coupon.percent}% OFF` : `$${coupon.amount} OFF`;

        await prisma.notification.create({
          data: {
            userId,
            couponId: coupon.id,
            type: 'COUPON_EXPIRED',
            title: `El cupón "${coupon.code}" ha expirado`,
            message: `Lamentablemente tu cupón de ${discountText} ha alcanzado su fecha de expiración y ya no está activo.`,
            link: '/mi-taller?tab=beneficios',
          },
        });
        createdExpired++;
      }
    }

    return {
      success: true,
      expiringCount: createdExpiring,
      expiredCount: createdExpired,
    };
  } catch (error) {
    console.error('Error checking expiring coupons:', error);
    return {
      success: false,
      expiringCount: 0,
      expiredCount: 0,
      error: 'Error al verificar expiración de cupones',
    };
  }
}
