'use client';

import React, { useState, useTransition } from 'react';
import {
  MdContentCut,
  MdSearch,
  MdVisibility,
  MdEdit,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
  MdClose,
  MdRefresh,
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { CustomOrderStatus } from '@prisma/client';
import {
  quoteCustomOrderAction,
  seedSampleCustomOrdersIfEmptyAction,
} from '@/src/actions/admin/custom-orders';

interface CustomOrderData {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  title: string;
  description: string;
  desiredSize?: string | null;
  budgetRange?: string | null;
  referenceImages: string[];
  status: CustomOrderStatus;
  quotedPrice?: number | null;
  adminNotes?: string | null;
  createdAt: Date | string;
  user?: {
    id: string;
    name?: string | null;
    email: string;
  } | null;
}

const STATUS_CONFIG: Record<
  CustomOrderStatus,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  PENDING: {
    label: 'Pendiente de Cotizar',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    icon: MdAccessTime,
  },
  QUOTED: {
    label: 'Cotizado / Enviado',
    bg: 'bg-sky-50',
    text: 'text-sky-900',
    border: 'border-sky-200',
    icon: MdCheckCircle,
  },
  ACCEPTED: {
    label: 'Presupuesto Aceptado',
    bg: 'bg-indigo-50',
    text: 'text-indigo-900',
    border: 'border-indigo-200',
    icon: MdCheckCircle,
  },
  IN_PRODUCTION: {
    label: 'En Tejido / Producción',
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    border: 'border-purple-200',
    icon: MdContentCut,
  },
  COMPLETED: {
    label: 'Completado / Listo',
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

export default function AdminCustomOrdersClient({
  initialCustomOrders,
}: {
  initialCustomOrders: CustomOrderData[];
}) {
  const [customOrders, setCustomOrders] = useState<CustomOrderData[]>(initialCustomOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CustomOrderData | null>(null);
  const [editingStatus, setEditingStatus] = useState<CustomOrderStatus>('PENDING');
  const [quotedPriceInput, setQuotedPriceInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtrado
  const filteredOrders = customOrders.filter((co) => {
    const matchesStatus = selectedStatus === 'ALL' || co.status === selectedStatus;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      co.title.toLowerCase().includes(q) ||
      co.customerName.toLowerCase().includes(q) ||
      co.email.toLowerCase().includes(q) ||
      co.phone.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const openModal = (co: CustomOrderData) => {
    setSelectedOrder(co);
    setEditingStatus(co.status);
    setQuotedPriceInput(co.quotedPrice ? String(co.quotedPrice) : '');
    setNotesInput(co.adminNotes || '');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setErrorMsg('');
    setSuccessMsg('');

    startTransition(async () => {
      try {
        const priceNum = quotedPriceInput ? Number(quotedPriceInput) : null;
        const res = await quoteCustomOrderAction({
          customOrderId: selectedOrder.id,
          status: editingStatus,
          quotedPrice: priceNum,
          adminNotes: notesInput.trim() || null,
        });

        if (res.success) {
          setCustomOrders((prev) =>
            prev.map((o) =>
              o.id === selectedOrder.id
                ? {
                    ...o,
                    status: editingStatus,
                    quotedPrice: priceNum,
                    adminNotes: notesInput.trim() || null,
                  }
                : o
            )
          );
          setSuccessMsg('¡Cotización y estado del encargo actualizados!');
          setTimeout(() => setSelectedOrder(null), 1200);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error al actualizar cotización');
      }
    });
  };

  const getWhatsAppQuoteUrl = (co: CustomOrderData, priceOverride?: string, statusOverride?: CustomOrderStatus) => {
    const rawPhone = co.phone || '77311064';
    const digits = rawPhone.replace(/[^0-9]/g, '');
    const cleanPhone = digits.length === 8 ? `503${digits}` : digits;

    const price = priceOverride !== undefined ? priceOverride : (co.quotedPrice ? String(co.quotedPrice) : '');
    const status = statusOverride ?? co.status;

    let text = '';

    if (status === 'QUOTED' || price) {
      text =
        `🧶 *COTIZACIÓN DE ENCARGO A MEDIDA - YAMGURUMI* ✨\n\n` +
        `¡Hola, *${co.customerName}*!\n` +
        `Hemos revisado la solicitud para tu muñeco personalizado:\n` +
        `📌 *"${co.title}"*\n\n` +
        `💰 *Presupuesto Cotizado:* *$${price || '0.00'}*\n` +
        `📏 *Tamaño Deseado:* ${co.desiredSize || 'Estándar'}\n\n` +
        `🧵 *Detalles de confección:* Tejido 100% hecho a mano con hilo de algodón hipoalergénico y relleno silicón de alta durabilidad.\n\n` +
        `¿Deseas confirmar este pedido para agendar la fecha de tejido? ¡Quedamos a tu servicio! ❤️`;
    } else if (status === 'IN_PRODUCTION') {
      text =
        `🧵 *¡TU ENCARGO A MEDIDA ESTÁ EN TEJIDO!* 🧶\n\n` +
        `¡Hola, *${co.customerName}*!\n` +
        `Te informamos que nuestro equipo artesanal ha comenzado a tejer tu encargo personalizado:\n` +
        `📌 *"${co.title}"*\n\n` +
        `Te notificaremos en cuanto esté listo para su entrega. ¡Gracias por elegir lo artesanal! ✨`;
    } else if (status === 'COMPLETED') {
      text =
        `🥳 *¡TU ENCARGO ESTÁ LISTO Y COMPLETADO!* 🧶\n\n` +
        `¡Hola, *${co.customerName}*!\n` +
        `Tu muñeco personalizado *"${co.title}"* ya está 100% terminado y listo para su entrega o retiro.\n\n` +
        `¡Esperamos que te encante tanto como a nosotros tejerlo! ❤️`;
    } else {
      text =
        `🧶 *CONSULTA DE ENCARGO A MEDIDA - YAMGURUMI* ✨\n\n` +
        `¡Hola, *${co.customerName}*!\n` +
        `Te saludamos en relación a tu solicitud *"${co.title}"*.\n\n` +
        `¿Tienes alguna duda o detalle adicional sobre la foto/referencia? ¡Estamos a la orden!`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const handleSeed = () => {
    startTransition(async () => {
      try {
        await seedSampleCustomOrdersIfEmptyAction();
        window.location.reload();
      } catch (err: any) {
        alert('Error al sembrar solicitudes de muestra');
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/90 p-6 rounded-[12px] shadow-xs">
        <div className="space-y-1">
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
            <MdContentCut className="text-[#72594e]" />
            <span>Encargos a Medida & Cotizaciones ({filteredOrders.length})</span>
          </h2>
          <p className="text-xs text-stone-500">
            Gestiona las peticiones de amigurumis personalizados enviados por clientes con fotos de referencia y cotizaciones.
          </p>
        </div>

        {customOrders.length === 0 && (
          <button
            onClick={handleSeed}
            disabled={isPending}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded-[8px] shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <MdRefresh className="text-base" />
            <span>Cargar Encargos de Muestra</span>
          </button>
        )}
      </div>

      {/* CONTENEDOR CON TABS Y TABLA */}
      <div className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4">
        {/* TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-100">
          {[
            { key: 'ALL', label: 'Todas las Solicitudes' },
            { key: 'PENDING', label: 'Pendientes' },
            { key: 'QUOTED', label: 'Cotizadas' },
            { key: 'IN_PRODUCTION', label: 'En Tejido' },
            { key: 'COMPLETED', label: 'Completadas' },
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

        {/* BÚSQUEDA */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-base" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título de encargo, cliente, correo o teléfono..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
            />
          </div>
        </div>

        {/* TABLA DE ENCARGOS */}
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-[8px] border border-dashed border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-[8px] bg-amber-100/60 text-amber-800 flex items-center justify-center mx-auto text-xl">
              🧶
            </div>
            <h3 className="font-headline font-bold text-base text-stone-800">
              No hay solicitudes a medida
            </h3>
            <p className="text-xs text-stone-500">
              Intenta cambiar los filtros o el texto de búsqueda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="px-3.5 py-2.5 rounded-l-[6px]">Solicitud / Diseño</th>
                  <th className="px-3.5 py-2.5">Cliente</th>
                  <th className="px-3.5 py-2.5">Tamaño / Rango</th>
                  <th className="px-3.5 py-2.5">Cotizado ($)</th>
                  <th className="px-3.5 py-2.5">Estado</th>
                  <th className="px-3.5 py-2.5 text-right rounded-r-[6px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((co) => {
                  const statusConf = STATUS_CONFIG[co.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = statusConf.icon;

                  return (
                    <tr key={co.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={co.referenceImages[0] || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=100&q=80'}
                            alt={co.title}
                            className="w-9 h-9 rounded-[6px] object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-stone-800 line-clamp-1">{co.title}</div>
                            <div className="text-[11px] text-stone-500 line-clamp-1">{co.description}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-3.5 py-3">
                        <div className="font-bold text-stone-800">{co.customerName}</div>
                        <div className="text-[11px] text-stone-500">{co.email}</div>
                      </td>

                      <td className="px-3.5 py-3 font-semibold text-stone-700">
                        <div>{co.desiredSize || 'Estándar'}</div>
                        <div className="text-[10px] text-stone-400 font-normal">{co.budgetRange}</div>
                      </td>

                      <td className="px-3.5 py-3 font-bold text-stone-800">
                        {co.quotedPrice ? (
                          <span className="text-[#72594e] font-bold text-sm">
                            ${co.quotedPrice.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic font-normal">Sin cotizar</span>
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
                            href={getWhatsAppQuoteUrl(co)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 rounded-[6px] transition-colors"
                            title="Enviar cotización/mensaje por WhatsApp"
                          >
                            <FaWhatsapp className="text-base" />
                          </a>

                          <button
                            onClick={() => openModal(co)}
                            className="px-2.5 py-1.5 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[6px] shadow-2xs flex items-center gap-1 transition-colors"
                            title="Ver fotos y cotizar"
                          >
                            <MdEdit className="text-sm" />
                            <span>Cotizar</span>
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

      {/* MODAL DE COTIZACIÓN */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-[12px] shadow-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-headline font-bold text-base text-stone-800 flex items-center gap-2">
                <MdContentCut className="text-[#72594e]" />
                <span>Cotizar Encargo a Medida</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100"
              >
                <MdClose className="text-lg" />
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

            {/* DETALLES DE LA SOLICITUD */}
            <div className="space-y-3 bg-stone-50 p-4 rounded-[8px] border border-stone-200/80 text-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-stone-800">{selectedOrder.title}</h4>
                  <p className="text-stone-500 font-semibold">{selectedOrder.customerName} ({selectedOrder.email})</p>
                </div>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">
                  {selectedOrder.desiredSize || 'Estándar'}
                </span>
              </div>

              <p className="text-stone-700 italic bg-white p-2.5 rounded-[6px] border border-stone-200">
                "{selectedOrder.description}"
              </p>

              {/* IMÁGENES DE REFERENCIA */}
              {selectedOrder.referenceImages.length > 0 && (
                <div>
                  <span className="font-bold text-stone-700 block mb-1">Imagen de Referencia:</span>
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedOrder.referenceImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Referencia artesanal"
                        className="w-20 h-20 rounded-[6px] object-cover border border-stone-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* FORMULARIO DE COTIZACIÓN */}
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Precio Cotizado ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={quotedPriceInput}
                    onChange={(e) => setQuotedPriceInput(e.target.value)}
                    placeholder="Ej: 35.00"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Estado de la Solicitud *
                  </label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value as CustomOrderStatus)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700 font-semibold"
                  >
                    <option value="PENDING">⌛ Pendiente de Cotizar</option>
                    <option value="QUOTED">💬 Cotizado / Presupuesto Enviado</option>
                    <option value="ACCEPTED">✅ Presupuesto Aceptado</option>
                    <option value="IN_PRODUCTION">🧵 En Tejido / Producción</option>
                    <option value="COMPLETED">🥳 Completado / Listo</option>
                    <option value="CANCELLED">❌ Cancelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Notas Internas de Confección
                </label>
                <textarea
                  rows={2}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Detalles sobre hilaza necesaria, colores acordados, avances..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <a
                  href={getWhatsAppQuoteUrl(selectedOrder, quotedPriceInput, editingStatus)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <FaWhatsapp className="text-base" />
                  <span>Enviar Cotización por WhatsApp</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-[6px] text-xs font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-1.5 bg-[#72594e] hover:bg-[#60493f] text-white rounded-[6px] text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {isPending ? 'Guardando...' : 'Guardar Cotización'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
