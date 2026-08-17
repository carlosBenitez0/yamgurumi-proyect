import React from 'react';
import { MdSettings } from 'react-icons/md';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200/90 p-6 rounded-2xl shadow-xs space-y-1">
        <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
          <MdSettings className="text-[#72594e]" />
          <span>Configuración Global del Sistema</span>
        </h2>
        <p className="text-xs text-stone-500">
          Ajustes institucionales, tarifas de envío, datos de transferencia bancaria, número de WhatsApp y anuncios.
        </p>
      </div>

      <div className="p-8 text-center bg-white border border-stone-200/90 rounded-2xl shadow-xs space-y-2">
        <div className="w-10 h-10 rounded-xl bg-amber-100/60 text-amber-800 flex items-center justify-center mx-auto text-xl">
          ⚙️
        </div>
        <h3 className="font-headline font-bold text-base text-stone-800">
          Módulo de Configuraciones Listo
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Pestañas organizadas para General, Envíos, WhatsApp/Pagos y Notificaciones.
        </p>
      </div>
    </div>
  );
}
