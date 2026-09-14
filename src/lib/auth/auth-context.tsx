"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useFavoritesStore } from "@/src/store/useFavoritesStore";

interface AuthContextValue {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail?: string | null;
  /** Redirige al cliente a la página de iniciar sesión, para que pueda
   *  volver a donde estaba tras autenticarse. */
  redirectToLogin: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  session,
  children,
}: {
  session?: {
    sub?: string;
    email?: string;
    role?: string;
  } | null;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = Boolean(session);

  // Sincroniza los favoritos del store con la sesión. Cuando hay sesión,
  // carga los favoritos del usuario desde la base de datos; si no la hay,
  // deja el estado vacío.
  useEffect(() => {
    if (isAuthenticated) {
      useFavoritesStore.getState().fetchFavorites();
    }
    // Se ejecuta solo al montar con la sesión resultante de la carga inicial.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const currentPath = pathname || "/";
    return {
      isAuthenticated,
      isAdmin: Boolean(session && session.role === "ADMIN"),
      userEmail: session?.email ?? null,
      redirectToLogin: () => {
        router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      },
    };
  }, [isAuthenticated, session, router, pathname]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>.");
  }
  return ctx;
}
