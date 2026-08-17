import React from 'react';
import { MdShield } from 'react-icons/md';

export default function AdminAuditPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200/90 p-6 rounded-2xl shadow-xs space-y-1">
        <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
          <MdShield className="text-[#206776]" />
          <span>Bitácora de Auditoría & Seguridad</span>
        </h2>
        <p className="text-xs text-stone-500">
          Historial inmutable de cambios y acciones realizadas por administradores en el sistema.
        </p>
      </div>

      <div className="p-8 text-center bg-white border border-stone-200/90 rounded-2xl shadow-xs space-y-2">
        <div className="w-10 h-10 rounded-xl bg-teal-100/60 text-teal-800 flex items-center justify-center mx-auto text-xl">
          🛡️
        </div>
        <h3 className="font-headline font-bold text-base text-stone-800">
          Módulo de Bitácora de Auditoría Listo
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Registro inmutable de acciones administrativas.
        </p>
      </div>
    </div>
  );
}
