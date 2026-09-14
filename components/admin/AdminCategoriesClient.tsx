'use client';

import React, { useState, useTransition, useRef } from 'react';
import {
  MdCategory,
  MdAdd,
  MdDelete,
  MdClose,
  MdEdit,
  MdPhotoLibrary,
  MdLink,
  MdCloudUpload,
  MdCheck,
  MdOutlineImage
} from 'react-icons/md';
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/src/actions/admin/categories';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  productsCount: number;
}

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

function sanitizeCategoryError(error: any): string {
  const msg = typeof error === 'string' ? error : error?.message || '';

  if (msg.includes('asociados') || msg.includes('productos asociados')) {
    return 'No es posible eliminar esta categoría porque actualmente contiene productos asociados en la tienda.';
  }
  if (msg.includes('unique constraint') || msg.includes('slug') || msg.includes('already exists')) {
    return 'Ya existe una categoría registrada con este mismo nombre. Por favor intenta con otro nombre.';
  }
  if (msg.includes('No autorizado') || msg.includes('permisos') || msg.includes('JWT') || msg.includes('sesión')) {
    return 'Tu sesión de administrador ha caducado. Por favor vuelve a iniciar sesión.';
  }

  if (msg && !msg.includes('Error:') && !msg.includes('at ') && !msg.includes('TypeError') && !msg.includes('ReferenceError')) {
    return msg;
  }

  return 'No se pudo realizar la acción en la categoría. Por favor verifica e inténtalo nuevamente.';
}

export default function AdminCategoriesClient({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  // Estados de carga de imagen
  const [imageTab, setImageTab] = useState<'local' | 'url'>('local');
  const [localImageName, setLocalImageName] = useState('');
  const [imageSizeKb, setImageSizeKb] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleStartEdit = (cat: CategoryItem) => {
    setErrorMsg('');
    setEditId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
    });
    setLocalImageName('');
    setImageSizeKb(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditId(null);
    setFormData({ name: '', description: '', imageUrl: '' });
    setLocalImageName('');
    setImageSizeKb(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Por favor ingresa un nombre para la categoría.');
      return;
    }

    if (!formData.imageUrl) {
      setErrorMsg('Por favor carga una fotografía para la categoría o ingresa una URL válida.');
      return;
    }

    startTransition(async () => {
      try {
        if (editId) {
          // Editar categoría existente
          const res = await updateCategoryAction(editId, {
            name: formData.name,
            description: formData.description,
            imageUrl: formData.imageUrl,
          });

          if (res.success && res.category) {
            setCategories((prev) =>
              prev.map((c) =>
                c.id === editId
                  ? {
                      ...c,
                      name: res.category.name,
                      slug: res.category.slug,
                      description: res.category.description,
                      imageUrl: res.category.imageUrl,
                    }
                  : c
              )
            );
            handleCancelForm();
          }
        } else {
          // Crear nueva categoría
          const res = await createCategoryAction({
            name: formData.name,
            description: formData.description,
            imageUrl: formData.imageUrl,
            sortOrder: categories.length + 1,
            isActive: true,
          });

          if (res.success && res.category) {
            setCategories((prev) => [
              ...prev,
              {
                ...res.category,
                productsCount: 0,
              },
            ]);
            handleCancelForm();
          }
        }
      } catch (err: any) {
        setErrorMsg(sanitizeCategoryError(err));
      }
    });
  };

  const handleToggleActive = (id: string, currentActive: boolean) => {
    setErrorMsg('');
    startTransition(async () => {
      try {
        const res = await updateCategoryAction(id, { isActive: !currentActive });
        if (res.success && res.category) {
          setCategories((prev) =>
            prev.map((c) => (c.id === id ? { ...c, isActive: res.category.isActive } : c))
          );
        }
      } catch (err: any) {
        setErrorMsg(sanitizeCategoryError(err));
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    setErrorMsg('');
    if (!confirm(`¿Estás seguro de eliminar la categoría "${name}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteCategoryAction(id);
        if (res.success) {
          setCategories((prev) => prev.filter((c) => c.id !== id));
        }
      } catch (err: any) {
        setErrorMsg(sanitizeCategoryError(err));
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/90 p-6 rounded-[12px] shadow-xs">
        <div className="space-y-1">
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
            <MdCategory className="text-[#72594e]" />
            <span>Gestión de Categorías ({categories.length})</span>
          </h2>
          <p className="text-xs text-stone-500">
            Organiza las familias de productos (Muñecos, Llaveros, Decoración, etc.) para el menú de la tienda.
          </p>
        </div>
        <button
          onClick={() => {
            if (isFormOpen) {
              handleCancelForm();
            } else {
              setErrorMsg('');
              setIsFormOpen(true);
            }
          }}
          className="px-4 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[8px] shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <MdAdd className="text-base" />
          <span>{isFormOpen ? 'Cancelar' : 'Nueva Categoría'}</span>
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
          >
            <MdClose className="text-base" />
          </button>
        </div>
      )}

      {/* FORMULARIO DE CREACIÓN/EDICIÓN DE CATEGORÍA */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4 animate-in slide-in-from-top-2 duration-200"
        >
          <h3 className="font-headline font-bold text-sm text-stone-800 border-b border-stone-100 pb-3">
            {editId ? 'Editar Categoría' : 'Crear Nueva Categoría'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nombre de Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Colección Navideña"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción breve de la colección..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700 resize-none"
                />
              </div>
            </div>

            {/* IMAGEN DE LA CATEGORÍA */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Fotografía de la Categoría *
                </label>

                <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-[6px]">
                  <button
                    type="button"
                    onClick={() => setImageTab('local')}
                    className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-[4px] transition-colors ${
                      imageTab === 'local'
                        ? 'bg-white text-stone-800 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <MdPhotoLibrary className="text-xs" />
                    <span>Cargar archivo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-[4px] transition-colors ${
                      imageTab === 'url'
                        ? 'bg-white text-stone-800 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <MdLink className="text-xs" />
                    <span>Enlace URL</span>
                  </button>
                </div>
              </div>

              {imageTab === 'local' && (
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 hover:border-amber-700 rounded-[8px] p-4 text-center bg-stone-50/50 hover:bg-stone-50 transition-colors cursor-pointer space-y-1.5 group"
                  >
                    <div className="w-8 h-8 rounded-[6px] bg-amber-100/70 text-[#72594e] flex items-center justify-center mx-auto text-xl group-hover:scale-105 transition-transform">
                      <MdCloudUpload />
                    </div>
                    <div>
                      <p className="font-bold text-[11px] text-stone-800">
                        {isCompressing ? 'Procesando...' : 'Selecciona una foto'}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        Formatos PNG, JPG o WEBP (Hasta 5MB, optimización automática)
                      </p>
                    </div>
                    {localImageName && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-[4px] text-[10px] font-semibold mt-1">
                        <MdCheck className="text-emerald-600" />
                        <span className="max-w-[150px] truncate">{localImageName}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {imageTab === 'url' && (
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold text-stone-500">
                    Enlace de imagen (HTTPS)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      setLocalImageName('');
                    }}
                    placeholder="https://ejemplo.com/imagenes/categoria-muñecos.jpg"
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 font-mono"
                  />
                </div>
              )}

              {formData.imageUrl && (
                <div className="pt-1.5 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[6px] overflow-hidden border border-stone-200 bg-stone-100 shrink-0 relative shadow-2xs">
                    <img
                      src={formData.imageUrl}
                      alt="Vista previa de categoría"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-stone-800 block">Vista previa de la imagen</span>
                    <span className="text-[9px] text-stone-550 block font-medium">
                      {formData.imageUrl.startsWith('data:')
                        ? `📷 Imagen optimizada (${imageSizeKb ? `${imageSizeKb} KB` : 'comprimida'})`
                        : '🌐 Imagen enlazada externamente'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, imageUrl: '' });
                        setLocalImageName('');
                      }}
                      className="text-[10px] font-semibold text-rose-600 hover:underline"
                    >
                      Quitar foto
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={handleCancelForm}
              className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-[6px] text-xs font-medium hover:bg-stone-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || isCompressing}
              className="px-4 py-1.5 bg-[#72594e] text-white rounded-[6px] text-xs font-semibold hover:bg-[#60493f] disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Guardando...' : 'Guardar Categoría'}
            </button>
          </div>
        </form>
      )}

      {/* GRID DE CATEGORÍAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-stone-200/90 rounded-[12px] p-5 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {cat.imageUrl ? (
                    <div className="w-10 h-10 rounded-[8px] overflow-hidden border border-stone-200 bg-stone-100 shrink-0 shadow-2xs">
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-[8px] bg-stone-100 text-stone-400 flex items-center justify-center shrink-0">
                      <MdOutlineImage className="text-xl" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-headline font-bold text-sm text-stone-800">{cat.name}</h3>
                    <p className="text-[11px] text-stone-400 font-mono">/{cat.slug}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-[4px] border ${
                    cat.isActive
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-stone-100 text-stone-500 border-stone-200'
                  }`}
                >
                  {cat.isActive ? 'Activa' : 'Oculta'}
                </span>
              </div>

              {cat.description && (
                <p className="text-xs text-stone-600 line-clamp-2">{cat.description}</p>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">
                {cat.productsCount} {cat.productsCount === 1 ? 'producto' : 'productos'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStartEdit(cat)}
                  disabled={isPending}
                  className="p-1.5 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-[4px] transition-colors"
                  title="Editar categoría"
                >
                  <MdEdit className="text-base" />
                </button>
                <button
                  onClick={() => handleToggleActive(cat.id, cat.isActive)}
                  disabled={isPending}
                  className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-[4px] text-[11px] font-medium transition-colors"
                >
                  {cat.isActive ? 'Ocultar' : 'Activar'}
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  disabled={isPending || cat.productsCount > 0}
                  className="p-1 text-stone-400 hover:text-rose-600 rounded-[4px] disabled:opacity-30 transition-colors"
                  title={
                    cat.productsCount > 0
                      ? 'No se puede eliminar porque contiene productos'
                      : 'Eliminar categoría'
                  }
                >
                  <MdDelete className="text-base" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
