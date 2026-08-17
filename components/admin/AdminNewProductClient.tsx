'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdSave, MdCloudUpload, MdShoppingBag } from 'react-icons/md';
import { createProductAction } from '@/src/actions/admin/products';

interface CategoryOption {
  id: string;
  name: string;
  icon?: string | null;
}

export default function AdminNewProductClient({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    categoryId: categories[0]?.id || '',
    price: '',
    salePrice: '',
    stock: '10',
    size: 'Mediano',
    description: '',
    materials: 'Hilo de algodón 100% hipoalergénico, ojos de seguridad, vellón siliconado',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
    isFeatured: false,
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Por favor ingresa un nombre para el producto.');
      return;
    }
    if (!formData.categoryId) {
      setErrorMsg('Por favor selecciona una categoría.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMsg('Por favor ingresa un precio válido.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await createProductAction({
          name: formData.name,
          categoryId: formData.categoryId,
          price: Number(formData.price),
          salePrice: formData.salePrice ? Number(formData.salePrice) : null,
          stock: Number(formData.stock),
          size: formData.size,
          description: formData.description || 'Amigurumi tejido a mano con acabados artesanales.',
          materials: formData.materials,
          imageUrls: [formData.imageUrl],
          isFeatured: formData.isFeatured,
          isActive: formData.isActive,
        });

        if (res.success) {
          router.push('/admin/productos');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error al guardar el producto');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER DE FORMULARIO */}
      <div className="flex items-center justify-between bg-white border border-stone-200/90 p-6 rounded-[12px] shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/productos"
            className="p-2 bg-stone-100 hover:bg-stone-200/70 text-stone-600 rounded-[8px] transition-colors"
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

        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[8px] shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <MdSave className="text-base" />
          <span>{isPending ? 'Guardando...' : 'Guardar Producto'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-[8px] text-rose-800 text-xs font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* FORMULARIO MAQUETADO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA: DATOS PRINCIPALES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4">
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
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Oso Teddy Tejido a Mano en Crochet"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Categoría *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon ? `${cat.icon} ` : ''}
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tamaño del Amigurumi
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700"
                  >
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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe la ternura del producto, detalles del tejido, personaje o uso..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Materiales Utilizados
                </label>
                <input
                  type="text"
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  placeholder="Ej: Hilo de algodón 100% hipoalergénico, ojos de seguridad, relleno vellón siliconado."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>
          </div>

          {/* GALERÍA DE IMÁGENES */}
          <div className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4">
            <h3 className="font-headline font-bold text-sm text-stone-800 border-b border-stone-100 pb-3">
              Imagen del Producto (URL)
            </h3>

            <div>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="URL de la imagen (HTTPS)..."
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
              />
            </div>

            {formData.imageUrl && (
              <div className="w-24 h-24 rounded-[8px] overflow-hidden border border-stone-200 bg-stone-50">
                <img
                  src={formData.imageUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: PRECIOS Y STOCK */}
        <div className="space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4">
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
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="25.00"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Precio de Oferta ($ USD opcional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  placeholder="19.99"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-rose-700 font-bold focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cantidad en Stock *
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4">
            <h3 className="font-headline font-bold text-sm text-stone-800 border-b border-stone-100 pb-3">
              Visibilidad
            </h3>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 rounded-[8px] bg-stone-50 border border-stone-100 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-stone-800 block">Producto Activo</span>
                  <span className="text-[11px] text-stone-500">Visible en la tienda</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#72594e] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-[8px] bg-stone-50 border border-stone-100 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-stone-800 block">Destacar en Inicio</span>
                  <span className="text-[11px] text-stone-500">En sección "Más Vendidos"</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-[#72594e] rounded"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
