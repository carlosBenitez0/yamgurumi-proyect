import React from 'react';
import Link from 'next/link';
import { MdArrowBack, MdSave, MdCloudUpload, MdShoppingBag } from 'react-icons/md';

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER DE FORMULARIO */}
      <div className="flex items-center justify-between bg-white border border-stone-200/90 p-6 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/productos"
            className="p-2 bg-stone-100 hover:bg-stone-200/70 text-stone-600 rounded-xl transition-colors"
            title="Volver a lista de productos"
          >
            <MdArrowBack className="text-lg" />
          </Link>
          <div>
            <h2 className="font-headline font-bold text-xl text-stone-800 flex items-center gap-2">
              <MdShoppingBag className="text-[#72594e]" />
              <span>Añadir Nuevo Producto</span>
            </h2>
            <p className="text-xs text-stone-500">
              Registra un nuevo amigurumi o producto tejido en el catálogo de Yamgurumi.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors">
          <MdSave className="text-base" />
          <span>Guardar Producto</span>
        </button>
      </div>

      {/* FORMULARIO MAQUETADO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA: DATOS PRINCIPALES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-headline font-bold text-sm text-stone-800 border-b border-stone-100 pb-3">
              Información Básica
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Oso Teddy Tejido a Mano en Crochet"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Categoría *
                  </label>
                  <select className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-amber-700">
                    <option value="">Selecciona una categoría</option>
                    <option value="munecos">Muñecos 🧸</option>
                    <option value="llaveros">Llaveros 🔑</option>
                    <option value="decoracion">Decoración 🏡</option>
                    <option value="accesorios">Accesorios ✨</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tamaño del Amigurumi
                  </label>
                  <select defaultValue="Mediano" className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-amber-700">
                    <option value="Mini">Mini (5 - 10 cm)</option>
                    <option value="Mediano">Mediano (15 - 22 cm)</option>
                    <option value="Grande">Grande (25 - 40 cm)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descripción Corta y Detalles
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe la ternura del producto, detalles del tejido, personaje o uso..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Materiales Utilizados
                </label>
                <input
                  type="text"
                  placeholder="Ej: Hilo de algodón 100% hipoalergénico, ojos de seguridad, relleno vellón siliconado."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>
          </div>

          {/* GALERÍA DE IMÁGENES */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-headline font-bold text-sm text-stone-800 border-b border-stone-100 pb-3">
              Galería de Imágenes
            </h3>
            
            <div className="border-2 border-dashed border-stone-300 hover:border-amber-700 rounded-2xl p-6 text-center bg-stone-50/50 transition-colors cursor-pointer space-y-1.5">
              <MdCloudUpload className="text-3xl text-stone-400 mx-auto" />
              <p className="font-semibold text-xs text-stone-700">
                Haz clic o arrastra fotos del amigurumi aquí
              </p>
              <p className="text-[11px] text-stone-400">
                PNG, JPG, WEBP (Máx 5MB por imagen).
              </p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: PRECIOS Y STOCK */}
        <div className="space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-headline font-bold text-sm text-stone-800 border-b border-stone-100 pb-3">
              Precios e Inventario
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Precio Normal ($ USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="25.00"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Precio de Oferta ($ USD opcional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="19.99"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-rose-700 font-bold focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cantidad en Stock *
                </label>
                <input
                  type="number"
                  defaultValue={10}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-headline font-bold text-sm text-stone-800 border-b border-stone-100 pb-3">
              Visibilidad
            </h3>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-stone-800 block">Producto Activo</span>
                  <span className="text-[11px] text-stone-500">Visible en la tienda</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#72594e] rounded" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-stone-800 block">Destacar en Inicio</span>
                  <span className="text-[11px] text-stone-500">En sección "Más Vendidos"</span>
                </div>
                <input type="checkbox" className="w-4 h-4 accent-[#72594e] rounded" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
