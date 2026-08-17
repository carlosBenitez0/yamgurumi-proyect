'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MdSearch,
  MdNotifications,
  MdAdd,
  MdPerson,
  MdOpenInNew,
  MdShield,
  MdKeyboardArrowDown,
} from 'react-icons/md';

const getBreadcrumbTitle = (pathname: string): string => {
  if (pathname === '/admin') return 'Dashboard Principal';
  if (pathname.startsWith('/admin/productos')) return 'Gestión de Productos';
  if (pathname.startsWith('/admin/categorias')) return 'Gestión de Categorías';
  if (pathname.startsWith('/admin/cupones')) return 'Cupones & Promociones';
  if (pathname.startsWith('/admin/pedidos')) return 'Gestión de Pedidos';
  if (pathname.startsWith('/admin/encargos')) return 'Encargos a Medida';
  if (pathname.startsWith('/admin/resenas')) return 'Moderación de Reseñas';
  if (pathname.startsWith('/admin/usuarios')) return 'Gestión de Clientes';
  if (pathname.startsWith('/admin/newsletter')) return 'Suscriptores & Marketing';
  if (pathname.startsWith('/admin/configuracion')) return 'Configuraciones de la Tienda';
  if (pathname.startsWith('/admin/auditoria')) return 'Bitácora de Auditoría';
  if (pathname.startsWith('/admin/reportes')) return 'Reportes & Analíticas';
  return 'Administración';
};

export default function AdminHeader() {
  const pathname = usePathname();
  const pageTitle = getBreadcrumbTitle(pathname);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#faf7f2]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* TÍTULO Y BREADCRUMB */}
      <div className="pl-12 lg:pl-0 flex flex-col">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
          <Link href="/admin" className="hover:text-amber-800 transition-colors">
            Admin
          </Link>
          <span>/</span>
          <span className="text-stone-700 font-semibold">{pageTitle}</span>
        </div>
        <h1 className="font-headline font-bold text-lg sm:text-xl text-stone-800 tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* DERECHA: BÚSQUEDA + ACCIONES + NOTIFICACIONES + PERFIL */}
      <div className="flex items-center gap-3">
        {/* Búsqueda Rápida */}
        <div className="hidden md:flex items-center relative w-56 lg:w-72">
          <MdSearch className="absolute left-3 text-stone-400 text-lg pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar en el sistema..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700/20 transition-all shadow-2xs"
          />
        </div>

        {/* Botón Acción Rápida */}
        <Link
          href="/admin/productos/nuevo"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-xl shadow-xs transition-all transform hover:-translate-y-0.5"
        >
          <MdAdd className="text-base" />
          <span>Nuevo Producto</span>
        </Link>

        {/* Menú Notificaciones */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative p-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors shadow-2xs"
            aria-label="Ver notificaciones"
          >
            <MdNotifications className="text-lg" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-2xl shadow-xl p-4 z-50 text-stone-800 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-headline font-bold text-xs text-stone-800">
                  Notificaciones
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-full">
                  3 Nuevas
                </span>
              </div>
              <div className="divide-y divide-stone-100 text-xs">
                <div className="py-2.5 hover:bg-stone-50 px-2 rounded-lg transition-colors cursor-pointer">
                  <p className="font-semibold text-stone-800">✨ Nuevo Pedido Recibido #ORD-8492</p>
                  <p className="text-stone-500 text-[11px] mt-0.5">Hace 12 min — Total: $42.50 por WhatsApp</p>
                </div>
                <div className="py-2.5 hover:bg-stone-50 px-2 rounded-lg transition-colors cursor-pointer">
                  <p className="font-semibold text-amber-800">⚠️ Alerta de Stock Bajo</p>
                  <p className="text-stone-500 text-[11px] mt-0.5">"Oso Amigurumi Gigante" tiene 1 unid.</p>
                </div>
              </div>
              <div className="pt-2 border-t border-stone-100 text-center">
                <Link
                  href="/admin/pedidos"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-semibold text-[#206776] hover:underline"
                >
                  Ver todos los pedidos →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* PERFIL ADMINISTRADOR */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1 pr-2.5 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-[#72594e] text-white flex items-center justify-center font-bold text-xs">
              CB
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-stone-800 leading-none">
                Carlos Benítez
              </span>
              <span className="text-[10px] text-stone-500 flex items-center gap-0.5 mt-0.5">
                <MdShield className="text-[10px] text-[#206776]" /> Admin
              </span>
            </div>
            <MdKeyboardArrowDown className="text-stone-400 text-base hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-xl p-3 z-50 text-stone-800 animate-in fade-in duration-150">
              <div className="p-2.5 bg-stone-50 rounded-xl mb-2">
                <p className="font-bold text-xs text-stone-800">Carlos Benítez</p>
                <p className="text-[11px] text-stone-500 truncate">admin@yamgurumi.com</p>
              </div>
              <div className="space-y-0.5 text-xs font-medium">
                <Link
                  href="/admin/configuracion"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <MdPerson className="text-sm text-stone-500" />
                  <span>Ajustes de Perfil</span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <MdOpenInNew className="text-sm text-stone-500" />
                  <span>Ver Tienda</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
