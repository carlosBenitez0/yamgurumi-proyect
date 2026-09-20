'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  MdShoppingBag,
  MdSearch,
  MdFilterList,
  MdVisibility,
  MdEdit,
  MdLocalShipping,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
  MdClose,
  MdPrint,
  MdRefresh,
  MdContentCopy,
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { updateOrderStatusAction, seedSampleOrdersIfEmptyAction } from '@/src/actions/admin/orders';
import { OrderStatus } from '@prisma/client';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string | null;
  product?: {
    imageUrls: string[];
  } | null;
}

interface OrderData {
  id: string;
  email: string;
  phone: string;
  zone: string;
  notes?: string | null;
  subtotal: number;
  discount: number;
  discountCode?: string | null;
  total: number;
  status: OrderStatus;
  whatsappUrl: string;
  trackingNumber?: string | null;
  paymentMethod: string;
  adminNotes?: string | null;
  createdAt: Date | string;
  items: OrderItem[];
  user?: {
    id: string;
    name?: string | null;
    email: string;
  } | null;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  PENDING: {
    label: 'Pendiente de Pago',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    icon: MdAccessTime,
  },
  CONFIRMED: {
    label: 'Pago Confirmado',
    bg: 'bg-sky-50',
    text: 'text-sky-900',
    border: 'border-sky-200',
    icon: MdCheckCircle,
  },
  SHIPPED: {
    label: 'Enviado',
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    border: 'border-purple-200',
    icon: MdLocalShipping,
  },
  DELIVERED: {
    label: 'Entregado',
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    icon: MdCheckCircle,
  },
  CANCELLED: {
    label: 'Cancelado',
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    border: 'border-rose-200',
    icon: MdCancel,
  },
};

export default function AdminOrdersClient({
  initialOrders,
  initialSettings,
}: {
  initialOrders: OrderData[];
  initialSettings?: { key: string; value: string }[];
}) {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [editingStatus, setEditingStatus] = useState<OrderStatus>('PENDING');
  const [trackingInput, setTrackingInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyTrackingCode = (code: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const E = {
    SPARKLES: String.fromCodePoint(0x2728),
    YARN: String.fromCodePoint(0x1F9F6),
    TRUCK: String.fromCodePoint(0x1F69A),
    PACKAGE: String.fromCodePoint(0x1F4E6),
    PIN: String.fromCodePoint(0x1F4CD),
    CLIPBOARD: String.fromCodePoint(0x1F4CB),
    MONEY: String.fromCodePoint(0x1F4B0),
    PARTY: String.fromCodePoint(0x1F389),
    WOO: String.fromCodePoint(0x1F973),
    HEART: String.fromCodePoint(0x2764, 0xFE0F),
    FLOWER: String.fromCodePoint(0x1F338),
    WARNING: String.fromCodePoint(0x26A0, 0xFE0F),
    THREAD: String.fromCodePoint(0x1F9F5),
  };

  const getFormattedMessageText = (
    order: OrderData,
    customTracking?: string | null,
    overrideStatus?: OrderStatus
  ) => {
    const customerName = order.user?.name || order.email.split('@')[0] || 'Cliente';
    const trackingCode = customTracking !== undefined ? customTracking : order.trackingNumber;
    const status = overrideStatus ?? order.status;

    const itemsList = order.items
      .map(
        (item) =>
          `  • ${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ''} — $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join('\n');

    if (status === 'SHIPPED') {
      return (
        `${E.TRUCK} *¡TU PEDIDO DE YAMGURUMI VA EN CAMINO!* ${E.YARN}\n\n` +
        `¡Hola, *${customerName}*!\n` +
        `Te notificamos que tu pedido *#${order.id}* ha sido despachado.\n\n` +
        `${E.PACKAGE} *Número de Guía:* *${trackingCode || 'GUIA-PENDIENTE'}*\n` +
        `${E.PIN} *Dirección de Entrega:* ${order.zone}\n\n` +
        `${E.CLIPBOARD} *Contenido del Paquete:*\n${itemsList}\n\n` +
        `${E.MONEY} *Total:* $${order.total.toFixed(2)}\n\n` +
        `Recibirás tu pedido muy pronto. ¡Muchas gracias por apoyar nuestro taller de amigurumis artesanales! ${E.SPARKLES}`
      );
    } else if (status === 'CONFIRMED') {
      return (
        `${E.PARTY} *¡PAGO CONFIRMADO EN YAMGURUMI!* ${E.YARN}\n\n` +
        `¡Hola, *${customerName}*!\n` +
        `Hemos verificado tu pago correctamente para el pedido *#${order.id}*.\n\n` +
        `${E.CLIPBOARD} *Ítems en Confección:*\n${itemsList}\n\n` +
        `${E.MONEY} *Total Cancelado:* $${order.total.toFixed(2)}\n` +
        `${E.PIN} *Destino:* ${order.zone}\n\n` +
        `${E.THREAD} Nuestro equipo ya está tejiendo y preparando tus muñecos con hilo 100% hipoalergénico. Te enviaremos tu guía en cuanto salga a reparto. ¡Muchas gracias! ${E.HEART}`
      );
    } else if (status === 'DELIVERED') {
      return (
        `${E.WOO} *¡PEDIDO ENTREGADO!* ${E.YARN}\n\n` +
        `¡Hola, *${customerName}*!\n` +
        `Confirmamos que tu pedido *#${order.id}* de Yamgurumi fue entregado exitosamente.\n\n` +
        `${E.CLIPBOARD} *Detalle del Pedido:*\n${itemsList}\n\n` +
        `Esperamos que disfrutes mucho tu nuevo amigurumi. ${E.HEART} ¡Gracias por confiar en nuestras creaciones hechas a mano! ${E.FLOWER}`
      );
    } else if (status === 'CANCELLED') {
      return (
        `${E.WARNING} *NOTIFICACIÓN DE PEDIDO EN YAMGURUMI* ${E.YARN}\n\n` +
        `Hola, *${customerName}*.\n` +
        `Te informamos que tu pedido *#${order.id}* ha sido registrado como cancelado.\n\n` +
        `Si necesitas asistencia o deseas realizar un nuevo encargo, estamos a tu disposición por este medio.`
      );
    } else {
      // PENDING
      return (
        `${E.SPARKLES} *DETALLES DE TU PEDIDO EN YAMGURUMI* ${E.YARN}\n\n` +
        `¡Hola, *${customerName}*!\n` +
        `Te compartimos la información de tu orden *#${order.id}*:\n\n` +
        `${E.CLIPBOARD} *Productos:*\n${itemsList}\n\n` +
        `${E.MONEY} *Total:* $${order.total.toFixed(2)}\n` +
        `${E.PIN} *Dirección de Envío:* ${order.zone}\n\n` +
        `Quedamos atentos a tus comentarios para coordinar el pago y la entrega. ¡Muchas gracias! ${E.YARN}`
      );
    }
  };

  const getWhatsAppUrl = (
    order: OrderData,
    customTracking?: string | null,
    overrideStatus?: OrderStatus
  ) => {
    const rawPhone = order.phone || '77311064';
    const digits = rawPhone.replace(/[^0-9]/g, '');
    const cleanPhone = digits.length === 8 ? `503${digits}` : digits;

    const tplFound = initialSettings?.find((s) => s.key === 'wa_tpl_admin_order_contact')?.value;
    let text = '';
    if (tplFound) {
      const statusLabels: Record<string, string> = {
        PENDING: 'Pendiente de Pago',
        SHIPPED: 'Enviado',
        DELIVERED: 'Entregado Exitosamente',
        CANCELLED: 'Cancelado',
      };
      const st = overrideStatus || order.status;
      const customerName = order.email.split('@')[0];
      text = tplFound
        .replaceAll('{nombre}', customerName)
        .replaceAll('{pedido_id}', order.id)
        .replaceAll('{total}', order.total.toFixed(2))
        .replaceAll('{estado}', statusLabels[st] || st);
    } else {
      text = getFormattedMessageText(order, customTracking, overrideStatus);
    }

    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
  };

  // Filtrado dinámico
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedStatus === 'ALL' || o.status === selectedStatus;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q) ||
      o.zone.toLowerCase().includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
      o.items.some((item) => item.name.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const openModal = (order: OrderData) => {
    setSelectedOrder(order);
    setEditingStatus(order.status);
    setTrackingInput(order.trackingNumber || '');
    setNotesInput(order.adminNotes || '');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleUpdateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setErrorMsg('');
    setSuccessMsg('');

    startTransition(async () => {
      try {
        const res = await updateOrderStatusAction({
          orderId: selectedOrder.id,
          status: editingStatus,
          trackingNumber: trackingInput.trim() || null,
          adminNotes: notesInput.trim() || null,
        });

        if (res.success) {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === selectedOrder.id
                ? {
                    ...o,
                    status: editingStatus,
                    trackingNumber: trackingInput.trim() || null,
                    adminNotes: notesInput.trim() || null,
                  }
                : o
            )
          );
          setSuccessMsg('¡Estado del pedido actualizado correctamente!');
          setTimeout(() => setSelectedOrder(null), 1200);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error al actualizar el pedido');
      }
    });
  };

  const handleSeedOrders = () => {
    startTransition(async () => {
      try {
        await seedSampleOrdersIfEmptyAction();
        window.location.reload();
      } catch (err: any) {
        alert('Error al generar pedidos de muestra');
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/90 p-6 rounded-[12px] shadow-xs">
        <div className="space-y-1">
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
            <MdShoppingBag className="text-[#72594e]" />
            <span>Gestión de Pedidos ({filteredOrders.length})</span>
          </h2>
          <p className="text-xs text-stone-500">
            Revisa compras recibidas, cambia estados de envío, asigna números de guía y comunícate con clientes.
          </p>
        </div>

        {orders.length === 0 && (
          <button
            onClick={handleSeedOrders}
            disabled={isPending}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded-[8px] shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <MdRefresh className="text-base" />
            <span>Cargar Pedidos de Muestra</span>
          </button>
        )}
      </div>

      {/* CONTENEDOR CON FILTROS Y TABLA */}
      <div className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4">
        {/* TABS DE ESTADO */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-100">
          {[
            { key: 'ALL', label: 'Todos los Pedidos' },
            { key: 'PENDING', label: 'Pendientes' },
            { key: 'CONFIRMED', label: 'Confirmados' },
            { key: 'SHIPPED', label: 'Enviados' },
            { key: 'DELIVERED', label: 'Entregados' },
            { key: 'CANCELLED', label: 'Cancelados' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === tab.key
                  ? 'bg-[#72594e] text-white shadow-2xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* BARRA DE BÚSQUEDA */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-base" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por # de pedido, cliente, correo, teléfono o guía de envío..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
            />
          </div>
        </div>

        {/* TABLA DE PEDIDOS DE POSTGRESQL */}
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-[8px] border border-dashed border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-[8px] bg-amber-100/60 text-amber-800 flex items-center justify-center mx-auto text-xl">
              📦
            </div>
            <h3 className="font-headline font-bold text-base text-stone-800">
              No se encontraron pedidos
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Intenta cambiar los filtros de estado o la búsqueda por texto.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="px-3.5 py-2.5 rounded-l-[6px]">Pedido</th>
                  <th className="px-3.5 py-2.5">Cliente</th>
                  <th className="px-3.5 py-2.5">Ítems Tejidos</th>
                  <th className="px-3.5 py-2.5">Total ($)</th>
                  <th className="px-3.5 py-2.5">Estado</th>
                  <th className="px-3.5 py-2.5 text-right rounded-r-[6px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => {
                  const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = statusConf.icon;
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('es-SV', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-3.5 py-3 font-mono font-bold text-stone-800">
                        <div className="flex items-center gap-1.5">
                          <span>#{order.id}</span>
                          {order.items.some(
                            (i) =>
                              i.size?.toLowerCase().includes('encargo') ||
                              i.size?.toLowerCase().includes('elaboración')
                          ) && (
                            <span
                              className="px-1.5 py-0.5 rounded-[4px] bg-amber-100/90 text-amber-800 border border-amber-300 text-[9px] font-sans font-extrabold uppercase tracking-wider"
                              title="Contiene ítems a elaborar bajo encargo"
                            >
                              🧶 Encargo
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-normal text-stone-400 font-sans">{formattedDate}</div>
                      </td>

                      <td className="px-3.5 py-3">
                        <div className="font-bold text-stone-800">{order.user?.name || order.email.split('@')[0]}</div>
                        <div className="text-[11px] text-stone-500">{order.email}</div>
                        <div className="text-[10px] text-stone-400">{order.zone}</div>
                      </td>

                      <td className="px-3.5 py-3">
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <img
                                src={item.product?.imageUrls[0] || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=100&q=80'}
                                alt={item.name}
                                className="w-6 h-6 rounded-[4px] object-cover border border-stone-200 shrink-0"
                              />
                              <span className="text-stone-800 font-medium line-clamp-1">
                                {item.quantity}x {item.name} ({item.size})
                              </span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <span className="text-[10px] text-stone-400 block italic">
                              +{order.items.length - 2} productos más...
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-3.5 py-3 font-bold text-stone-800">
                        ${order.total.toFixed(2)}
                        {order.discount > 0 && (
                          <div className="text-[10px] text-emerald-700 font-normal">
                            - ${order.discount.toFixed(2)} ({order.discountCode})
                          </div>
                        )}
                      </td>

                      <td className="px-3.5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-[4px] border ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                        >
                          <StatusIcon className="text-xs shrink-0" />
                          <span>{statusConf.label}</span>
                        </span>
                      </td>

                      <td className="px-3.5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={getWhatsAppUrl(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 rounded-[6px] transition-colors"
                            title="Enviar mensaje/guía al cliente por WhatsApp"
                          >
                            <FaWhatsapp className="text-base" />
                          </a>

                          <button
                            onClick={() => openModal(order)}
                            className="px-2.5 py-1.5 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[6px] shadow-2xs flex items-center gap-1 transition-colors"
                            title="Ver detalles y procesar pedido"
                          >
                            <MdEdit className="text-sm" />
                            <span>Procesar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE PROCESAMIENTO DE PEDIDO */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-[12px] shadow-xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-lg text-stone-800 flex items-center gap-2">
                  <span>Procesar Pedido #{selectedOrder.id}</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Registrado el {new Date(selectedOrder.createdAt).toLocaleString('es-SV')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-[6px] text-rose-800 text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[6px] text-emerald-800 text-xs font-semibold">
                ✅ {successMsg}
              </div>
            )}

            {/* DESGLOSE DE PRODUCTOS DEL PEDIDO */}
            <div className="space-y-3 bg-stone-50 p-4 rounded-[8px] border border-stone-200/80">
              <h4 className="font-headline font-bold text-xs text-stone-700 uppercase tracking-wider">
                Productos Comprados ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-stone-200/60">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.imageUrls[0] || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=100&q=80'}
                        alt={item.name}
                        className="w-10 h-10 rounded-[6px] object-cover border border-stone-200"
                      />
                      <div>
                        <div className="font-bold text-stone-800">{item.name}</div>
                        <div className="text-[11px] text-stone-500">Opción: {item.size || 'Mediano'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-stone-800">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-stone-500 font-semibold">
                        ${(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between text-xs font-bold text-stone-800">
                <span>Total a Pagar:</span>
                <span className="text-base text-[#72594e]">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* DATOS DE ENTREGA Y CLIENTE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-[8px] space-y-1">
                <span className="font-bold text-stone-700 block border-b border-stone-200 pb-1">
                  Cliente y Contacto
                </span>
                <p className="text-stone-800 font-semibold">{selectedOrder.user?.name || selectedOrder.email.split('@')[0]}</p>
                <p className="text-stone-600">{selectedOrder.email}</p>
                <p className="text-stone-600">{selectedOrder.phone}</p>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-[8px] space-y-1">
                <span className="font-bold text-stone-700 block border-b border-stone-200 pb-1">
                  Dirección de Despacho
                </span>
                <p className="text-stone-800 font-semibold">{selectedOrder.zone}</p>
                {selectedOrder.notes && (
                  <p className="text-amber-800 text-[11px] italic">
                    "{selectedOrder.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* FORMULARIO DE CAMBIO DE ESTADO */}
            <form onSubmit={handleUpdateOrder} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cambiar Estado del Pedido *
                  </label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700 font-semibold"
                  >
                    <option value="PENDING">⌛ Pendiente de Pago</option>
                    <option value="CONFIRMED">💳 Pago Confirmado</option>
                    <option value="SHIPPED">🚚 Enviado (Despachado)</option>
                    <option value="DELIVERED">✅ Entregado al Cliente</option>
                    <option value="CANCELLED">❌ Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Número de Guía de Envío (Tracking)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="Ej: GUIA-CEX-98214"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 font-mono"
                    />
                    {selectedOrder && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const txt = getFormattedMessageText(selectedOrder, trackingInput, editingStatus);
                            navigator.clipboard.writeText(txt);
                            setCopiedId('MODAL_MSG');
                            setTimeout(() => setCopiedId(null), 2500);
                          }}
                          className="px-2.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-[6px] font-semibold text-xs flex items-center gap-1 transition-colors border border-stone-200/80"
                          title="Copiar texto formateado con emojis para pegar directo en WhatsApp"
                        >
                          <MdContentCopy className="text-sm text-stone-500" />
                          <span>{copiedId === 'MODAL_MSG' ? '¡Copiado! ✓' : 'Copiar Texto'}</span>
                        </button>

                        <a
                          href={getWhatsAppUrl(selectedOrder, trackingInput, editingStatus)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[6px] font-semibold text-xs flex items-center gap-1 transition-colors shadow-2xs"
                          title="Abrir chat en WhatsApp"
                        >
                          <FaWhatsapp className="text-sm" />
                          <span className="hidden sm:inline">Abrir WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Notas Internas de Administración
                </label>
                <textarea
                  rows={2}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Detalles internos de paquetería, llamadas o acuerdos con el cliente..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-[6px] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <MdPrint className="text-sm" />
                  <span>Imprimir Hoja de Embalaje</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-1.5 bg-[#72594e] hover:bg-[#60493f] text-white rounded-[6px] text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isPending ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HOJA DE EMBALAJE / FACTURA DE DESPACHO IMPRIMIBLE (Únicamente visible durante impresión window.print()) */}
      {selectedOrder && (
        <>
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              html, body {
                height: 100% !important;
                max-height: 100vh !important;
                overflow: hidden !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
              }
              body * {
                visibility: hidden !important;
              }
              #printable-packing-slip, #printable-packing-slip * {
                visibility: visible !important;
              }
              #printable-packing-slip {
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-height: 100vh !important;
                overflow: hidden !important;
                background: white !important;
                padding: 0 !important;
                margin: 0 !important;
                display: block !important;
                page-break-after: avoid !important;
                page-break-before: avoid !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              @page {
                size: letter portrait;
                margin: 5mm 8mm;
              }
            }
          ` }} />

          {(() => {
            const isLargeOrder = selectedOrder.items.length > 4;
            const isHugeOrder = selectedOrder.items.length > 7;

            const tablePadding = isHugeOrder ? 'py-1 px-1.5' : isLargeOrder ? 'py-1.5 px-2' : 'p-2';
            const tableFontSize = isHugeOrder ? 'text-[9.5px]' : isLargeOrder ? 'text-[10px]' : 'text-[11px]';
            const gapSpacing = isHugeOrder ? 'mb-1.5' : isLargeOrder ? 'mb-2' : 'mb-3';
            const containerPadding = isHugeOrder ? 'p-2.5' : isLargeOrder ? 'p-3' : 'p-4';

            return (
              <div id="printable-packing-slip" className={`hidden bg-white text-stone-900 ${containerPadding} font-sans max-w-4xl mx-auto leading-tight`}>
                {/* ENCABEZADO PRINCIPAL DE LA MARCA & DOCUMENTO */}
                <div className={`flex items-center justify-between border-b-2 border-[#72594e] pb-2 ${gapSpacing}`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#72594e] text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                      🧶
                    </div>
                    <div>
                      <h1 className="font-headline font-black text-lg text-[#4a3b34] tracking-tight flex items-center gap-2">
                        <span>YAMGURUMI STUDIO</span>
                      </h1>
                      <p className="text-[10px] text-stone-600 font-medium">
                        Taller Artesanal de Crochet • Amigurumis 100% Hechos a Mano 🇸🇻
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="inline-block px-2 py-0.5 bg-[#72594e] text-white font-extrabold text-[9px] uppercase tracking-widest rounded-[4px]">
                      HOJA DE EMBALAJE & DESPACHO
                    </span>
                    <h2 className="font-mono font-black text-base text-stone-900">
                      #{selectedOrder.id}
                    </h2>
                    <p className="text-[9.5px] text-stone-500 font-medium">
                      Emisión: {new Date(selectedOrder.createdAt).toLocaleDateString('es-SV', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* SECCIÓN DE REMITENTE Y DESTINATARIO */}
                <div className={`grid grid-cols-12 gap-2.5 ${gapSpacing} text-xs`}>
                  {/* REMITENTE */}
                  <div className="col-span-5 border border-stone-200 rounded-[6px] p-2 bg-[#faf8f5]/80 space-y-0.5">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-0.5 mb-0.5">
                      <span className="text-[8.5px] font-black text-stone-500 uppercase tracking-wider">
                        REMITENTE (DESPACHO)
                      </span>
                      <span className="text-[8.5px] font-bold text-[#72594e]">Taller Oficial</span>
                    </div>
                    <h3 className="font-bold text-xs text-stone-900">Yamgurumi Studio</h3>
                    <p className="text-[10px] text-stone-600">San Salvador, El Salvador 🇸🇻</p>
                    <p className="text-[10px] text-stone-600 font-mono">Tel / WA: +503 7731 1064</p>
                  </div>

                  {/* DESTINATARIO */}
                  <div className="col-span-7 border-2 border-[#72594e] rounded-[6px] p-2 bg-white space-y-0.5 relative">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-0.5 mb-0.5">
                      <span className="text-[8.5px] font-black text-[#72594e] uppercase tracking-wider">
                        DESTINATARIO (ENTREGA FINAL)
                      </span>
                      {selectedOrder.trackingNumber && (
                        <span className="text-[8.5px] font-mono font-bold text-stone-900 bg-stone-100 border border-stone-300 px-1 py-0.2 rounded">
                          Guía: {selectedOrder.trackingNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-xs text-stone-900 leading-snug">
                          {selectedOrder.user?.name || selectedOrder.email.split('@')[0]}
                        </h3>
                        <p className="text-[11px] font-bold text-[#206776] mt-0.5">
                          📍 {selectedOrder.zone}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-700 pt-0.5">
                      <p><span className="font-semibold text-stone-500">Teléfono:</span> {selectedOrder.phone}</p>
                      <p><span className="font-semibold text-stone-500">Correo:</span> {selectedOrder.email}</p>
                    </div>
                  </div>
                </div>

                {/* TABLA ESTRUCTURADA DE PRODUCTOS COMPRADOS */}
                <div className={gapSpacing}>
                  <table className="w-full text-left border border-stone-300 rounded-[5px] overflow-hidden">
                    <thead className="bg-[#4a3b34] text-white font-bold uppercase text-[8.5px] tracking-wider">
                      <tr>
                        <th className="p-1.5 border-r border-[#5f4c43]">Ítem / Descripción ({selectedOrder.items.length} productos)</th>
                        <th className="p-1.5 border-r border-[#5f4c43] text-center w-24">Tamaño</th>
                        <th className="p-1.5 border-r border-[#5f4c43] text-center w-12">Cant.</th>
                        <th className="p-1.5 border-r border-[#5f4c43] text-right w-20">Precio U.</th>
                        <th className="p-1.5 text-right w-20">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y divide-stone-200 ${tableFontSize}`}>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]/50'}>
                          <td className={`${tablePadding} font-bold text-stone-900`}>
                            <span>{item.name}</span>
                          </td>
                          <td className={`${tablePadding} text-center text-stone-600 font-medium`}>
                            <span className="inline-block px-1 py-0.2 bg-stone-100 rounded text-[9px] border border-stone-200">
                              {item.size || 'Mediano'}
                            </span>
                          </td>
                          <td className={`${tablePadding} text-center font-bold text-stone-900`}>{item.quantity}</td>
                          <td className={`${tablePadding} text-right font-mono text-stone-700`}>${item.price.toFixed(2)}</td>
                          <td className={`${tablePadding} text-right font-mono font-bold text-stone-900`}>${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* RESUMEN DE TOTALES EN CAJA DESTACADA */}
                  <div className="flex justify-end mt-1">
                    <div className="w-56 border border-stone-300 rounded-[5px] p-1.5 bg-[#faf8f5]/80 space-y-0.5 text-[10.5px]">
                      <div className="flex justify-between text-stone-600">
                        <span>Subtotal:</span>
                        <span className="font-mono font-semibold">${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>

                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-emerald-800">
                          <span>Descuento ({selectedOrder.discountCode}):</span>
                          <span className="font-mono font-bold">-${selectedOrder.discount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-stone-600">
                        <span>Envío:</span>
                        <span className="font-mono font-semibold text-emerald-700">Incluido / Coordinado</span>
                      </div>

                      <div className="flex justify-between pt-0.5 border-t border-stone-300 font-black text-stone-900 text-[11.5px]">
                        <span>TOTAL A PAGAR:</span>
                        <span className="font-mono text-xs text-[#72594e]">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NOTAS Y CONTROL DE CALIDAD (2 COLUMNAS) */}
                <div className={`grid grid-cols-2 gap-2.5 ${gapSpacing} text-[10px]`}>
                  {/* NOTAS DEL CLIENTE */}
                  <div className="border border-stone-200 rounded-[5px] p-1.5 bg-stone-50/60">
                    <span className="font-bold text-stone-700 block text-[9px] uppercase tracking-wider mb-0.5">
                      Notas del Cliente:
                    </span>
                    <p className="text-stone-600 italic leading-tight line-clamp-2">
                      {selectedOrder.notes ? `"${selectedOrder.notes}"` : 'Sin notas adicionales.'}
                    </p>
                  </div>

                  {/* CONTROL DE CALIDAD Y PACKING */}
                  <div className="border border-stone-200 rounded-[5px] p-1.5 bg-stone-50/60">
                    <span className="font-bold text-stone-700 block text-[9px] uppercase tracking-wider mb-0.5">
                      Verificación de Embalaje:
                    </span>
                    <div className="grid grid-cols-1 gap-0.5 text-[9px] text-stone-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 border border-stone-400 rounded-xs inline-block shrink-0 bg-white" />
                        <span>Amigurumis inspeccionados y limpios</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 border border-stone-400 rounded-xs inline-block shrink-0 bg-white" />
                        <span>Empaque artesanal de protección listo</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 border border-stone-400 rounded-xs inline-block shrink-0 bg-white" />
                        <span>Guía de transporte adherida</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PIE DE PÁGINA DE LA MARCA */}
                <div className="border-t border-stone-300 pt-1 text-center text-[9.5px] text-stone-600 space-y-0.5">
                  <p className="font-bold text-[#72594e]">
                    🧶 ¡Gracias por apoyar el trabajo artesanal hecho con amor en El Salvador! ✨
                  </p>
                  <p className="text-stone-400 text-[8.5px]">
                    Yamgurumi Studio • San Salvador, El Salvador • www.yamgurumi.com • WhatsApp: +503 7731 1064
                  </p>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
