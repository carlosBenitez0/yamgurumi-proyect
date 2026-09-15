'use client';

import React from 'react';
import Link from 'next/link';
import { MdConfirmationNumber, MdShoppingBag, MdNotifications, MdTimer, MdCancel } from 'react-icons/md';
import { SerializedNotification } from '@/src/actions/notifications/get-notifications';

interface NotificationItemProps {
  notification: SerializedNotification;
  onMarkRead: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const getNotificationStyle = () => {
    switch (notification.type) {
      case 'COUPON_EXPIRING':
        return {
          icon: <MdTimer className="text-amber-800 text-lg" />,
          bgIcon: 'bg-amber-100',
          badgeText: 'Cupón por Vencer',
          badgeColor: 'bg-amber-50 text-amber-900 border-amber-200/80',
        };
      case 'COUPON_EXPIRED':
        return {
          icon: <MdCancel className="text-rose-700 text-lg" />,
          bgIcon: 'bg-rose-100',
          badgeText: 'Cupón Expirado',
          badgeColor: 'bg-rose-50 text-rose-800 border-rose-200/80',
        };
      case 'ORDER_STATUS':
        return {
          icon: <MdShoppingBag className="text-secondary text-lg" />,
          bgIcon: 'bg-secondary-container/40',
          badgeText: 'Pedido',
          badgeColor: 'bg-secondary-container/30 text-secondary border-secondary/20',
        };
      default:
        return {
          icon: <MdNotifications className="text-stone-700 text-lg" />,
          bgIcon: 'bg-stone-100',
          badgeText: 'Aviso',
          badgeColor: 'bg-stone-100 text-stone-700 border-stone-200',
        };
    }
  };

  const style = getNotificationStyle();

  const formattedDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const content = (
    <div
      onClick={() => {
        if (!notification.isRead) onMarkRead(notification.id);
      }}
      className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-200 border flex gap-3 sm:gap-3.5 relative cursor-pointer ${
        notification.isRead
          ? 'bg-surface-container-lowest border-primary-container/15 hover:border-secondary/20 opacity-80 hover:opacity-100'
          : 'bg-amber-50/40 border-amber-200/60 shadow-xs hover:border-amber-300'
      }`}
    >
      {/* Unread dot indicator */}
      {!notification.isRead && (
        <span className="w-2.5 h-2.5 rounded-full bg-secondary absolute top-3.5 right-3.5 animate-pulse" />
      )}

      {/* Icon */}
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0 flex items-center justify-center ${style.bgIcon}`}>
        {style.icon}
      </div>

      {/* Main Content */}
      <div className="space-y-1 min-w-0 flex-1 pr-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${style.badgeColor}`}>
            {style.badgeText}
          </span>
          <span className="text-[10px] text-on-surface-variant/70 font-semibold">
            {formattedDate(notification.createdAt)}
          </span>
        </div>

        <h4 className="text-xs sm:text-sm font-bold text-on-surface font-headline leading-snug">
          {notification.title}
        </h4>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {notification.message}
        </p>
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} className="block shrink-0 focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
