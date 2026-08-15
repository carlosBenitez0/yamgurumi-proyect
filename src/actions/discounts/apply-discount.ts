'use server';

import prisma from '@/src/lib/prisma';
import { rateLimit, RATE_LIMITS } from '@/src/lib/rate-limit';
import { getAuthCookie, verifyToken } from '@/src/lib/auth/tokens';

export type DiscountResult = {
  success: boolean;
  percent?: number;
  code?: string;
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
    // 2. Query DB
    const discount = await prisma.discountCode.findUnique({
      where: { code: cleanCode }
    });

    if (!discount) {
      return { success: false, error: 'El código de descuento no es válido.' };
    }

    // 3. Check expiration
    if (discount.expiresAt && new Date() > discount.expiresAt) {
      return { success: false, error: 'Este código de descuento ha expirado.' };
    }

    // 4. Check usage limit (Garantiza que sólo se use 1 vez si usageLimit es 1)
    if (discount.usedCount >= discount.usageLimit) {
      return { success: false, error: 'Este código de descuento ya fue utilizado y no está disponible.' };
    }

    // 5. Check user ownership (si el código está vinculado a un usuario en específico)
    const token = await getAuthCookie();
    if (token) {
      const payload = await verifyToken(token);
      if (payload && discount.userId && discount.userId !== payload.sub) {
        return { success: false, error: 'Este código de descuento es personal y pertenece a otro usuario.' };
      }
    }

    // 6. ¡Válido!
    return {
      success: true,
      percent: discount.percent,
      code: cleanCode,
    };
  } catch (error) {
    console.error('Error applying discount:', error);
    return {
      success: false,
      error: 'Ocurrió un error al validar el cupón. Intenta de nuevo.'
    };
  }
}

export async function redeemDiscountAction(code: string): Promise<{ success: boolean; error?: string }> {
  if (!code || code.trim() === '') return { success: false, error: 'Código requerido' };
  const cleanCode = code.trim().toUpperCase();

  try {
    const discount = await prisma.discountCode.findUnique({ where: { code: cleanCode } });
    if (!discount) return { success: false, error: 'Código no encontrado' };

    if (discount.usedCount >= discount.usageLimit) {
      return { success: false, error: 'El código ya fue utilizado' };
    }

    await prisma.discountCode.update({
      where: { code: cleanCode },
      data: { usedCount: { increment: 1 } },
    });

    return { success: true };
  } catch (error) {
    console.error('Error redeeming discount:', error);
    return { success: false, error: 'Error al marcar código como utilizado' };
  }
}
