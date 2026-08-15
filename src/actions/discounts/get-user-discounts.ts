'use server';

import prisma from '@/src/lib/prisma';
import { getAuthCookie, verifyToken } from '@/src/lib/auth/tokens';

export type AvailableDiscount = {
  code: string;
  percent: number;
  expiresAt: string | null;
};

export async function getUserAvailableDiscountsAction(): Promise<{
  success: boolean;
  discounts: AvailableDiscount[];
  error?: string;
}> {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return { success: true, discounts: [] };
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) {
      return { success: true, discounts: [] };
    }

    const discounts = await prisma.discountCode.findMany({
      where: {
        userId: payload.sub,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      select: {
        code: true,
        percent: true,
        usedCount: true,
        usageLimit: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filtrar únicamente los cupones que aún tienen usos disponibles
    const availableDiscounts = discounts
      .filter((d) => d.usedCount < d.usageLimit)
      .map((d) => ({
        code: d.code,
        percent: d.percent,
        expiresAt: d.expiresAt ? d.expiresAt.toISOString() : null,
      }));

    return {
      success: true,
      discounts: availableDiscounts,
    };
  } catch (error) {
    console.error('Error fetching user available discounts:', error);
    return {
      success: false,
      discounts: [],
      error: 'Error al obtener tus códigos de descuento.',
    };
  }
}
