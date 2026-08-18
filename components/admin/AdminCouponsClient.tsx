'use client';

import React, { useState, useTransition } from 'react';
import {
  MdConfirmationNumber,
  MdAdd,
  MdSearch,
  MdCheckCircle,
  MdCancel,
  MdDelete,
  MdClose,
  MdContentCopy,
} from 'react-icons/md';
import { DiscountType } from '@prisma/client';
import {
  createCouponAction,
  toggleCouponActiveAction,
  deleteCouponAction,
} from '@/src/actions/admin/coupons';

interface CouponData {
  id: string;
  code: string;
  discountType: DiscountType;
  percent: number;
  amount?: number | null;
  minPurchaseAmount?: number | null;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: Date | string | null;
  createdAt: Date | string;
}

export default function AdminCouponsClient({
  initialCoupons,
}: {
  initialCoupons: CouponData[];
}) {
  const [coupons, setCoupons] = useState<CouponData[]>(initialCoupons);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
  const [percent, setPercent] = useState<number>(15);
  const [amount, setAmount] = useState<number>(5);
  const [minPurchase, setMinPurchase] = useState<string>('');
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [expiresAt, setExpiresAt] = useState<string>('');

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtrado
  const filteredCoupons = coupons.filter((c) => {
    const q = search.toLowerCase().trim();
    return !q || c.code.toLowerCase().includes(q);
  });

  const copyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeText);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!code.trim()) {
      setErrorMsg('Ingresa un código promocional válido.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await createCouponAction({
          code: code.trim(),
          discountType,
          percent: discountType === 'PERCENTAGE' ? Number(percent) : undefined,
          amount: discountType === 'FIXED_AMOUNT' ? Number(amount) : undefined,
          minPurchaseAmount: minPurchase ? Number(minPurchase) : undefined,
          usageLimit: Number(usageLimit),
          expiresAt: expiresAt || null,
        });

        if (res.success && res.coupon) {
          const newCoupon: CouponData = {
            ...res.coupon,
            amount: res.coupon.amount ? Number(res.coupon.amount) : null,
            minPurchaseAmount: res.coupon.minPurchaseAmount ? Number(res.coupon.minPurchaseAmount) : null,
          };

          setCoupons((prev) => [newCoupon, ...prev]);
          setSuccessMsg(`¡Cupón "${res.coupon.code}" creado con éxito!`);
          setTimeout(() => {
            setIsModalOpen(false);
            resetForm();
          }, 1200);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error al crear el cupón');
      }
    });
  };

  const handleToggleActive = (id: string, currentActive: boolean) => {
    startTransition(async () => {
      try {
        const res = await toggleCouponActiveAction(id, !currentActive);
        if (res.success) {
          setCoupons((prev) =>
            prev.map((c) => (c.id === id ? { ...c, isActive: res.isActive } : c))
          );
        }
      } catch (err: any) {
        alert(err.message || 'Error al cambiar estado del cupón');
      }
    });
  };

  const handleDelete = (id: string, codeName: string) => {
    if (!confirm(`¿Eliminar el cupón promocional "${codeName}"?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteCouponAction(id);
        if (res.success) {
          setCoupons((prev) => prev.filter((c) => c.id !== id));
        }
      } catch (err: any) {
        alert(err.message || 'Error al eliminar el cupón');
      }
    });
  };

  const resetForm = () => {
    setCode('');
    setDiscountType('PERCENTAGE');
    setPercent(15);
    setAmount(5);
    setMinPurchase('');
    setUsageLimit(100);
    setExpiresAt('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/90 p-6 rounded-[12px] shadow-xs">
        <div className="space-y-1">
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
            <MdConfirmationNumber className="text-[#72594e]" />
            <span>Cupones & Promociones ({filteredCoupons.length})</span>
          </h2>
          <p className="text-xs text-stone-500">
            Crea códigos de descuento en porcentaje o monto fijo para incentivar las ventas en tu tienda.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[8px] shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <MdAdd className="text-base" />
          <span>Crear Nuevo Cupón</span>
        </button>
      </div>

      {/* CONTENEDOR CON BÚSQUEDA Y TABLA */}
      <div className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4">
        {/* BÚSQUEDA */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-base" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cupón por código (ej: YAM10, BIENVENIDO)..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
            />
          </div>
        </div>

        {/* TABLA DE CUPONES */}
        {filteredCoupons.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-[8px] border border-dashed border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-[8px] bg-amber-100/60 text-amber-800 flex items-center justify-center mx-auto text-xl">
              🎟️
            </div>
            <h3 className="font-headline font-bold text-base text-stone-800">
              No hay cupones creados
            </h3>
            <p className="text-xs text-stone-500">
              Crea tu primer código promocional haciendo clic en el botón superior.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="px-3.5 py-2.5 rounded-l-[6px]">Código Promocional</th>
                  <th className="px-3.5 py-2.5">Descuento</th>
                  <th className="px-3.5 py-2.5">Uso / Límite</th>
                  <th className="px-3.5 py-2.5">Estado</th>
                  <th className="px-3.5 py-2.5 text-right rounded-r-[6px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCoupons.map((coupon) => {
                  const isExpired =
                    coupon.expiresAt && new Date(coupon.expiresAt) < new Date();

                  return (
                    <tr key={coupon.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-[4px] border border-stone-200">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyCode(coupon.code)}
                            className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                            title="Copiar código"
                          >
                            <MdContentCopy className="text-sm" />
                          </button>
                          {copiedCode === coupon.code && (
                            <span className="text-[10px] text-emerald-700 font-bold">
                              ¡Copiado!
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-3.5 py-3 font-bold text-stone-800">
                        {coupon.discountType === 'PERCENTAGE' ? (
                          <span className="text-amber-900 bg-amber-50 px-2 py-0.5 rounded-[4px] border border-amber-200/80">
                            {coupon.percent}% OFF
                          </span>
                        ) : (
                          <span className="text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-[4px] border border-emerald-200/80">
                            ${coupon.amount?.toFixed(2)} OFF
                          </span>
                        )}
                        {coupon.minPurchaseAmount && (
                          <div className="text-[10px] text-stone-400 font-normal mt-0.5">
                            Min. compra: ${coupon.minPurchaseAmount.toFixed(2)}
                          </div>
                        )}
                      </td>

                      <td className="px-3.5 py-3 font-semibold text-stone-700">
                        {coupon.usedCount} / {coupon.usageLimit} usos
                      </td>

                      <td className="px-3.5 py-3">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 rounded-[4px]">
                            <MdCancel className="text-xs shrink-0" />
                            <span>VENCIDO</span>
                          </span>
                        ) : coupon.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-[4px]">
                            <MdCheckCircle className="text-xs shrink-0 text-emerald-700" />
                            <span>ACTIVO</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200 rounded-[4px]">
                            <span>PAUSADO</span>
                          </span>
                        )}
                      </td>

                      <td className="px-3.5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-[6px] transition-colors border ${
                              coupon.isActive
                                ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {coupon.isActive ? 'Pausar' : 'Activar'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(coupon.id, coupon.code)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors"
                            title="Eliminar cupón"
                          >
                            <MdDelete className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CREAR CUPÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-[12px] shadow-xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-headline font-bold text-base text-stone-800 flex items-center gap-2">
                <MdConfirmationNumber className="text-[#72594e]" />
                <span>Crear Código Promocional</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100"
              >
                <MdClose className="text-lg" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-[6px] text-rose-800 text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[6px] text-emerald-800 text-xs font-semibold">
                ✅ {successMsg}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Código de Descuento (Mayúsculas) *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ej: YAMGURUMI10, NAVIDAD2026"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700 font-mono font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tipo de Descuento *
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700 font-semibold"
                  >
                    <option value="PERCENTAGE">% Porcentaje</option>
                    <option value="FIXED_AMOUNT">$ Monto Fijo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {discountType === 'PERCENTAGE' ? 'Porcentaje (%) *' : 'Monto Fijo ($) *'}
                  </label>
                  {discountType === 'PERCENTAGE' ? (
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={percent}
                      onChange={(e) => setPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700 font-bold"
                    />
                  ) : (
                    <input
                      type="number"
                      min={1}
                      step={0.5}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700 font-bold"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Compra Mínima ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Sin mínimo"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Límite de Usos *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Fecha de Expiración (Opcional)
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-[6px] text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-1.5 bg-[#72594e] hover:bg-[#60493f] text-white rounded-[6px] text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Guardando...' : 'Crear Cupón'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
