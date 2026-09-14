'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
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
  MdStar,
  MdDelete,
  MdAdd,
  MdChevronLeft,
  MdChevronRight,
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

const DEFAULT_CRAFTING_DAYS_PRESETS = [
  '3-5 días hábiles',
  '5-10 días hábiles',
  '7-12 días hábiles',
  '10-15 días hábiles',
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

  // Estados de Imagen Multi-Imagen
  const [imageTab, setImageTab] = useState<'local' | 'url'>('local');
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');

  // Estados de Tamaño
  const [sizeSelect, setSizeSelect] = useState('Mediano');
  const [customSize, setCustomSize] = useState('');

  // Estados de Materiales Predeterminados
  const [presetMaterials, setPresetMaterials] = useState<string[]>(DEFAULT_MATERIALS);

  // Estados de Días de Elaboración Predeterminados
  const [presetCraftingDays, setPresetCraftingDays] = useState<string[]>(DEFAULT_CRAFTING_DAYS_PRESETS);
  const [newCraftingDayInput, setNewCraftingDayInput] = useState('');
  const [showAddCraftingDayForm, setShowAddCraftingDayForm] = useState(false);
  const [craftingDayToDelete, setCraftingDayToDelete] = useState<string | null>(null);

  // Cargar lista personalizada de localStorage solo tras el montaje en el cliente para evitar hidratación fallida (Hydration Mismatch)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMaterials = localStorage.getItem('yamgurumi_preset_materials');
      if (storedMaterials) {
        try {
          setPresetMaterials(JSON.parse(storedMaterials));
        } catch (e) {}
      }

      const storedCraftingDays = localStorage.getItem('yamgurumi_preset_crafting_days');
      if (storedCraftingDays) {
        try {
          const parsed = JSON.parse(storedCraftingDays);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPresetCraftingDays(parsed);
          }
        } catch (e) {}
      }
    }
  }, []);

  const saveCraftingDaysPresetsToStorage = (list: string[]) => {
    setPresetCraftingDays(list);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yamgurumi_preset_crafting_days', JSON.stringify(list));
    }
  };

  const handleAddCraftingDayPreset = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCraftingDayInput.trim();
    if (!trimmed) return;
    if (!presetCraftingDays.some((m) => m.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...presetCraftingDays, trimmed];
      saveCraftingDaysPresetsToStorage(updated);
    }
    setFormData((prev) => ({ ...prev, craftingDays: trimmed }));
    setNewCraftingDayInput('');
    setShowAddCraftingDayForm(false);
  };

  const confirmRemoveCraftingDayPreset = (presetToRemove: string) => {
    const updated = presetCraftingDays.filter((m) => m.toLowerCase() !== presetToRemove.toLowerCase());
    saveCraftingDaysPresetsToStorage(updated);
    setCraftingDayToDelete(null);
  };

  const [newPresetInput, setNewPresetInput] = useState('');
  const [showAddPresetForm, setShowAddPresetForm] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: categories[0]?.id || '',
    price: '',
    salePrice: '',
    stock: '10',
    craftingDays: '5-10 días hábiles',
    description: '',
    materials: 'Hilo de algodón 100% hipoalergénico, ojos de seguridad, vellón siliconado',
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

  // Manejo de imágenes múltiples
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const oversized = selectedFiles.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      setErrorMsg(`La foto "${oversized.name}" supera el límite de 5MB.`);
      return;
    }

    try {
      setIsCompressing(true);
      setErrorMsg('');
      const compressed: string[] = [];
      for (const file of selectedFiles) {
        const { dataUrl } = await compressImageFile(file, 900, 0.78);
        compressed.push(dataUrl);
      }
      setImages((prev) => [...prev, ...compressed]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setErrorMsg('No se pudieron procesar las imágenes seleccionadas.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleAddUrlImage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setErrorMsg('La URL de la imagen debe comenzar con https:// o http://');
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setUrlInput('');
    setErrorMsg('');
  };

  const setCoverImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
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

    if (images.length === 0) {
      setErrorMsg('Por favor agrega al menos una fotografía para el producto.');
      return;
    }

    const currentCraftingDays = (formData.craftingDays || '5-10 días hábiles').trim();
    if (!presetCraftingDays.some((m) => m.toLowerCase() === currentCraftingDays.toLowerCase())) {
      const updated = [...presetCraftingDays, currentCraftingDays];
      saveCraftingDaysPresetsToStorage(updated);
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
          craftingDays: formData.craftingDays || '5-10 días hábiles',
          description: formData.description || 'Amigurumi tejido a mano en crochet.',
          materials: formData.materials || 'Hilo de algodón 100% hipoalergénico',
          imageUrls: images,
          tags: ['Artesanal', 'Kawaii'],
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
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-[8px] text-rose-800 text-xs font-semibold flex items-center justify-between gap-3 animate-in slide-in-from-top-1 duration-150">
          <span className="flex items-center gap-2 min-w-0">
            <span className="shrink-0">⚠️</span>
            <span>{errorMsg}</span>
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {errorMsg.includes('sesión') && (
              <a
                href="/auth/login"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-[6px] text-xs font-bold transition-colors shadow-2xs whitespace-nowrap"
              >
                Iniciar Sesión Aquí
              </a>
            )}
            <button
              type="button"
              onClick={() => setErrorMsg('')}
              className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-100 transition-colors"
              title="Cerrar aviso"
            >
              <MdClose className="text-base" />
            </button>
          </div>
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

          {/* GALERÍA / IMÁGENES DEL PRODUCTO (CARGA MULTIPLE LOCAL Y URL) */}
          <div className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-headline font-bold text-sm text-stone-800 flex items-center gap-2">
                  <span>Fotografías del Producto *</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                    {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
                  </span>
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Puedes subir varias fotos del amigurumi. La primera foto será la portada principal del catálogo.
                </p>
              </div>

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
                  <span>Equipo</span>
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
                  <span>URL</span>
                </button>
              </div>
            </div>

            {imageTab === 'local' && (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  multiple
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
                      {isCompressing ? 'Optimizando imágenes...' : 'Haz clic para seleccionar una o varias fotos desde tu computadora'}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Puedes seleccionar varios archivos a la vez (PNG, JPG, WEBP de hasta 5MB cada uno)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {imageTab === 'url' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Agregar foto por enlace URL (HTTPS)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddUrlImage();
                      }
                    }}
                    placeholder="https://ejemplo.com/fotos/amigurumi-oso.jpg"
                    className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlImage}
                    className="px-3.5 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[6px] transition-colors flex items-center gap-1 shrink-0"
                  >
                    <MdAdd className="text-base" />
                    <span>Añadir</span>
                  </button>
                </div>
              </div>
            )}

            {/* LISTADO Y GALERÍA DE IMÁGENES CARGADAS */}
            {images.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-stone-700 block">
                  Galería de Fotos ({images.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((imgUrl, idx) => {
                    const isCover = idx === 0;
                    return (
                      <div
                        key={idx}
                        className={`relative rounded-[8px] overflow-hidden border bg-stone-100 group shadow-xs transition-all ${
                          isCover ? 'border-amber-600 ring-2 ring-amber-500/40' : 'border-stone-200'
                        }`}
                      >
                        <div className="aspect-square relative w-full overflow-hidden bg-stone-50">
                          <img
                            src={imgUrl}
                            alt={`Foto ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Overlay de acciones */}
                          <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            <div className="flex items-center justify-between">
                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={() => setCoverImage(idx)}
                                  className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold shadow-xs flex items-center gap-0.5"
                                  title="Establecer como foto de portada principal"
                                >
                                  <MdStar className="text-xs" />
                                  <span>Portada</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="ml-auto p-1 bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors"
                                title="Eliminar imagen"
                              >
                                <MdDelete className="text-sm" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-white">
                              {idx > 0 ? (
                                <button
                                  type="button"
                                  onClick={() => moveImage(idx, 'left')}
                                  className="p-1 bg-white/20 hover:bg-white/40 rounded transition-colors"
                                  title="Mover foto a la izquierda"
                                >
                                  <MdChevronLeft className="text-base" />
                                </button>
                              ) : <span />}

                              {idx < images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => moveImage(idx, 'right')}
                                  className="p-1 bg-white/20 hover:bg-white/40 rounded transition-colors"
                                  title="Mover foto a la derecha"
                                >
                                  <MdChevronRight className="text-base" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {isCover && (
                          <div className="bg-amber-600 text-white text-[10px] font-bold text-center py-0.5 tracking-wider uppercase flex items-center justify-center gap-1">
                            <MdStar className="text-xs" />
                            <span>Portada Principal</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
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

              <div>
                {/* Header con label y botón discreto */}
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-stone-700">
                    Días de Elaboración Bajo Encargo <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddCraftingDayForm(!showAddCraftingDayForm)}
                    className="text-[11px] font-semibold text-amber-900 hover:text-amber-950 hover:underline inline-flex items-center gap-1"
                  >
                    <MdAdd className="text-xs" />
                    <span>{showAddCraftingDayForm ? 'Ocultar' : 'Añadir opción'}</span>
                  </button>
                </div>

                {/* Campo de texto principal */}
                <input
                  type="text"
                  required
                  value={formData.craftingDays}
                  onChange={(e) => setFormData({ ...formData, craftingDays: e.target.value })}
                  placeholder="Ej: 5-10 días hábiles"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700 shadow-2xs"
                />

                <p className="text-[11px] text-stone-400 mt-1">
                  Rango estimado de días para tejer el producto cuando no hay stock.
                </p>

                {/* Formulario rápido para añadir nuevo preset */}
                {showAddCraftingDayForm && (
                  <div className="mt-2.5 p-3 bg-amber-50/70 border border-amber-200/80 rounded-[8px] space-y-2 animate-in slide-in-from-top-1 duration-150">
                    <label className="block text-xs font-bold text-amber-950">
                      Añadir nuevo rango predeterminado:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCraftingDayInput}
                        onChange={(e) => setNewCraftingDayInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCraftingDayPreset();
                          }
                        }}
                        placeholder="Ej: 10-15 días hábiles, 1-2 semanas..."
                        className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCraftingDayPreset()}
                        className="px-3.5 py-1.5 bg-[#72594e] hover:bg-[#60493f] text-white rounded-[6px] text-xs font-bold shrink-0 transition-colors shadow-2xs"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                )}

                {/* Chips de opciones rápidas (Limpio y estilizado) */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  {presetCraftingDays.map((preset) => {
                    const isSelected = formData.craftingDays.trim().toLowerCase() === preset.trim().toLowerCase();
                    const isConfirming = craftingDayToDelete === preset;

                    if (isConfirming) {
                      return (
                        <div
                          key={preset}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-900 rounded-full text-[11px] font-semibold animate-in fade-in duration-150"
                        >
                          <span>¿Borrar "{preset}"?</span>
                          <button
                            type="button"
                            onClick={() => confirmRemoveCraftingDayPreset(preset)}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-[10px] font-bold transition-colors"
                          >
                            Sí
                          </button>
                          <button
                            type="button"
                            onClick={() => setCraftingDayToDelete(null)}
                            className="px-2 py-0.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-full text-[10px] font-bold transition-colors"
                          >
                            No
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={preset}
                        onClick={() => setFormData({ ...formData, craftingDays: preset })}
                        className={`group inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#72594e] text-white shadow-xs ring-1 ring-[#72594e]'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 hover:text-stone-900 border border-stone-200/60'
                        }`}
                      >
                        {isSelected && <MdCheck className="text-xs text-amber-200 shrink-0" />}
                        <span>{preset}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCraftingDayToDelete(preset);
                          }}
                          className={`p-0.5 rounded-full transition-opacity ${
                            isSelected
                              ? 'text-white/70 hover:text-white hover:bg-white/20'
                              : 'text-stone-400 opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-stone-300/50'
                          }`}
                          title={`Eliminar "${preset}"`}
                        >
                          <MdClose className="text-[11px]" />
                        </button>
                      </div>
                    );
                  })}
                </div>
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
