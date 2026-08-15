'use server';
import { clearAuthCookie, getAuthCookie, verifyToken } from '@/src/lib/auth/tokens';
import prisma from '@/src/lib/prisma';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  try {
    const token = await getAuthCookie();
    if (token) {
      const payload = await verifyToken(token);
      if (payload?.jti) {
        await prisma.session.delete({ where: { id: payload.jti } }).catch(() => {});
      }
    }
  } catch (e) {
    // Ignore errors
  } finally {
    await clearAuthCookie();
  }
  
  redirect('/');
}
