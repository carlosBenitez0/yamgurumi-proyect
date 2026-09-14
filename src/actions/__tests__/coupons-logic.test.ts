import { describe, it, expect } from "vitest";

export interface MockDiscount {
  id: string;
  code: string;
  percent: number;
  userId: string | null;
  isActive: boolean;
  usedCount: number;
  usageLimit: number;
  expiresAt: Date | null;
}

export function validateCouponLogic(
  discount: MockDiscount | null,
  currentUserId: string | null
): { success: boolean; error?: string; percent?: number; couponId?: string } {
  if (!discount) {
    return { success: false, error: "El código de descuento no es válido o no está disponible." };
  }

  if (!discount.isActive) {
    return { success: false, error: "El código de descuento no está activo." };
  }

  // Verificar si el cupón está asignado a otro usuario distinto
  if (discount.userId && discount.userId !== currentUserId) {
    return { success: false, error: "Este cupón está asignado a otro usuario." };
  }

  if (discount.expiresAt && new Date() > discount.expiresAt) {
    return { success: false, error: "Este código de descuento ha expirado." };
  }

  if (discount.usedCount >= discount.usageLimit) {
    return { success: false, error: "Este código de descuento ya alcanzó su límite de usos." };
  }

  return {
    success: true,
    percent: discount.percent,
    couponId: discount.id,
  };
}

describe("Coupon Logic Validation", () => {
  const activeCoupon: MockDiscount = {
    id: "coup-1",
    code: "BIENVENIDA",
    percent: 15,
    userId: null,
    isActive: true,
    usedCount: 0,
    usageLimit: 10,
    expiresAt: null,
  };

  it("debe validar un cupón activo global exitosamente", () => {
    const result = validateCouponLogic(activeCoupon, "user-123");
    expect(result.success).toBe(true);
    expect(result.percent).toBe(15);
    expect(result.couponId).toBe("coup-1");
  });

  it("debe rechazar un cupón nulo o inexistente", () => {
    const result = validateCouponLogic(null, "user-123");
    expect(result.success).toBe(false);
    expect(result.error).toContain("no es válido");
  });

  it("debe rechazar un cupón inactivo", () => {
    const inactiveCoupon = { ...activeCoupon, isActive: false };
    const result = validateCouponLogic(inactiveCoupon, "user-123");
    expect(result.success).toBe(false);
    expect(result.error).toContain("no está activo");
  });

  it("debe rechazar un cupón expirado", () => {
    const expiredDate = new Date(Date.now() - 86400000); // Ayer
    const expiredCoupon = { ...activeCoupon, expiresAt: expiredDate };
    const result = validateCouponLogic(expiredCoupon, "user-123");
    expect(result.success).toBe(false);
    expect(result.error).toContain("ha expirado");
  });

  it("debe rechazar un cupón que ha alcanzado su límite de usos", () => {
    const maxedCoupon = { ...activeCoupon, usedCount: 5, usageLimit: 5 };
    const result = validateCouponLogic(maxedCoupon, "user-123");
    expect(result.success).toBe(false);
    expect(result.error).toContain("alcanzó su límite de usos");
  });

  it("debe rechazar si el cupón está asignado a un usuario diferente", () => {
    const userAssignedCoupon = { ...activeCoupon, userId: "user-456" };
    const result = validateCouponLogic(userAssignedCoupon, "user-123");
    expect(result.success).toBe(false);
    expect(result.error).toContain("asignado a otro usuario");
  });

  it("debe permitir a un usuario usar su propio cupón asignado", () => {
    const userAssignedCoupon = { ...activeCoupon, userId: "user-123" };
    const result = validateCouponLogic(userAssignedCoupon, "user-123");
    expect(result.success).toBe(true);
    expect(result.percent).toBe(15);
  });
});
