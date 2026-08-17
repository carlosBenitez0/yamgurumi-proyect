import { getAuthCookie, verifyToken, JWTPayload } from '@/src/lib/auth/tokens';
import { Role } from '@prisma/client';

export async function requireAdmin(): Promise<JWTPayload> {
  const token = await getAuthCookie();
  if (!token) {
    throw new Error('No autorizado: sesión no iniciada');
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== Role.ADMIN) {
    throw new Error('Acceso denegado: se requieren permisos de administrador');
  }

  return payload;
}
