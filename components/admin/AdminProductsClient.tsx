'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  MdAdd,
  MdSearch,
  MdShoppingBag,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdVisibilityOff,
  MdRefresh,
} from 'react-icons/md';
import { toggleProductActiveAction, deleteProductAction } from '@/src/actions/admin/products';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  size: string;
  isFeatured: boolean;
  isActive: boolean;
  imageUrls: string[];
  category: {
    id: string;
    name: string;
    icon?: string | null;
    slug: string;
  };
}

interface CategoryOption {
  id: string;
  name: string;
  icon?: string | null;
}

export default function AdminProductsClient({
  initialProducts,
  categories,
}: {
  initialProducts: ProductItem[];
  categories: CategoryOption[];
}) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isPending, startTransition] = useTransition();

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === '' || p.category.id === selectedCategory;

    const matchesStatus =
      selectedStatus === '' ||
      (selectedStatus === 'active' && p.isActive) ||
      (selectedStatus === 'inactive' && !p.isActive) ||
      (selectedStatus === 'out_of_stock' && p.stock === 0);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleActive = (id: string, currentActive: boolean) => {
    startTransition(async () => {
      try {
        const res = await toggleProductActiveAction(id, !currentActive);
        if (res.success) {
          setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isActive: res.isActive } : p))
          );
        }
      } catch (err: any) {
        alert(err.message || 'Error al cambiar estado');
      }
    });
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteProductAction(id);
        if (res.success) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }
      } catch (err: any) {
        alert(err.message || 'Error al eliminar producto');
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/90 p-6 rounded-[12px] shadow-xs">
        <div className="space-y-1">
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
            <MdShoppingBag className="text-[#72594e]" />
            <span>Catálogo de Productos ({filteredProducts.length})</span>
          </h2>
          <p className="text-xs text-stone-500">
            Administra los amigurumis, muñecos tejidos, precios, stock y visibilidad en la tienda.
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="px-4 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[8px] shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <MdAdd className="text-base" />
          <span>Añadir Producto</span>
        </Link>
      </div>

      {/* CONTENEDOR CON FILTROS Y TABLA */}
      <div className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4">
        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-base" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto por nombre o categoría..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-700 focus:outline-none"
            >
              <option value="">Todas las Categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon ? `${cat.icon} ` : ''}
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-700 focus:outline-none"
            >
              <option value="">Todos los Estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo / Oculto</option>
              <option value="out_of_stock">Sin Stock</option>
            </select>
          </div>
        </div>

        {/* TABLA DE PRODUCTOS DE POSTGRESQL */}
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-[8px] border border-dashed border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-[8px] bg-amber-100/60 text-amber-800 flex items-center justify-center mx-auto text-xl">
              🧸
            </div>
            <h3 className="font-headline font-bold text-base text-stone-800">
              No se encontraron productos
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Intenta cambiar los filtros de búsqueda o registra un nuevo producto en el catálogo.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="px-3.5 py-2.5 rounded-l-[6px]">Producto</th>
                  <th className="px-3.5 py-2.5">Categoría</th>
                  <th className="px-3.5 py-2.5">Precio</th>
                  <th className="px-3.5 py-2.5">Stock</th>
                  <th className="px-3.5 py-2.5">Tamaño</th>
                  <th className="px-3.5 py-2.5">Estado</th>
                  <th className="px-3.5 py-2.5 text-right rounded-r-[6px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrls[0] || 'https://placehold.co/100x100?text=Amigurumi'}
                          alt={product.name}
                          className="w-10 h-10 rounded-[6px] object-cover border border-stone-200 shrink-0 bg-stone-100"
                        />
                        <div>
                          <div className="font-bold text-stone-800 line-clamp-1">{product.name}</div>
                          <div className="text-[11px] text-stone-400">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-stone-100 text-stone-700 font-medium">
                        <span>{product.category.icon || '🧶'}</span>
                        <span>{product.category.name}</span>
                      </span>
                    </td>
                    <td className="px-3.5 py-3 font-bold text-stone-800">
                      ${product.price.toFixed(2)}
                      {product.salePrice && (
                        <span className="ml-1 text-[11px] text-rose-600 font-normal line-through">
                          ${product.salePrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-3.5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-[4px] border ${
                          product.stock > 3
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : product.stock > 0
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-stone-600 font-medium">{product.size}</td>
                    <td className="px-3.5 py-3">
                      <button
                        onClick={() => handleToggleActive(product.id, product.isActive)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-[4px] border transition-colors ${
                          product.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
                        }`}
                        title="Haz clic para cambiar visibilidad en la tienda"
                      >
                        {product.isActive ? (
                          <>
                            <MdVisibility className="text-xs text-emerald-600" />
                            <span>Activo</span>
                          </>
                        ) : (
                          <>
                            <MdVisibilityOff className="text-xs text-stone-400" />
                            <span>Oculto</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          disabled={isPending}
                          className="p-1.5 rounded-[6px] text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar producto"
                        >
                          <MdDelete className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
