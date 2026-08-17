import React from 'react';
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
  MdArrowUpward,
  MdStorefront,
  MdRefresh,
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
  },
  {
    id: 'pedidos',
    label: 'Pedidos Pendientes',
    value: '8 pedidos',
    change: '3 urgentes',
    isPositive: false,
    description: 'Requieren despacho esta semana',
    icon: MdReceiptLong,
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    iconBg: 'bg-amber-100/70 text-amber-800',
  },
  {
    id: 'productos',
    label: 'Productos en Catálogo',
    value: '45 amigurumis',
    change: '3 bajo stock',
    isPositive: false,
    description: '8 categorías activas',
    icon: MdShoppingBag,
    badgeBg: 'bg-stone-100 text-stone-700 border-stone-200',
    iconBg: 'bg-[#72594e]/10 text-[#72594e]',
  },
  {
    id: 'clientes',
    label: 'Clientes Registrados',
    value: '128 usuarios',
    change: '+12 nuevos',
    isPositive: true,
    description: '42 suscriptores newsletter',
    icon: MdPeople,
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    iconBg: 'bg-[#206776]/10 text-[#206776]',
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
    paymentMethod: 'WhatsApp Checkout',
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
    paymentMethod: 'Transferencia Bancaria',
  },
  {
    id: 'ORD-8490',
    customer: 'Lucía Gómez',
    email: 'lucia.g@yahoo.es',
    items: 'Set Navideño Muñecos Crochet (x1)',
    total: '$85.00',
    date: 'Ayer',
    statusLabel: 'Enviado',
    statusBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    paymentMethod: 'WhatsApp Checkout',
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
    paymentMethod: 'Transferencia Bancaria',
  },
];

const lowStockItems = [
  { id: '1', name: 'Oso Amigurumi Gigante', category: 'Muñecos', stock: 1 },
  { id: '2', name: 'Llavero Gatito Kawaii', category: 'Llaveros', stock: 0 },
  { id: '3', name: 'Cactus en Maceta Tejida', category: 'Decoración', stock: 2 },
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
            className="px-3.5 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[8px] shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <MdAdd className="text-base" />
            <span>Añadir Producto</span>
          </Link>
          <Link
            href="/admin/pedidos"
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200/70 text-stone-700 font-semibold text-xs rounded-[8px] border border-stone-200 flex items-center gap-1.5 transition-colors"
          >
            <MdReceiptLong className="text-base text-stone-500" />
            <span>Ver Pedidos</span>
          </Link>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS / KPIS */}
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

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold rounded-[4px] border ${stat.badgeBg}`}
                >
                  {stat.change}
                </span>
                <span className="text-stone-400 text-[11px] truncate">{stat.description}</span>
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
              <button className="px-2.5 py-1 rounded-[4px] bg-white text-stone-800 shadow-2xs font-semibold">Semanal</button>
              <button className="px-2.5 py-1 rounded-[4px] hover:text-stone-900">Mensual</button>
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
              className="text-xs font-semibold text-[#206776] hover:underline inline-flex items-center gap-1"
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
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200/60 text-stone-700 font-medium text-xs rounded-[8px] border border-stone-200 inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
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
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-medium rounded-[6px] text-xs transition-colors inline-block"
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
              <MdWarning className="text-amber-600 text-lg" />
              <span>Alerta de Inventario</span>
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 rounded-[4px]">
              3 Ítems
            </span>
          </div>

          <div className="space-y-2.5">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-[8px] bg-stone-50 border border-stone-100"
              >
                <div>
                  <h4 className="font-semibold text-xs text-stone-800">{item.name}</h4>
                  <p className="text-[11px] text-stone-500">Categoría: {item.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px] bg-rose-50 text-rose-800 border border-rose-200">
                    {item.stock} disps.
                  </span>
                  <Link
                    href="/admin/productos"
                    className="p-1 text-stone-500 hover:text-stone-800 transition-colors"
                    title="Editar producto"
                  >
                    <MdRefresh className="text-base" />
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
              className="text-xs font-semibold text-[#206776] hover:underline"
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
                    className="text-xs font-semibold text-[#206776] hover:underline flex items-center gap-0.5"
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
    </div>
  );
}
