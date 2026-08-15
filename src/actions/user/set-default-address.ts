"use server";

import prisma from "@/src/lib/prisma";
import { getAuthCookie, verifyToken } from "@/src/lib/auth/tokens";
import { revalidatePath } from "next/cache";

export async function setDefaultAddressAction(addressId: string) {
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

    // Transacción atómica: quitar isDefault a todas y asignarlo a la seleccionada
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      }),
    ]);

    revalidatePath("/mi-taller");
    return { success: true };
  } catch (error) {
    console.error("Error al establecer dirección principal:", error);
    return { error: "Ocurrió un error al actualizar la dirección principal." };
  }
}
