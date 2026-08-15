"use server";

import prisma from "@/src/lib/prisma";
import { getAuthCookie, verifyToken } from "@/src/lib/auth/tokens";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(productId: string) {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return { error: "Debes iniciar sesión para guardar tus amigurumis favoritos 💖" };
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) {
      return { error: "Sesión no válida. Por favor inicia sesión nuevamente." };
    }

    const userId = payload.sub;

    // Verificar si ya existe en favoritos
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    let isFavorite = false;

    if (existing) {
      // Eliminar de favoritos
      await prisma.favorite.delete({
        where: {
          id: existing.id,
        },
      });
      isFavorite = false;
    } else {
      // Agregar a favoritos
      await prisma.favorite.create({
        data: {
          userId,
          productId,
        },
      });
      isFavorite = true;
    }

    revalidatePath("/mi-taller");
    revalidatePath("/catalog");

    return { success: true, isFavorite, productId };
  } catch (error) {
    console.error("Error al alternar favorito:", error);
    return { error: "Ocurrió un error al actualizar tus favoritos." };
  }
}
