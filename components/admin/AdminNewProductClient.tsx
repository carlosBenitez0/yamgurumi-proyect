'use client';

import React, { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MdArrowBack,
  MdSave,
  MdCloudUpload,
  MdShoppingBag,
  MdLink,
  MdPhotoLibrary,
  MdCheck,
  MdClose,
} from 'react-icons/md';
import { createProductAction } from '@/src/actions/admin/products';

interface CategoryOption {
  id: string;
  name: string;
  icon?: string | null;
}

const DEFAULT_MATERIALS = [
  'Hilo de algodón 100% hipoalergénico',
  'Ojos de seguridad de plástico',
  'Relleno de vellón siliconado',
  'Lana acrílica suave',
  'Detalles bordados a mano',
  'Argolla metálica para llavero',
  'Fieltro y aplicaciones',
  'Sonajero o cascabel interno',
  'Lana chenille / peluche',
];

// Helper para comprimir y convertir imágenes locales a formato JPEG ultraliviano (~80KB - 200KB)
async function compressImageFile(file: File, maxDimension = 900, quality = 0.78): Promise<{ dataUrl: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const rawResult = e.target?.result as string;
          const approxKb = Math.round((rawResult.length * 0.75) / 1024);
          resolve({ dataUrl: rawResult, sizeKb: approxKb });
          return;
        }

        // Fondo blanco para convertir transparencias PNG sin artefactos negros
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeKb = Math.round((dataUrl.length * 0.75) / 1024);
        resolve({ dataUrl, sizeKb });
      };
      img.onerror = () => {
        const rawResult = e.target?.result as string;
        const approxKb = Math.round((rawResult.length * 0.75) / 1024);
        resolve({ dataUrl: rawResult, sizeKb: approxKb });
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Sanitizador de errores técnicos a mensajes comprensibles para el usuario
function sanitizeErrorMessage(error: any): string {
  const msg = typeof error === 'string' ? error : error?.message || '';

  if (msg.includes('Body exceeded') || msg.includes('limit')) {
    return 'La fotografía seleccionada es muy pesada. Por favor intenta seleccionar otra foto o reducir su resolución.';
  }
  if (msg.includes('No autorizado') || msg.includes('permisos') || msg.includes('JWT') || msg.includes('sesión')) {
    return 'Tu sesión de administrador ha caducado. Por favor vuelve a iniciar sesión en el panel.';
  }
  if (msg.includes('unique constraint') || msg.includes('slug')) {
    return 'Ya existe un amigurumi registrado con este mismo nombre. Intenta utilizar un nombre ligeramente diferente.';
  }
  if (msg.includes('fetch failed') || msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
    return 'Ocurrió un inconveniente de conexión con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.';
  }

  if (msg && !msg.includes('Error:') && !msg.includes('at ') && !msg.includes('TypeError') && !msg.includes('ReferenceError') && !msg.includes('Prisma')) {
    return msg;
  }

  return 'No se pudo guardar el producto debido a un inconveniente con los datos ingresados. Por favor revisa el formulario e inténtalo de nuevo.';
}

export default function AdminNewProductClient({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  // Estados de Imagen
  const [imageTab, setImageTab] = useState<'local' | 'url'>('local');
  const [localImageName, setLocalImageName] = useState('');
  const [imageSizeKb, setImageSizeKb] = useState<number | null>(null);

  // Estados de Tamaño
  const [sizeSelect, setSizeSelect] = useState('Mediano');
  const [customSize, setCustomSize] = useState('');

  // Estados de Materiales Predeterminados
  const [presetMaterials, setPresetMaterials] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('yamgurumi_preset_materials');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    return DEFAULT_MATERIALS;
  });

  const [newPresetInput, setNewPresetInput] = useState('');
  const [showAddPresetForm, setShowAddPresetForm] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: categories[0]?.id || '',
    price: '',
    salePrice: '',
    stock: '10',
    description: '',
    materials: 'Hilo de algodón 100% hipoalergénico, ojos de seguridad, vellón siliconado',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
    isFeatured: false,
    isActive: true,
  });

  const handleAddPreset = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newPresetInput.trim();
    if (!trimmed) return;
    if (presetMaterials.some((m) => m.toLowerCase() === trimmed.toLowerCase())) {
      setNewPresetInput('');
      setShowAddPresetForm(false);
      return;
    }

    const updated = [...presetMaterials, trimmed];
    setPresetMaterials(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yamgurumi_preset_materials', JSON.stringify(updated));
    }
    setNewPresetInput('');
    setShowAddPresetForm(false);

    toggleMaterial(trimmed);
  };

  const confirmRemovePreset = (materialToRemove: string) => {
    const updated = presetMaterials.filter((m) => m !== materialToRemove);
    setPresetMaterials(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yamgurumi_preset_materials', JSON.stringify(updated));
    }
    setMaterialToDelete(null);
  };

  // Manejo con compresión de carga de archivos locales
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('La foto seleccionada supera el límite de 5MB. Por favor elige una imagen de hasta 5MB.');
      return;
    }

    try {
      setIsCompressing(true);
      setErrorMsg('');
      const { dataUrl, sizeKb } = await compressImageFile(file, 900, 0.78);
      setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
      setLocalImageName(file.name);
      setImageSizeKb(sizeKb);
    } catch (err) {
      setErrorMsg('No se pudo procesar la foto elegida. Por favor intenta con otra imagen en formato PNG o JPG.');
    } finally {
      setIsCompressing(false);
    }
  };

  const toggleMaterial = (material: string) => {
    const currentList = formData.materials
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    let updated: string[];
    if (currentList.includes(material)) {
      updated = currentList.filter((m) => m !== material);
    } else {
      updated = [...currentList, material];
    }
    setFormData({ ...formData, materials: updated.join(', ') });
  };

  const isMaterialSelected = (material: string) => {
    const currentList = formData.materials
      .split(',')
      .map((m) => m.trim().toLowerCase());
    return currentList.includes(material.toLowerCase());
  };

  // Envío y validación del formulario con manejo amigable de excepciones
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Por favor ingresa un nombre claro para el producto.');
      return;
    }

    if (!formData.categoryId) {
      setErrorMsg('Por favor selecciona una categoría de la lista.');
      return;
    }

    const finalSize = sizeSelect === 'Personalizado' ? customSize.trim() : sizeSelect;

    if (sizeSelect === 'Personalizado' && !customSize.trim()) {
      setErrorMsg('Por favor escribe el tamaño personalizado a mano en el campo correspondiente.');
      return;
    }

    if (!finalSize) {
      setErrorMsg('Por favor selecciona o especifica un tamaño válido.');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMsg('Por favor ingresa un precio válido mayor a $0.00.');
      return;
    }

    if (!formData.imageUrl) {
      setErrorMsg('Por favor carga una fotografía del amigurumi o ingresa una URL válida.');
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
          size: finalSize,
          description: formData.description || 'Amigurumi tejido a mano en crochet.',
          materials: formData.materials || 'Hilo de algodón 100% hipoalergénico',
          imageUrls: [formData.imageUrl],
          isFeatured: formData.isFeatured,
          isActive: formData.isActive,
        });

        if (res.success) {
          router.push('/admin/productos');
        }
      } catch (err: any) {
        setErrorMsg(sanitizeErrorMessage(err));
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
          disabled={isPending || isCompressing}
          className="px-4 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[8px] shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <MdSave className="text-base" />
          <span>{isPending ? 'Guardando...' : 'Guardar Producto'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-[8px] text-rose-800 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top-1 duration-150">
          <span className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </span>
          <button
            type="button"
            onClick={() => setErrorMsg('')}
            className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-100 transition-colors"
            title="Cerrar aviso"
          >
            <MdClose className="text-base" />
          </button>
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
                    Tamaño del Amigurumi *
                  </label>
                  <select
                    value={sizeSelect}
                    onChange={(e) => setSizeSelect(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700"
                  >
                    <option value="Mini">Mini (5 - 10 cm)</option>
                    <option value="Mediano">Mediano (15 - 22 cm)</option>
                    <option value="Grande">Grande (25 - 40 cm)</option>
                    <option value="Personalizado">✏️ Escribir a mano / Tamaño Personalizado</option>
                  </select>
                </div>
              </div>

              {sizeSelect === 'Personalizado' && (
                <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-[8px] space-y-1.5 animate-in slide-in-from-top-1 duration-150">
                  <label className="block text-xs font-bold text-amber-900">
                    Especifica el tamaño a mano *
                  </label>
                  <input
                    type="text"
                    required
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    placeholder="Ej: Gigante (60 cm), Micro Llavero (3 cm), XL (50x30 cm)..."
                    className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 font-medium"
                  />
                  <p className="text-[11px] text-amber-700">
                    Este tamaño se guardará y mostrará directamente en la ficha del producto.
                  </p>
                </div>
              )}

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

              {/* LISTADO DE MATERIALES COMUNES */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Materiales Utilizados
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddPresetForm(!showAddPresetForm)}
                    className="text-[11px] font-semibold text-[#206776] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>{showAddPresetForm ? 'Ocultar formulario' : '+ Agregar nuevo material a la lista'}</span>
                  </button>
                </div>

                {showAddPresetForm && (
                  <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-[8px] space-y-2 animate-in slide-in-from-top-1 duration-150">
                    <label className="block text-xs font-bold text-teal-900">
                      Añadir nuevo material predeterminado:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newPresetInput}
                        onChange={(e) => setNewPresetInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPreset();
                          }
                        }}
                        placeholder="Ej: Cinta de raso, Lana Velvet, Relleno perfumado..."
                        className="flex-1 px-3 py-1.5 bg-white border border-teal-300 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-teal-700"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddPreset()}
                        className="px-3 py-1.5 bg-[#206776] hover:bg-[#1a5562] text-white rounded-[6px] text-xs font-semibold shrink-0 transition-colors"
                      >
                        Añadir
                      </button>
                    </div>
                    <p className="text-[10px] text-teal-700">
                      Se guardará en tu lista predeterminada para que puedas volver a seleccionarlo en cualquier producto.
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 p-3 bg-stone-50 border border-stone-200/80 rounded-[8px]">
                  {presetMaterials.map((mat) => {
                    const selected = isMaterialSelected(mat);
                    const isConfirming = materialToDelete === mat;

                    if (isConfirming) {
                      return (
                        <div
                          key={mat}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-300 text-rose-900 rounded-[6px] text-[11px] font-semibold animate-in fade-in duration-150"
                        >
                          <span>¿Eliminar "{mat}"?</span>
                          <button
                            type="button"
                            onClick={() => confirmRemovePreset(mat)}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded-[4px] text-[10px] font-bold transition-colors"
                          >
                            Sí, eliminar
                          </button>
                          <button
                            type="button"
                            onClick={() => setMaterialToDelete(null)}
                            className="px-2 py-0.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-[4px] text-[10px] font-bold transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={mat}
                        onClick={() => toggleMaterial(mat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-medium cursor-pointer transition-all group ${
                          selected
                            ? 'bg-[#72594e] text-white shadow-2xs'
                            : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-700 hover:text-amber-900'
                        }`}
                      >
                        {selected && <MdCheck className="text-xs text-amber-200 shrink-0" />}
                        <span>{mat}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMaterialToDelete(mat);
                          }}
                          className={`ml-0.5 p-0.5 rounded-full hover:bg-stone-200/80 transition-colors ${
                            selected ? 'hover:bg-[#594339] text-amber-200' : 'text-stone-400 hover:text-rose-600'
                          }`}
                          title={`Eliminar "${mat}" de la lista predeterminada`}
                        >
                          <MdClose className="text-[11px]" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <textarea
                  rows={2}
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  placeholder="Escribe o edita la lista completa de materiales..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 resize-none font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* GALERÍA / IMAGEN DEL PRODUCTO (CARGA LOCAL Y URL) */}
          <div className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-headline font-bold text-sm text-stone-800">
                Fotografía del Producto *
              </h3>

              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-[6px]">
                <button
                  type="button"
                  onClick={() => setImageTab('local')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-[4px] transition-colors ${
                    imageTab === 'local'
                      ? 'bg-white text-stone-800 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <MdPhotoLibrary className="text-sm" />
                  <span>Cargar desde Equipo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-[4px] transition-colors ${
                    imageTab === 'url'
                      ? 'bg-white text-stone-800 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <MdLink className="text-sm" />
                  <span>Enlace URL</span>
                </button>
              </div>
            </div>

            {imageTab === 'local' && (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-amber-700 rounded-[8px] p-6 text-center bg-stone-50/50 hover:bg-stone-50 transition-colors cursor-pointer space-y-2 group"
                >
                  <div className="w-12 h-12 rounded-[8px] bg-amber-100/70 text-[#72594e] flex items-center justify-center mx-auto text-2xl group-hover:scale-105 transition-transform">
                    <MdCloudUpload />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-stone-800">
                      {isCompressing ? 'Optimizando imagen...' : 'Haz clic para seleccionar una foto desde tu computadora'}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Soporta fotos PNG, JPG o WEBP (Hasta 5MB por foto, optimizadas automáticamente)
                    </p>
                  </div>
                  {localImageName && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-[6px] text-xs font-semibold mt-2">
                      <MdCheck className="text-emerald-600 text-base" />
                      <span>{localImageName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {imageTab === 'url' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Enlace directo de la imagen (HTTPS)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    setLocalImageName('');
                  }}
                  placeholder="https://ejemplo.com/fotos/amigurumi-oso.jpg"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 font-mono"
                />
              </div>
            )}

            {formData.imageUrl && (
              <div className="pt-2 flex items-center gap-4">
                <div className="w-20 h-20 rounded-[8px] overflow-hidden border border-stone-200 bg-stone-100 shrink-0 relative shadow-2xs">
                  <img
                    src={formData.imageUrl}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-stone-800 block">Vista previa de la foto</span>
                  <span className="text-[11px] text-stone-500 block font-medium">
                    {formData.imageUrl.startsWith('data:')
                      ? `📷 Foto optimizada a formato JPEG (${imageSizeKb ? `${imageSizeKb} KB` : 'ultraliviana'})`
                      : '🌐 Imagen vinculada por URL'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, imageUrl: '' });
                      setLocalImageName('');
                    }}
                    className="text-[11px] font-semibold text-rose-600 hover:underline"
                  >
                    Quitar foto
                  </button>
                </div>
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
