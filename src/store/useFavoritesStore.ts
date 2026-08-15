import { create } from "zustand";
import { products, Product } from "@/data/products";
import { toggleFavoriteAction } from "@/src/actions/favorites/toggle-favorite";
import { getUserFavoritesAction } from "@/src/actions/favorites/get-user-favorites";

interface FavoritesState {
  favoritesMap: Record<string, boolean>;
  favoriteProducts: Product[];
  isInitialized: boolean;
  isLoading: boolean;
  
  // Acciones
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<{ success?: boolean; error?: string }>;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoritesMap: {},
  favoriteProducts: [],
  isInitialized: false,
  isLoading: false,

  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const { favoriteIds, favoriteProducts } = await getUserFavoritesAction();
      const map: Record<string, boolean> = {};
      favoriteIds.forEach((id) => {
        map[id] = true;
      });

      set({
        favoritesMap: map,
        favoriteProducts,
        isInitialized: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error al cargar favoritos store:", error);
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (productId: string) => {
    const { favoritesMap, favoriteProducts } = get();
    const currentIsFav = !!favoritesMap[productId];
    const newIsFav = !currentIsFav;

    // Actualización optimista inmediata
    const newMap = { ...favoritesMap, [productId]: newIsFav };
    let newProducts = [...favoriteProducts];

    if (newIsFav) {
      const prodToAdd = products.find((p) => p.id === productId || p.slug === productId);
      if (prodToAdd && !newProducts.some((p) => p.id === prodToAdd.id)) {
        newProducts.unshift(prodToAdd);
      }
    } else {
      newProducts = newProducts.filter((p) => p.id !== productId && p.slug !== productId);
    }

    set({
      favoritesMap: newMap,
      favoriteProducts: newProducts,
    });

    // Llamar a Server Action
    const res = await toggleFavoriteAction(productId);

    if (res.error) {
      // Revertir en caso de error (p.ej. no logueado)
      set({
        favoritesMap,
        favoriteProducts,
      });
      return { error: res.error };
    }

    return { success: true };
  },

  isFavorite: (productId: string) => {
    return !!get().favoritesMap[productId];
  },
}));
