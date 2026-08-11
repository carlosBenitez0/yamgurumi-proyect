import { prisma } from '../prisma';
import { verifyToken, clearAuthCookie, JWTPayload, getAuthCookie } from './tokens';

export async function getSession(): Promise<JWTPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) {
    await clearAuthCookie();
    return null;
  }

  // Verify session exists in DB and is valid
  const session = await prisma.session.findUnique({
    where: { id: payload.jti },
    include: { user: true }
  });

  if (!session || session.expiresAt < new Date()) {
    await clearAuthCookie();
    return null;
  }

  return payload;
}

export async function requireAuth(): Promise<JWTPayload> {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function requireAdmin(): Promise<JWTPayload> {
  const session = await requireAuth();
  if (session.role !== 'ADMIN') throw new Error('Forbidden');
  return session;
}

export async function destroySession(sessionId: string) {
  await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
  await clearAuthCookie();
}
