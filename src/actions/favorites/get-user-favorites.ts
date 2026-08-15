"use server";

import prisma from "@/src/lib/prisma";
import { getAuthCookie, verifyToken } from "@/src/lib/auth/tokens";
import { products, Product } from "@/data/products";

export async function getUserFavoritesAction(): Promise<{ favoriteIds: string[]; favoriteProducts: Product[] }> {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return { favoriteIds: [], favoriteProducts: [] };
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) {
      return { favoriteIds: [], favoriteProducts: [] };
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: payload.sub,
      },
      select: {
        productId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const favoriteIds = favorites.map((f) => f.productId);

    // Mapear con la lista de productos estáticos
    const favoriteProducts = favoriteIds
      .map((id) => products.find((p) => p.id === id || p.slug === id))
      .filter((p): p is Product => p !== undefined);

    return { favoriteIds, favoriteProducts };
  } catch (error) {
    console.error("Error al obtener favoritos del usuario:", error);
    return { favoriteIds: [], favoriteProducts: [] };
  }
}
