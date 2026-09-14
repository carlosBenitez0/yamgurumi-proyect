'use server';

import prisma from '@/src/lib/prisma';
import { rateLimit, RATE_LIMITS } from '@/src/lib/rate-limit';
import { getAuthCookie, verifyToken } from '@/src/lib/auth/tokens';

export type DiscountResult = {
  success: boolean;
  percent?: number;
  code?: string;
  couponId?: string;
  error?: string;
};

export async function applyDiscountAction(code: string): Promise<DiscountResult> {
  if (!code || code.trim() === '') {
    return { success: false, error: 'Código de descuento requerido.' };
  }

  const cleanCode = code.trim().toUpperCase();

  // 1. Rate Limit check
  const rlKey = `discount:${cleanCode}`;
  const rl = await rateLimit(rlKey, RATE_LIMITS.applyDiscount.limit, RATE_LIMITS.applyDiscount.windowMs);
  if (!rl.success) {
    return { 
      success: false, 
      error: 'Demasiados intentos. Por favor intenta de nuevo en unos minutos.' 
    };
  }

  try {
    const token = await getAuthCookie();
    let currentUserId: string | null = null;
    if (token) {
      const payload = await verifyToken(token);
      if (payload && payload.sub) {
        currentUserId = payload.sub;
      }
    }

    // 2. Buscar primero cupón personalizado asignado al usuario
    let discount = null;
    if (currentUserId) {
      discount = await prisma.discountCode.findFirst({
        where: {
          code: cleanCode,
          userId: currentUserId,
          isActive: true,
        },
      });
    }

    // Si no tiene cupón personalizado, buscar cupón público general
    if (!discount) {
      discount = await prisma.discountCode.findFirst({
        where: {
          code: cleanCode,
          userId: null,
          isActive: true,
        },
      });
    }

    if (!discount) {
      return { success: false, error: 'El código de descuento no es válido o no está disponible.' };
    }

    // 3. Check expiration
    if (discount.expiresAt && new Date() > discount.expiresAt) {
      return { success: false, error: 'Este código de descuento ha expirado.' };
    }

    // 4. Check usage limit
    if (discount.usedCount >= discount.usageLimit) {
      return { success: false, error: 'Este código de descuento ya alcanzó su límite de usos.' };
    }

    // 5. ¡Válido!
    return {
      success: true,
      percent: discount.percent,
      code: cleanCode,
      couponId: discount.id,
    };
  } catch (error) {
    console.error('Error applying discount:', error);
    return {
      success: false,
      error: 'Ocurrió un error al validar el cupón. Intenta de nuevo.'
    };
  }
}

export async function redeemDiscountAction(code: string, couponId?: string): Promise<{ success: boolean; error?: string }> {
  if ((!code || code.trim() === '') && !couponId) return { success: false, error: 'Código o ID requerido' };
  const cleanCode = code ? code.trim().toUpperCase() : '';

  try {
    let discount = null;
    if (couponId) {
      discount = await prisma.discountCode.findUnique({ where: { id: couponId } });
    } else {
      const token = await getAuthCookie();
      let userId: string | null = null;
      if (token) {
        const payload = await verifyToken(token);
        if (payload?.sub) userId = payload.sub;
      }

      discount = await prisma.discountCode.findFirst({
        where: {
          code: cleanCode,
          OR: [
            userId ? { userId } : { userId: null },
            { userId: null },
          ],
        },
      });
    }

    if (!discount) return { success: false, error: 'Código de descuento no encontrado' };

    if (discount.usedCount >= discount.usageLimit) {
      return { success: false, error: 'El código ya fue utilizado o alcanzó su límite de usos' };
    }

    await prisma.discountCode.update({
      where: { id: discount.id },
      data: { usedCount: { increment: 1 } },
    });

    return { success: true };
  } catch (error) {
    console.error('Error redeeming discount:', error);
    return { success: false, error: 'Error al marcar código como utilizado' };
  }
}

