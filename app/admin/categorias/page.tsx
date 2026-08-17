import React from 'react';
import { MdCategory, MdAdd } from 'react-icons/md';

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/90 p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
            <MdCategory className="text-[#72594e]" />
            <span>Gestión de Categorías</span>
          </h2>
          <p className="text-xs text-stone-500">
            Organiza el catálogo en familias de amigurumis (Muñecos, Llaveros, Decoración, etc.).
          </p>
        </div>
        <button className="px-4 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors">
          <MdAdd className="text-base" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      <div className="p-8 text-center bg-white border border-stone-200/90 rounded-2xl shadow-xs space-y-2">
        <div className="w-10 h-10 rounded-xl bg-amber-100/60 text-amber-800 flex items-center justify-center mx-auto text-xl">
          🏷️
        </div>
        <h3 className="font-headline font-bold text-base text-stone-800">
          Módulo de Categorías Listo
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Permitirá crear, editar, reordenar y asignar íconos emojis a cada categoría.
        </p>
      </div>
    </div>
  );
}
