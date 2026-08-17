import React from 'react';
import { MdAutoAwesome } from 'react-icons/md';

export default function AdminCustomOrdersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200/90 p-6 rounded-2xl shadow-xs space-y-1">
        <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
          <MdAutoAwesome className="text-[#72594e]" />
          <span>Encargos Especiales / Amigurumis a Medida</span>
        </h2>
        <p className="text-xs text-stone-500">
          Revisa solicitudes de tejido personalizadas de los clientes y responde con presupuestos.
        </p>
      </div>

      <div className="p-8 text-center bg-white border border-stone-200/90 rounded-2xl shadow-xs space-y-2">
        <div className="w-10 h-10 rounded-xl bg-rose-100/60 text-rose-800 flex items-center justify-center mx-auto text-xl">
          ✨
        </div>
        <h3 className="font-headline font-bold text-base text-stone-800">
          Módulo de Cotizaciones a Medida Listo
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Podrás ver las fotos enviadas por los clientes, definir precios y tiempos de elaboración en crochet.
        </p>
      </div>
    </div>
  );
}
