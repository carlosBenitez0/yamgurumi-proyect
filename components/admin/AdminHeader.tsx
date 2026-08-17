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
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700/20 transition-all shadow-2xs"
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
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-2xl shadow-xl p-4 z-50 text-stone-800 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-headline font-bold text-xs text-stone-800">
                  Notificaciones del Sistema
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-full">
                  4 Activas
                </span>
              </div>

              <div className="divide-y divide-stone-100 text-xs my-1">
                {/* 1. Alerta de Stock Bajo -> Redirige a Gestión de Productos filtrado por Stock Bajo */}
                <Link
                  href="/admin/productos?status=out_of_stock"
                  onClick={() => setNotifOpen(false)}
                  className="block py-2.5 px-2.5 hover:bg-amber-50/60 rounded-[8px] transition-colors group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-amber-900 group-hover:text-amber-700 transition-colors">
                      ⚠️ Alerta de Inventario (Poco Stock)
                    </p>
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-1.5 py-0.5 rounded">
                      Ver producto
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px] mt-0.5">
                    "Oso Teddy Tejido" tiene solo 1 unidad restante. Haz clic para gestionar stock.
                  </p>
                </Link>

                {/* 2. Nuevo Pedido -> Redirige al Pedido Específico en Gestión de Pedidos */}
                <Link
                  href="/admin/pedidos?search=ORD-8492"
                  onClick={() => setNotifOpen(false)}
                  className="block py-2.5 px-2.5 hover:bg-stone-50 rounded-[8px] transition-colors group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-stone-800 group-hover:text-[#206776] transition-colors">
                      ✨ Nuevo Pedido Recibido #ORD-8492
                    </p>
                    <span className="text-[10px] text-stone-400">12 min</span>
                  </div>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Cliente: María González — Total: $42.50 via WhatsApp. Haz clic para ver detalles.
                  </p>
                </Link>

                {/* 3. Encargo Personalizado -> Redirige a Encargos a Medida */}
                <Link
                  href="/admin/encargos"
                  onClick={() => setNotifOpen(false)}
                  className="block py-2.5 px-2.5 hover:bg-stone-50 rounded-[8px] transition-colors group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-stone-800 group-hover:text-[#206776] transition-colors">
                      🧶 Solicitud de Encargo a Medida
                    </p>
                    <span className="text-[10px] text-stone-400">1 hora</span>
                  </div>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Cotización enviada para amigurumi "Dragón Mágico 35cm".
                  </p>
                </Link>

                {/* 4. Reseña -> Redirige a Moderación de Reseñas */}
                <Link
                  href="/admin/resenas"
                  onClick={() => setNotifOpen(false)}
                  className="block py-2.5 px-2.5 hover:bg-stone-50 rounded-[8px] transition-colors group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-stone-800 group-hover:text-[#206776] transition-colors">
                      ⭐ Nueva Reseña (5 Estrellas)
                    </p>
                    <span className="text-[10px] text-stone-400">3 horas</span>
                  </div>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Sofía M. publicó una reseña en "Gatito Amigurumi".
                  </p>
                </Link>
              </div>

              <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                <Link
                  href="/admin/pedidos"
                  onClick={() => setNotifOpen(false)}
                  className="font-semibold text-[#206776] hover:underline"
                >
                  Ver Pedidos →
                </Link>
                <Link
                  href="/admin/productos?status=out_of_stock"
                  onClick={() => setNotifOpen(false)}
                  className="font-semibold text-amber-800 hover:underline"
                >
                  Ver Poco Stock →
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
