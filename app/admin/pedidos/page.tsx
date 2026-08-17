import React from 'react';
import { MdReceiptLong } from 'react-icons/md';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200/90 p-6 rounded-2xl shadow-xs space-y-1">
        <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
          <MdReceiptLong className="text-[#72594e]" />
          <span>Gestión de Pedidos & Envíos</span>
        </h2>
        <p className="text-xs text-stone-500">
          Controla las ventas recibidas, actualiza estados (Pendiente, Confirmado, Enviado) y gestiona guías.
        </p>
      </div>

      <div className="p-8 text-center bg-white border border-stone-200/90 rounded-2xl shadow-xs space-y-2">
        <div className="w-10 h-10 rounded-xl bg-teal-100/60 text-teal-800 flex items-center justify-center mx-auto text-xl">
          📦
        </div>
        <h3 className="font-headline font-bold text-base text-stone-800">
          Módulo de Pedidos Listo
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Conexión con el modelo `Order` de Prisma e integración de notificaciones vía Resend y WhatsApp.
        </p>
      </div>
    </div>
  );
}
