'use server';

import prisma from '@/src/lib/prisma';
import { getAuthCookie, verifyToken } from '@/src/lib/auth/tokens';

export async function markNotificationAsReadAction(notificationId?: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const token = await getAuthCookie();
    if (!token) return { success: false, error: 'No autorizado' };

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) return { success: false, error: 'Token inválido' };

    const userId = payload.sub;

    if (notificationId) {
      await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId,
        },
        data: {
          isRead: true,
        },
      });
    } else {
      // Marcar todas como leídas
      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Error al actualizar estado de la notificación' };
  }
}
