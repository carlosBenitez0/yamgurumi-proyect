'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MdNotifications, MdDoneAll, MdClose, MdRefresh } from 'react-icons/md';
import { getUserNotificationsAction, SerializedNotification } from '@/src/actions/notifications/get-notifications';
import { markNotificationAsReadAction } from '@/src/actions/notifications/mark-read';
import { checkAndNotifyExpiringCouponsAction } from '@/src/actions/notifications/check-coupon-expirations';
import NotificationItem from './NotificationItem';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SerializedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // 1. Ejecutar chequeo automático de cupones vencidos/por vencer
      await checkAndNotifyExpiringCouponsAction();

      // 2. Traer notificaciones actualizadas
      const res = await getUserNotificationsAction();
      if (res.success) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Actualización periódica cada 3 minutos
    const interval = setInterval(fetchNotifications, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkRead = async (id?: string) => {
    try {
      if (id) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        await markNotificationAsReadAction(id);
      } else {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        await markNotificationAsReadAction();
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Icono de Campana */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2.5 hover:bg-secondary-container/50 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center focus-ring tactile-press cursor-pointer text-secondary"
        aria-label="Notificaciones"
        title="Centro de Notificaciones"
      >
        <MdNotifications className="w-5 h-5 text-secondary" />

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-tertiary text-on-tertiary text-[9px] font-bold rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(129,82,76,0.3)] animate-[cart-bounce_2s_ease-in-out_infinite]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Desplegable / Popover */}
      {isOpen && (
        <div className="absolute right-0 sm:right-0 top-full mt-2 w-[320px] sm:w-[380px] bg-surface-container-lowest border border-primary-container/30 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header del Popover */}
          <div className="p-3.5 sm:p-4 border-b border-primary-container/20 flex items-center justify-between bg-surface-container-low/40">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-1.5 whitespace-nowrap">
                <MdNotifications className="text-secondary text-base shrink-0" />
                <span>Notificaciones</span>
              </h3>
              {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-2xs" title={`${unreadCount} no leídas`}>
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => handleMarkRead()}
                  className="p-1.5 text-secondary hover:bg-secondary-container/40 rounded-full transition-colors cursor-pointer"
                  title="Marcar todas como leídas"
                >
                  <MdDoneAll className="text-lg" />
                </button>
              )}

              <button
                type="button"
                onClick={fetchNotifications}
                disabled={isLoading}
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-low cursor-pointer transition-colors"
                title="Actualizar"
              >
                <MdRefresh className={`text-base ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-low cursor-pointer transition-colors"
                title="Cerrar"
              >
                <MdClose className="text-base" />
              </button>
            </div>
          </div>

          {/* Lista de Notificaciones */}
          <div className="max-h-[360px] sm:max-h-[420px] overflow-y-auto p-3 sm:p-4 flex flex-col gap-3 scrollbar-thin">
            {isLoading && notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-on-surface-variant space-y-2">
                <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Cargando tus notificaciones...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 px-4 text-center space-y-2">
                <div className="w-12 h-12 bg-secondary-container/30 text-secondary rounded-2xl flex items-center justify-center mx-auto text-2xl">
                  🧶
                </div>
                <h4 className="font-headline font-bold text-sm text-on-surface">¡Todo al día!</h4>
                <p className="text-xs text-on-surface-variant max-w-[220px] mx-auto">
                  No tienes notificaciones pendientes por ahora. ¡Te avisaremos cuando tengas cupones o novedades de tus amigurumis!
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={(id) => handleMarkRead(id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
