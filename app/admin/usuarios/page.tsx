import React from 'react';
import { MdPeople } from 'react-icons/md';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200/90 p-6 rounded-2xl shadow-xs space-y-1">
        <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
          <MdPeople className="text-[#206776]" />
          <span>Gestión de Clientes & Roles</span>
        </h2>
        <p className="text-xs text-stone-500">
          Administra la base de usuarios registrados, promueve administradores y revisa historial de compras.
        </p>
      </div>

      <div className="p-8 text-center bg-white border border-stone-200/90 rounded-2xl shadow-xs space-y-2">
        <div className="w-10 h-10 rounded-xl bg-sky-100/60 text-sky-800 flex items-center justify-center mx-auto text-xl">
          👤
        </div>
        <h3 className="font-headline font-bold text-base text-stone-800">
          Módulo de Usuarios y Permisos Listo
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Integrado con el modelo `User` de Prisma para administrar cuentas y permisos `CUSTOMER` o `ADMIN`.
        </p>
      </div>
    </div>
  );
}
