'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MdDashboard,
  MdShoppingBag,
  MdCategory,
  MdConfirmationNumber,
  MdReceiptLong,
  MdAutoAwesome,
  MdPeople,
  MdStar,
  MdEmail,
  MdSettings,
  MdShield,
  MdBarChart,
  MdStorefront,
  MdLogout,
  MdChevronLeft,
  MdChevronRight,
  MdMenu,
  MdClose,
} from 'react-icons/md';
const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'GENERAL',
    items: [
      { label: 'Dashboard', href: '/admin', icon: MdDashboard },
    ],
  },
  {
    title: 'CATÁLOGO',
    items: [
      { label: 'Productos', href: '/admin/productos', icon: MdShoppingBag, badge: '45' },
      { label: 'Categorías', href: '/admin/categorias', icon: MdCategory, badge: '8' },
      { label: 'Cupones', href: '/admin/cupones', icon: MdConfirmationNumber, badge: '3' },
    ],
  },
  {
    title: 'VENTAS & ENCARGOS',
    items: [
      { label: 'Pedidos', href: '/admin/pedidos', icon: MdReceiptLong, badge: '8', badgeColor: 'bg-amber-700/80 text-amber-100' },
      { label: 'Encargos a Medida', href: '/admin/encargos', icon: MdAutoAwesome, badge: 'Nuevo', badgeColor: 'bg-rose-800/80 text-rose-100' },
      { label: 'Reseñas', href: '/admin/resenas', icon: MdStar, badge: '2' },
    ],
  },
  {
    title: 'CLIENTES & MARKETING',
    items: [
      { label: 'Usuarios', href: '/admin/usuarios', icon: MdPeople },
      { label: 'Newsletter', href: '/admin/newsletter', icon: MdEmail },
    ],
  },
  {
    title: 'SISTEMA',
    items: [
      { label: 'Configuración', href: '/admin/configuracion', icon: MdSettings },
      { label: 'Auditoría', href: '/admin/auditoria', icon: MdShield },
      { label: 'Reportes', href: '/admin/reportes', icon: MdBarChart },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Botón flotante para menú móvil */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-[#241f1c] text-amber-100 rounded-xl shadow-md border border-stone-700/50 hover:bg-stone-800 transition-colors"
        aria-label="Abrir menú de administración"
      >
        {mobileOpen ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
      </button>

      {/* Overlay oscuro para pantallas móviles */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* ASIDE BARRA LATERAL */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-[#241f1c] text-stone-300 border-r border-[#332c28] flex flex-col justify-between transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* HEADER DEL SIDEBAR: Brand Logo */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#332c28]">
            <Link
              href="/admin"
              className="flex items-center gap-3 overflow-hidden group"
            >
              <img
                src={LOGO_URL}
                alt="Logo Oficial Yamgurumi"
                className="w-9 h-9 rounded-full object-cover border border-stone-600/60 shadow-xs group-hover:scale-105 transition-transform shrink-0"
              />
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-headline font-bold text-base text-stone-100 tracking-wide leading-none">
                    Yamgurumi
                  </span>
                  <span className="text-[10px] font-medium tracking-wider text-amber-300/80 uppercase mt-0.5">
                    Panel Admin
                  </span>
                </div>
              )}
            </Link>

            {/* Botón de colapsar (escritorio) */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-[#332c28] transition-colors"
              title={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
            >
              {collapsed ? <MdChevronRight className="text-xl" /> : <MdChevronLeft className="text-xl" />}
            </button>
          </div>

          {/* LISTA DE NAVEGACIÓN */}
          <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1">
                {!collapsed && (
                  <h3 className="px-3 text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                    {group.title}
                  </h3>
                )}
                {collapsed && groupIdx > 0 && (
                  <div className="my-2 border-t border-[#332c28]" />
                )}

                <div className="space-y-0.5 mt-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === '/admin'
                        ? pathname === '/admin'
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                          isActive
                            ? 'bg-[#352d29] text-amber-100 font-semibold border border-amber-500/20 shadow-2xs'
                            : 'text-stone-400 hover:bg-[#2c2623] hover:text-stone-200 border border-transparent'
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon
                          className={`text-lg shrink-0 transition-colors ${
                            isActive ? 'text-amber-400' : 'text-stone-400 group-hover:text-amber-200'
                          }`}
                        />

                        {!collapsed && (
                          <span className="truncate flex-1">{item.label}</span>
                        )}

                        {!collapsed && item.badge !== undefined && (
                          <span
                            className={`px-1.5 py-0.2 text-[10px] font-medium rounded-md ${
                              item.badgeColor || 'bg-[#332c28] text-stone-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {collapsed && (
                          <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1f1b19] text-amber-200 text-xs rounded-md border border-[#3d3430] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
                            {item.label}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* FOOTER DEL SIDEBAR */}
        <div className="p-3 border-t border-[#332c28] bg-[#241f1c] space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-amber-200 hover:bg-[#2d2724] transition-colors group"
            title={collapsed ? 'Volver a la Tienda Pública' : undefined}
          >
            <MdStorefront className="text-lg shrink-0 text-stone-400 group-hover:text-amber-200" />
            {!collapsed && <span className="truncate">Ver Tienda</span>}
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-rose-300 hover:bg-[#2d2724] transition-colors group"
              title={collapsed ? 'Cerrar Sesión' : undefined}
            >
              <MdLogout className="text-lg shrink-0 text-stone-400 group-hover:text-rose-300" />
              {!collapsed && <span className="truncate">Cerrar Sesión</span>}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
