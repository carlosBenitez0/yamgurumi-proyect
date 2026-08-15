"use server";

import prisma from "@/src/lib/prisma";
import { getAuthCookie, verifyToken } from "@/src/lib/auth/tokens";
import { revalidatePath } from "next/cache";

export async function deleteAddressAction(addressId: string) {
  try {
    const token = await getAuthCookie();
    if (!token) return { error: "No autenticado" };

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) return { error: "Sesión no válida" };

    const userId = payload.sub;

    // Verificar que la dirección pertenezca al usuario
    const target = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!target) {
      return { error: "Dirección no encontrada" };
    }

    // Eliminar la dirección
    await prisma.address.delete({
      where: { id: addressId },
    });

    // Si la dirección eliminada era la principal, hacer la primera restante como principal
    if (target.isDefault) {
      const firstRemaining = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "asc" },
      });

      if (firstRemaining) {
        await prisma.address.update({
          where: { id: firstRemaining.id },
          data: { isDefault: true },
        });
      }
    }

    revalidatePath("/mi-taller");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar dirección:", error);
    return { error: "Ocurrió un error al eliminar la dirección." };
  }
}
