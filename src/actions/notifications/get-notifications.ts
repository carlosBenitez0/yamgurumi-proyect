'use server';

import prisma from '@/src/lib/prisma';
import { getAuthCookie, verifyToken } from '@/src/lib/auth/tokens';
import { NotificationType } from '@prisma/client';

export type SerializedNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  couponId: string | null;
  isRead: boolean;
  createdAt: string;
};

export async function getUserNotificationsAction(): Promise<{
  success: boolean;
  notifications: SerializedNotification[];
  unreadCount: number;
  error?: string;
}> {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return { success: true, notifications: [], unreadCount: 0 };
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) {
      return { success: true, notifications: [], unreadCount: 0 };
    }

    const userId = payload.sub;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    const serialized: SerializedNotification[] = notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      link: n.link,
      couponId: n.couponId,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    }));

    return {
      success: true,
      notifications: serialized,
      unreadCount,
    };
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    return {
      success: false,
      notifications: [],
      unreadCount: 0,
      error: 'Error al obtener tus notificaciones.',
    };
  }
}
