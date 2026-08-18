'use client';

import React, { useState, useTransition } from 'react';
import { MdCategory, MdAdd, MdDelete, MdClose } from 'react-icons/md';
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
  sortOrder: number;
  isActive: boolean;
  productsCount: number;
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
  const [isCreating, setIsCreating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    icon: '🧸',
    description: '',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Por favor ingresa un nombre para la categoría.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await createCategoryAction({
          name: formData.name,
          icon: formData.icon,
          description: formData.description,
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
          setIsCreating(false);
          setFormData({ name: '', icon: '🧸', description: '' });
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
            setErrorMsg('');
            setIsCreating(!isCreating);
          }}
          className="px-4 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[8px] shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <MdAdd className="text-base" />
          <span>{isCreating ? 'Cancelar' : 'Nueva Categoría'}</span>
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

      {/* FORMULARIO DE NUEVA CATEGORÍA */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4 animate-in slide-in-from-top-2 duration-200"
        >
          <h3 className="font-headline font-bold text-sm text-stone-800 border-b border-stone-100 pb-3">
            Crear Nueva Categoría
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Icono / Emoji *
              </label>
              <input
                type="text"
                required
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Ej: 🧸"
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700"
              />
            </div>
            <div className="sm:col-span-2">
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Descripción
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción breve de la colección..."
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-[6px] text-xs font-medium hover:bg-stone-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-1.5 bg-[#72594e] text-white rounded-[6px] text-xs font-semibold hover:bg-[#60493f] disabled:opacity-50"
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
                  <div className="w-10 h-10 rounded-[8px] bg-stone-100 flex items-center justify-center text-xl shrink-0">
                    {cat.icon || '🧶'}
                  </div>
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
