import React from 'react';
import Link from 'next/link';
import { MdAdd, MdSearch, MdShoppingBag } from 'react-icons/md';

export default function AdminProductsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/90 p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
            <MdShoppingBag className="text-[#72594e]" />
            <span>Catálogo de Productos</span>
          </h2>
          <p className="text-xs text-stone-500">
            Administra los amigurumis, muñecos tejidos, precios, stock y visibilidad en la tienda.
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="px-4 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <MdAdd className="text-base" />
          <span>Añadir Producto</span>
        </Link>
      </div>

      {/* CONTENEDOR CON FILTROS */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-base" />
            <input
              type="text"
              placeholder="Buscar producto por nombre, categoría o tag..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-700 focus:outline-none">
              <option value="">Todas las Categorías</option>
              <option value="munecos">Muñecos</option>
              <option value="llaveros">Llaveros</option>
              <option value="decoracion">Decoración</option>
              <option value="accesorios">Accesorios</option>
            </select>
            <select className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-700 focus:outline-none">
              <option value="">Todos los Estados</option>
              <option value="active">Activo</option>
              <option value="draft">Borrador</option>
              <option value="out_of_stock">Sin Stock</option>
            </select>
          </div>
        </div>

        {/* MENSAJE DE ESTADO INICIAL */}
        <div className="p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100/60 text-amber-800 flex items-center justify-center mx-auto text-xl">
            🧸
          </div>
          <h3 className="font-headline font-bold text-base text-stone-800">
            Módulo de Productos Listo
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Interfaz limpia y ligera del CRUD de productos. Próximo a vincularse con Prisma.
          </p>
        </div>
      </div>
    </div>
  );
}
