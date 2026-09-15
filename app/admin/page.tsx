'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MdAttachMoney,
  MdReceiptLong,
  MdShoppingBag,
  MdPeople,
  MdTrendingUp,
  MdWarning,
  MdAutoAwesome,
  MdChevronRight,
  MdAdd,
  MdStorefront,
  MdRefresh,
  MdClose,
  MdEdit,
  MdLaunch,
  MdTimer,
  MdPersonAdd,
} from 'react-icons/md';

// Datos Mock con estilo sobrio y enfocado
const mockStats = [
  {
    id: 'ingresos',
    label: 'Ventas del Mes',
    value: '$2,485.00',
    change: '+14.2%',
    isPositive: true,
    description: 'vs. mes pasado ($2,175.00)',
    icon: MdAttachMoney,
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    iconBg: 'bg-emerald-100/70 text-emerald-800',
    clickableBadge: false,
  },
  {
    id: 'pedidos',
    label: 'Pedidos Pendientes',
    value: '8 pedidos',
    change: '3 urgentes',
    modalType: 'urgent_orders',
    isPositive: false,
    description: 'Requieren despacho esta semana',
    icon: MdReceiptLong,
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 cursor-pointer shadow-2xs font-bold',
    iconBg: 'bg-amber-100/70 text-amber-800',
    clickableBadge: true,
    tooltip: 'Clic para ver los 3 pedidos urgentes',
  },
  {
    id: 'productos',
    label: 'Productos en Catálogo',
    value: '45 amigurumis',
    change: '3 bajo stock',
    modalType: 'low_stock',
    isPositive: false,
    description: '8 categorías activas',
    icon: MdShoppingBag,
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100 cursor-pointer shadow-2xs font-bold',
    iconBg: 'bg-[#72594e]/10 text-[#72594e]',
    clickableBadge: true,
    tooltip: 'Clic para ver los 3 productos con bajo stock',
  },
  {
    id: 'clientes',
    label: 'Clientes Registrados',
    value: '128 usuarios',
    change: '+12 nuevos',
    modalType: 'new_customers',
    isPositive: true,
    description: '42 suscriptores newsletter',
    icon: MdPeople,
    badgeBg: 'bg-sky-50 text-sky-900 border-sky-300 hover:bg-sky-100 cursor-pointer shadow-2xs font-bold',
    iconBg: 'bg-[#206776]/10 text-[#206776]',
    clickableBadge: true,
    tooltip: 'Clic para ver los clientes más recientes',
  },
];

const recentOrders = [
  {
    id: 'ORD-8492',
    customer: 'María Fernández',
    email: 'maria.f@gmail.com',
    items: 'Oso Amigurumi Gigante (x1), Llavero Conejito (x2)',
    total: '$68.50',
    date: 'Hace 15 min',
    statusLabel: 'Pendiente Pago',
    statusBadge: 'bg-amber-50 text-amber-800 border-amber-200',
    isUrgent: true,
  },
  {
    id: 'ORD-8491',
    customer: 'Carlos Ramírez',
    email: 'carlos.r@hotmail.com',
    items: 'Cactus Tejido en Maceta (x1)',
    total: '$24.00',
    date: 'Hace 2 horas',
    statusLabel: 'Pago Confirmado',
    statusBadge: 'bg-teal-50 text-teal-800 border-teal-200',
    isUrgent: true,
  },
  {
    id: 'ORD-8490',
    customer: 'Lucía Gómez',
    email: 'lucia.g@yahoo.es',
    items: 'Set Navideño Muñecos Crochet (x1)',
    total: '$85.00',
    date: 'Ayer',
    statusLabel: 'En Proceso',
    statusBadge: 'bg-amber-50 text-amber-800 border-amber-200',
    isUrgent: true,
  },
  {
    id: 'ORD-8489',
    customer: 'Ana Martínez',
    email: 'ana.martinez@gmail.com',
    items: 'Llavero Kawaii Gatito (x3)',
    total: '$36.00',
    date: 'Hace 2 días',
    statusLabel: 'Entregado',
    statusBadge: 'bg-stone-100 text-stone-700 border-stone-200',
    isUrgent: false,
  },
];

const lowStockItems = [
  { id: '1', name: 'Oso Amigurumi Gigante', category: 'Muñecos', stock: 1, price: 45.0, status: 'Crítico' },
  { id: '2', name: 'Llavero Gatito Kawaii', category: 'Llaveros', stock: 0, price: 12.5, status: 'Agotado' },
  { id: '3', name: 'Cactus en Maceta Tejida', category: 'Decoración', stock: 2, price: 24.0, status: 'Bajo' },
];

const newCustomersList = [
  { id: 'usr_101', name: 'María Fernández', email: 'maria.f@gmail.com', date: 'Hoy', totalOrders: 2 },
  { id: 'usr_102', name: 'Carlos Ramírez', email: 'carlos.r@hotmail.com', date: 'Hoy', totalOrders: 1 },
  { id: 'usr_103', name: 'Lucía Gómez', email: 'lucia.g@yahoo.es', date: 'Ayer', totalOrders: 3 },
  { id: 'usr_104', name: 'Ana Martínez', email: 'ana.martinez@gmail.com', date: 'Hace 2 días', totalOrders: 1 },
];

const customRequests = [
  {
    id: 'REQ-104',
    customer: 'Sofía López',
    request: 'Amigurumi personalizado de mi perro Poodle',
    date: 'Hoy',
    status: 'Cotización Pendiente',
  },
  {
    id: 'REQ-103',
    customer: 'Diego Torres',
    request: 'Personaje Anime Naruto 30cm',
    date: 'Ayer',
    status: 'Presupuesto Enviado',
  },
];

export default function AdminDashboardPage() {
  const [activeModal, setActiveModal] = useState<'low_stock' | 'urgent_orders' | 'new_customers' | null>(null);

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* BANNER DE BIENVENIDA CÁLIDO Y SOBRIO */}
      <div className="rounded-[12px] bg-white border border-stone-200/90 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 tracking-tight">
            Bienvenido, Carlos
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            Hoy es {currentDate}. Resumen del estado de la tienda.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/productos/nuevo"
            className="px-3.5 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[8px] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MdAdd className="text-base" />
            <span>Añadir Producto</span>
          </Link>
          <Link
            href="/admin/pedidos"
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200/70 text-stone-700 font-semibold text-xs rounded-[8px] border border-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MdReceiptLong className="text-base text-stone-500" />
            <span>Ver Pedidos</span>
          </Link>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS / KPIS CON BADGES INTERACTIVOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {mockStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="rounded-[12px] bg-white border border-stone-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <h3 className="font-headline font-bold text-xl text-stone-800 mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div className={`p-2.5 rounded-[8px] ${stat.iconBg}`}>
                  <Icon className="text-xl" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs gap-2">
                {stat.clickableBadge ? (
                  <button
                    type="button"
                    onClick={() => setActiveModal(stat.modalType as any)}
                    title={stat.tooltip}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-[6px] border transition-all active:scale-95 whitespace-nowrap shrink-0 ${stat.badgeBg}`}
                  >
                    <span className="whitespace-nowrap">{stat.change}</span>
                    <MdLaunch className="text-[11px] opacity-70 shrink-0" />
                  </button>
                ) : (
                  <span
                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold rounded-[4px] border whitespace-nowrap shrink-0 ${stat.badgeBg}`}
                  >
                    {stat.change}
                  </span>
                )}
                <span className="text-stone-400 text-[11px] truncate min-w-0">{stat.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECCIÓN DE GRÁFICOS Y DISTRIBUCIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRÁFICO RESUMEN DE VENTAS */}
        <div className="lg:col-span-2 rounded-[12px] bg-white border border-stone-200/90 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline font-bold text-base text-stone-800 flex items-center gap-2">
                <MdTrendingUp className="text-[#206776] text-lg" />
                <span>Rendimiento de Ventas</span>
              </h3>
              <p className="text-xs text-stone-500">Ingresos comparativos de la semana</p>
            </div>
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-[6px] text-xs text-stone-600 font-medium">
              <button className="px-2.5 py-1 rounded-[4px] bg-white text-stone-800 shadow-2xs font-semibold cursor-pointer">Semanal</button>
              <button className="px-2.5 py-1 rounded-[4px] hover:text-stone-900 cursor-pointer">Mensual</button>
            </div>
          </div>

          {/* Gráfico de barras minimalista con paleta Yamgurumi */}
          <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 border-b border-stone-100">
            {[
              { day: 'Lun', sales: 420, height: '45%' },
              { day: 'Mar', sales: 680, height: '65%' },
              { day: 'Mié', sales: 310, height: '30%' },
              { day: 'Jue', sales: 950, height: '90%' },
              { day: 'Vie', sales: 820, height: '80%' },
              { day: 'Sáb', sales: 1100, height: '100%' },
              { day: 'Dom', sales: 740, height: '70%' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-stone-100 rounded-t-[6px] overflow-hidden h-full flex items-end relative">
                  <div
                    style={{ height: bar.height }}
                    className="w-full bg-[#206776] hover:bg-[#1a5562] transition-all rounded-t-[6px] relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-stone-800 text-white text-[10px] rounded-[4px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm">
                      ${bar.sales}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-stone-500 group-hover:text-stone-800">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-stone-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#206776]" /> Ventas semanales
              </span>
            </div>
            <span className="text-emerald-700 font-semibold">+18% incremento</span>
          </div>
        </div>

        {/* DISTRIBUCIÓN POR CATEGORÍAS */}
        <div className="rounded-[12px] bg-white border border-stone-200/90 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-headline font-bold text-base text-stone-800">Ventas por Categoría</h3>
            <p className="text-xs text-stone-500">Proporción de demanda en el catálogo</p>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Muñecos Amigurumi', percentage: 45, icon: '🧸' },
              { name: 'Llaveros Artesanales', percentage: 25, icon: '🔑' },
              { name: 'Decoración & Plantas', percentage: 18, icon: '🏡' },
              { name: 'Accesorios & Regalos', percentage: 12, icon: '✨' },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-700 flex items-center gap-1.5">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                  <span className="text-stone-800 font-bold">{cat.percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.percentage}%` }}
                    className="h-full bg-[#72594e] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 text-center">
            <Link
              href="/admin/categorias"
              className="text-xs font-semibold text-[#206776] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Gestionar categorías</span>
              <MdChevronRight className="text-base" />
            </Link>
          </div>
        </div>
      </div>

      {/* TABLA DE PEDIDOS RECIENTES */}
      <div className="rounded-[12px] bg-white border border-stone-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-headline font-bold text-base text-stone-800 flex items-center gap-2">
              <MdReceiptLong className="text-[#72594e] text-lg" />
              <span>Pedidos Recientes por Procesar</span>
            </h3>
            <p className="text-xs text-stone-500">Últimas compras que requieren atención</p>
          </div>
          <Link
            href="/admin/pedidos"
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200/60 text-stone-700 font-medium text-xs rounded-[8px] border border-stone-200 inline-flex items-center gap-1 self-start sm:self-auto transition-colors cursor-pointer"
          >
            <span>Ver Todos</span>
            <MdChevronRight />
          </Link>
        </div>

        {/* TABLA LIMPIA */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-3.5 py-2.5 rounded-l-[6px]">ID Pedido</th>
                <th className="px-3.5 py-2.5">Cliente</th>
                <th className="px-3.5 py-2.5">Productos</th>
                <th className="px-3.5 py-2.5">Total</th>
                <th className="px-3.5 py-2.5">Estado</th>
                <th className="px-3.5 py-2.5 text-right rounded-r-[6px]">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="px-3.5 py-3 font-bold text-stone-800">{order.id}</td>
                  <td className="px-3.5 py-3">
                    <div className="font-medium text-stone-800">{order.customer}</div>
                    <div className="text-[11px] text-stone-400">{order.email}</div>
                  </td>
                  <td className="px-3.5 py-3 max-w-xs truncate text-stone-600">{order.items}</td>
                  <td className="px-3.5 py-3 font-bold text-stone-800">{order.total}</td>
                  <td className="px-3.5 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-[4px] border ${order.statusBadge}`}
                    >
                      {order.statusLabel}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-right">
                    <Link
                      href="/admin/pedidos"
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-medium rounded-[6px] text-xs transition-colors inline-block cursor-pointer"
                    >
                      Procesar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOS COLUMNAS INFERIORES: STOCK BAJO + ENCARGOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* STOCK BAJO */}
        <div className="rounded-[12px] bg-white border border-stone-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-headline font-bold text-base text-stone-800 flex items-center gap-2">
              <MdWarning className="text-rose-600 text-lg" />
              <span>Alerta de Inventario Crítico</span>
            </h3>
            <button
              type="button"
              onClick={() => setActiveModal('low_stock')}
              className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-[4px] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>3 Ítems</span>
              <MdLaunch className="text-[10px]" />
            </button>
          </div>

          <div className="space-y-2.5">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-[8px] bg-stone-50 border border-stone-100 hover:border-amber-200 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-xs text-stone-800">{item.name}</h4>
                  <p className="text-[11px] text-stone-500">Categoría: {item.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-[4px] border ${
                    item.stock === 0 ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}>
                    {item.stock} disps.
                  </span>
                  <Link
                    href="/admin/productos"
                    className="p-1 text-[#72594e] hover:bg-stone-200 rounded transition-colors cursor-pointer"
                    title="Editar producto"
                  >
                    <MdEdit className="text-base" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ENCARGOS A MEDIDA */}
        <div className="rounded-[12px] bg-white border border-stone-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-headline font-bold text-base text-stone-800 flex items-center gap-2">
              <MdAutoAwesome className="text-[#72594e] text-lg" />
              <span>Encargos Personalizados</span>
            </h3>
            <Link
              href="/admin/encargos"
              className="text-xs font-semibold text-[#206776] hover:underline cursor-pointer"
            >
              Ver todas →
            </Link>
          </div>

          <div className="space-y-2.5">
            {customRequests.map((req) => (
              <div
                key={req.id}
                className="p-3 rounded-[8px] bg-stone-50 border border-stone-100 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">{req.customer}</span>
                  <span className="text-[11px] text-stone-400">{req.date}</span>
                </div>
                <p className="text-xs text-stone-600 font-medium">{req.request}</p>
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-[4px] bg-stone-200/60 text-stone-700">
                    {req.status}
                  </span>
                  <Link
                    href="/admin/encargos"
                    className="text-xs font-semibold text-[#206776] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Cotizar</span>
                    <MdChevronRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MODALES INTERACTIVOS DE ATASCO / KPIS ────────────────────────── */}

      {/* 1. MODAL: PRODUCTOS CON BAJO STOCK */}
      {activeModal === 'low_stock' && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-[12px] shadow-xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-lg">
                  <MdWarning />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-stone-800">
                    Productos con Bajo Stock
                  </h3>
                  <p className="text-xs text-stone-500">
                    3 amigurumis requieren reabastecimiento urgente de inventario
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <MdClose className="text-lg" />
              </button>
            </div>

            {/* Lista de Productos de bajo stock */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {lowStockItems.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-[10px] flex items-center justify-between gap-4 hover:border-amber-300 hover:bg-amber-50/30 transition-all group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-stone-800 group-hover:text-amber-900">
                        {prod.name}
                      </h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-stone-200/60 text-stone-700">
                        {prod.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Precio de venta: <span className="font-semibold text-stone-700">${prod.price.toFixed(2)}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-[6px] border ${
                      prod.stock === 0
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-amber-100 text-amber-900 border-amber-200'
                    }`}>
                      {prod.stock === 0 ? '0 (Agotado)' : `${prod.stock} disponible(s)`}
                    </span>

                    <Link
                      href="/admin/productos"
                      onClick={() => setActiveModal(null)}
                      className="px-3 py-1.5 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[6px] flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                      title="Editar parámetros del producto"
                    >
                      <MdEdit className="text-xs" />
                      <span>Editar</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer con Enlace Principal */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">¿Deseas administrar todo tu inventario?</span>
              <Link
                href="/admin/productos"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#206776] hover:bg-[#185360] text-white font-bold text-xs rounded-[8px] inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>Ir a Gestión de Productos</span>
                <MdChevronRight className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL: PEDIDOS URGENTES */}
      {activeModal === 'urgent_orders' && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-[12px] shadow-xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-lg">
                  <MdTimer />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-stone-800">
                    Pedidos Pendientes Urgentes
                  </h3>
                  <p className="text-xs text-stone-500">
                    3 pedidos pendientes de despacho esta semana
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <MdClose className="text-lg" />
              </button>
            </div>

            {/* Lista de Pedidos Urgentes */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {recentOrders.filter(o => o.isUrgent).map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-[10px] flex items-center justify-between gap-4 hover:border-amber-300 transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-stone-800 font-mono bg-white px-2 py-0.5 rounded border border-stone-200">
                        {ord.id}
                      </span>
                      <span className="font-bold text-xs text-stone-800 truncate">
                        {ord.customer}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate">
                      {ord.items}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-xs text-stone-800">{ord.total}</span>
                    <Link
                      href="/admin/pedidos"
                      onClick={() => setActiveModal(null)}
                      className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-[6px] flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    >
                      <span>Procesar</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer con Enlace Principal */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">¿Ver todos los encargos pendientes?</span>
              <Link
                href="/admin/pedidos"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-bold text-xs rounded-[8px] inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>Ir al Panel de Pedidos</span>
                <MdChevronRight className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL: NUEVOS CLIENTES */}
      {activeModal === 'new_customers' && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-[12px] shadow-xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center text-lg">
                  <MdPersonAdd />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-stone-800">
                    Clientes Registrados Recientemente
                  </h3>
                  <p className="text-xs text-stone-500">
                    +12 nuevos usuarios registrados en la plataforma
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <MdClose className="text-lg" />
              </button>
            </div>

            {/* Lista de Nuevos Clientes */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {newCustomersList.map((user) => (
                <div
                  key={user.id}
                  className="p-3 bg-stone-50 border border-stone-200/80 rounded-[10px] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-stone-800 truncate">
                      {user.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-200/70 text-stone-700">
                      {user.totalOrders} pedido(s)
                    </span>
                    <Link
                      href="/admin/usuarios"
                      onClick={() => setActiveModal(null)}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded border border-stone-200 transition-colors cursor-pointer"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer con Enlace Principal */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">¿Administrar la lista completa de usuarios?</span>
              <Link
                href="/admin/usuarios"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#206776] hover:bg-[#185360] text-white font-bold text-xs rounded-[8px] inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>Ir a Gestión de Usuarios</span>
                <MdChevronRight className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
