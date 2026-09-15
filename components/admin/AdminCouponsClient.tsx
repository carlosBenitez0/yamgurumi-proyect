'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  MdConfirmationNumber,
  MdAdd,
  MdSearch,
  MdCheckCircle,
  MdCancel,
  MdDelete,
  MdClose,
  MdContentCopy,
  MdEdit,
  MdPersonAdd,
  MdPerson,
  MdPublic,
  MdLayers,
  MdPeople,
  MdTune,
} from 'react-icons/md';
import { DiscountType } from '@prisma/client';
import {
  createCouponAction,
  updateCouponAction,
  toggleCouponActiveAction,
  deleteCouponAction,
  assignCouponToUserAction,
  searchUsersForAssignmentAction,
} from '@/src/actions/admin/coupons';

interface CouponUser {
  id: string;
  name?: string | null;
  email: string;
}

interface CouponParent {
  id: string;
  code: string;
}

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
  userId?: string | null;
  user?: CouponUser | null;
  parentCouponId?: string | null;
  parentCoupon?: CouponParent | null;
  instances?: CouponData[];
}

export default function AdminCouponsClient({
  initialCoupons,
}: {
  initialCoupons: CouponData[];
}) {
  const [coupons, setCoupons] = useState<CouponData[]>(initialCoupons);
  const [activeTab, setActiveTab] = useState<'TEMPLATES' | 'INSTANCES'>('TEMPLATES');
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal para Crear / Editar Plantilla o Instancia
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponData | null>(null);

  // Modal para Instanciar/Asignar Cupón a Usuario
  const [assigningTemplate, setAssigningTemplate] = useState<CouponData | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<CouponUser[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [selectedUserForAssignment, setSelectedUserForAssignment] = useState<CouponUser | null>(null);

  // Configuración personalizada para la instancia asignada
  const [customUsageLimit, setCustomUsageLimit] = useState<number>(1);
  const [customPercent, setCustomPercent] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<number>(5);
  const [customExpiresAt, setCustomExpiresAt] = useState<string>('');

  // Form State para Crear/Editar
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
  const [percent, setPercent] = useState<number>(15);
  const [amount, setAmount] = useState<number>(5);
  const [minPurchase, setMinPurchase] = useState<string>('');
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Búsqueda en vivo de usuarios para asignación
  useEffect(() => {
    if (!assigningTemplate) return;
    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsSearchingUsers(true);
      try {
        const results = await searchUsersForAssignmentAction(userQuery);
        if (isMounted) {
          setUserSearchResults(results);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsSearchingUsers(false);
      }
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [userQuery, assigningTemplate]);

  // Cupones Plantillas Maestras (Sin userId)
  const masterTemplates = coupons.filter(
    (c) => !c.userId && !c.parentCouponId
  );

  // Cupones Instancias de Usuarios (Con userId o parentCouponId)
  const userInstances = coupons.filter(
    (c) => c.userId || c.parentCouponId
  );

  // Filtrado según la pestaña activa y la búsqueda
  const displayedCoupons = (activeTab === 'TEMPLATES' ? masterTemplates : userInstances).filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const matchesCode = c.code.toLowerCase().includes(q);
    const matchesUser = c.user && (c.user.email.toLowerCase().includes(q) || (c.user.name && c.user.name.toLowerCase().includes(q)));
    return matchesCode || matchesUser;
  });

  const copyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeText);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenEditModal = (coupon: CouponData) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscountType(coupon.discountType);
    setPercent(coupon.percent || 15);
    setAmount(coupon.amount || 5);
    setMinPurchase(coupon.minPurchaseAmount ? String(coupon.minPurchaseAmount) : '');
    setUsageLimit(coupon.usageLimit || 1);
    setExpiresAt(
      coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().split('T')[0]
        : ''
    );
    setSelectedUserId(coupon.userId || '');
    setErrorMsg('');
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleOpenAssignModal = (template: CouponData) => {
    setAssigningTemplate(template);
    setUserQuery('');
    setUserSearchResults([]);
    setSelectedUserForAssignment(null);
    setCustomUsageLimit(template.usageLimit || 1);
    setCustomPercent(template.percent || 10);
    setCustomAmount(template.amount || 5);
    setCustomExpiresAt(
      template.expiresAt
        ? new Date(template.expiresAt).toISOString().split('T')[0]
        : ''
    );
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmitCreateOrEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!code.trim()) {
      setErrorMsg('Ingresa un código promocional válido.');
      return;
    }

    startTransition(async () => {
      try {
        if (editingCoupon) {
          const res = await updateCouponAction({
            id: editingCoupon.id,
            code: code.trim(),
            discountType,
            percent: discountType === 'PERCENTAGE' ? Number(percent) : undefined,
            amount: discountType === 'FIXED_AMOUNT' ? Number(amount) : undefined,
            minPurchaseAmount: minPurchase ? Number(minPurchase) : undefined,
            usageLimit: Number(usageLimit),
            expiresAt: expiresAt || null,
            userId: selectedUserId || null,
          });

          if (res.success && res.coupon) {
            setCoupons((prev) =>
              prev.map((c) => (c.id === editingCoupon.id ? (res.coupon as CouponData) : c))
            );
            setSuccessMsg(`¡Cupón "${res.coupon.code}" actualizado con éxito!`);
            setTimeout(() => {
              setIsModalOpen(false);
              resetForm();
            }, 1200);
          }
        } else {
          const res = await createCouponAction({
            code: code.trim(),
            discountType,
            percent: discountType === 'PERCENTAGE' ? Number(percent) : undefined,
            amount: discountType === 'FIXED_AMOUNT' ? Number(amount) : undefined,
            minPurchaseAmount: minPurchase ? Number(minPurchase) : undefined,
            usageLimit: Number(usageLimit),
            expiresAt: expiresAt || null,
            userId: selectedUserId || null,
          });

          if (res.success && res.coupon) {
            setCoupons((prev) => [res.coupon as CouponData, ...prev]);
            setSuccessMsg(`¡Cupón "${res.coupon.code}" creado con éxito!`);
            setTimeout(() => {
              setIsModalOpen(false);
              resetForm();
            }, 1200);
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error al guardar el cupón.');
      }
    });
  };

  const handleInstantiateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningTemplate || !selectedUserForAssignment) return;

    setErrorMsg('');
    setSuccessMsg('');

    startTransition(async () => {
      try {
        const res = await assignCouponToUserAction(
          assigningTemplate.id,
          selectedUserForAssignment.id,
          {
            percent: assigningTemplate.discountType === 'PERCENTAGE' ? Number(customPercent) : undefined,
            amount: assigningTemplate.discountType === 'FIXED_AMOUNT' ? Number(customAmount) : undefined,
            usageLimit: Number(customUsageLimit),
            expiresAt: customExpiresAt || null,
          }
        );

        if (res.success && res.coupon) {
          setCoupons((prev) => [res.coupon as CouponData, ...prev]);
          setSuccessMsg(
            `¡Cupón "${res.coupon.code}" asignado a ${selectedUserForAssignment.name || selectedUserForAssignment.email} con ${customUsageLimit} uso(s)!`
          );
          setTimeout(() => {
            setAssigningTemplate(null);
            setActiveTab('INSTANCES'); // Cambiar a la pestaña de cupones asignados
          }, 1400);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error al asignar el cupón al usuario.');
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

  const handleDelete = (id: string, codeName: string, isInstance: boolean) => {
    const msg = isInstance
      ? `¿Eliminar la asignación del cupón "${codeName}" para este usuario en particular?`
      : `¿Eliminar el cupón "${codeName}"?`;

    if (!confirm(msg)) return;

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
    setEditingCoupon(null);
    setCode('');
    setDiscountType('PERCENTAGE');
    setPercent(15);
    setAmount(5);
    setMinPurchase('');
    setUsageLimit(100);
    setExpiresAt('');
    setSelectedUserId('');
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
            <span>Gestor de Cupones & Promociones</span>
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl">
            Crea cupones promocionales generales o asigna cupones personalizados a clientes específicos.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[8px] shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
        >
          <MdAdd className="text-base" />
          <span>Crear Cupón</span>
        </button>
      </div>

      {/* TABS DE SELECCIÓN */}
      <div className="flex items-center gap-2 border-b border-stone-200/80 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('TEMPLATES')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-[8px] border-b-2 transition-all cursor-pointer ${
            activeTab === 'TEMPLATES'
              ? 'border-[#72594e] text-[#72594e] bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          <MdLayers className="text-base" />
          <span>Cupones Generales ({masterTemplates.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('INSTANCES')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-[8px] border-b-2 transition-all cursor-pointer ${
            activeTab === 'INSTANCES'
              ? 'border-[#72594e] text-[#72594e] bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          <MdPeople className="text-base" />
          <span>Cupones Asignados a Clientes ({userInstances.length})</span>
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
              placeholder={
                activeTab === 'TEMPLATES'
                  ? 'Buscar cupón por código (ej: BIENVENIDO, VERANO)...'
                  : 'Buscar por código o por correo del cliente asignado...'
              }
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
            />
          </div>
        </div>

        {/* TABLA DE CUPONES */}
        {displayedCoupons.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-[8px] border border-dashed border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-[8px] bg-amber-100/60 text-amber-800 flex items-center justify-center mx-auto text-xl">
              🎟️
            </div>
            <h3 className="font-headline font-bold text-base text-stone-800">
              {activeTab === 'TEMPLATES' ? 'No hay cupones creados' : 'No hay cupones asignados a clientes'}
            </h3>
            <p className="text-xs text-stone-500">
              {activeTab === 'TEMPLATES'
                ? 'Crea tu primer cupón promocional haciendo clic en el botón superior.'
                : 'Selecciona un cupón para asignárselo a un cliente con reglas personalizadas.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="px-3.5 py-2.5 rounded-l-[6px]">Código Promocional</th>
                  <th className="px-3.5 py-2.5">Descuento</th>
                  {activeTab === 'INSTANCES' ? (
                    <th className="px-3.5 py-2.5">Cliente Asignado</th>
                  ) : (
                    <th className="px-3.5 py-2.5">Clientes Asignados</th>
                  )}
                  <th className="px-3.5 py-2.5">Uso / Límite</th>
                  <th className="px-3.5 py-2.5">Estado</th>
                  <th className="px-3.5 py-2.5 text-right rounded-r-[6px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {displayedCoupons.map((coupon) => {
                  const isExpired =
                    coupon.expiresAt && new Date(coupon.expiresAt) < new Date();

                  return (
                    <tr key={coupon.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-3.5 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-[4px] border border-stone-200">
                              {coupon.code}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyCode(coupon.code)}
                              className="p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
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
                          {coupon.parentCoupon && (
                            <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-[4px] border border-amber-200/60 w-fit">
                              Origen: {coupon.parentCoupon.code}
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

                      {activeTab === 'INSTANCES' ? (
                        <td className="px-3.5 py-3">
                          {coupon.user ? (
                            <div className="flex flex-col">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-[4px] border border-amber-200/80 w-fit">
                                <MdPerson className="text-xs text-amber-700" />
                                <span>{coupon.user.name || coupon.user.email}</span>
                              </span>
                              <span className="text-[10px] text-stone-400 truncate max-w-[170px] mt-0.5">
                                {coupon.user.email}
                              </span>
                            </div>
                          ) : (
                            <span className="text-stone-400 text-xs italic">Sin usuario</span>
                          )}
                        </td>
                      ) : (
                        <td className="px-3.5 py-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-[6px] border border-stone-200">
                            <MdPeople className="text-amber-700" />
                            <span>{coupon.instances ? coupon.instances.length : 0} clientes asignados</span>
                          </span>
                        </td>
                      )}

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
                        <div className="flex items-center justify-end gap-1.5">
                          {activeTab === 'TEMPLATES' && (
                            <button
                              type="button"
                              onClick={() => handleOpenAssignModal(coupon)}
                              className="px-2.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-[6px] shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                              title="Generar cupón personalizado para un cliente"
                            >
                              <MdPersonAdd className="text-sm" />
                              <span>Asignar a Cliente</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(coupon)}
                            className="p-1.5 text-[#72594e] hover:bg-amber-50 rounded-[6px] transition-colors cursor-pointer"
                            title={activeTab === 'INSTANCES' ? 'Editar parámetros individuales de este cliente' : 'Editar cupón'}
                          >
                            <MdEdit className="text-base" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                            className={`px-2 py-1 text-[11px] font-semibold rounded-[6px] transition-colors border cursor-pointer ${
                              coupon.isActive
                                ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {coupon.isActive ? 'Pausar' : 'Activar'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(coupon.id, coupon.code, activeTab === 'INSTANCES')}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors cursor-pointer"
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

      {/* MODAL CREAR CUPÓN O EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-[12px] shadow-xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-headline font-bold text-base text-stone-800 flex items-center gap-2">
                <MdConfirmationNumber className="text-[#72594e]" />
                <span>
                  {editingCoupon
                    ? editingCoupon.userId
                      ? `Editar Cupón de ${editingCoupon.user?.name || editingCoupon.user?.email || 'Cliente'}`
                      : 'Editar Cupón'
                    : 'Crear Cupón'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 cursor-pointer"
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

            <form onSubmit={handleSubmitCreateOrEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Código de Descuento (Mayúsculas) *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ej: BIENVENIDO, VERANO2026"
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
                    Límite de Usos para este Cupón *
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
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-1.5 bg-[#72594e] hover:bg-[#60493f] text-white rounded-[6px] text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? 'Guardando...' : editingCoupon ? 'Guardar Cambios' : 'Crear Cupón'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GENERAR E ASIGNAR INSTANCIA A CLIENTE */}
      {assigningTemplate && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-[12px] shadow-xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-headline font-bold text-base text-stone-800 flex items-center gap-2">
                <MdPersonAdd className="text-amber-800 text-lg" />
                <span>Asignar Cupón "{assigningTemplate.code}" a un Cliente</span>
              </h3>
              <button
                type="button"
                onClick={() => setAssigningTemplate(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 cursor-pointer"
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

            <form onSubmit={handleInstantiateSubmit} className="space-y-4">
              {/* Paso 1: Buscar y seleccionar usuario */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  1. Buscar Cliente Registrado *
                </label>
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-base" />
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Escribe el nombre o correo del cliente..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-700"
                  />
                </div>

                {selectedUserForAssignment && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-[6px] text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-900 block">
                        👤 {selectedUserForAssignment.name || 'Cliente'}
                      </span>
                      <span className="text-amber-800 text-[11px]">
                        {selectedUserForAssignment.email}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedUserForAssignment(null)}
                      className="text-xs text-amber-900 font-bold hover:underline"
                    >
                      Cambiar
                    </button>
                  </div>
                )}

                {!selectedUserForAssignment && (
                  <div className="max-h-40 overflow-y-auto space-y-1 border border-stone-200 rounded-[6px] p-2 bg-stone-50/50">
                    {isSearchingUsers ? (
                      <p className="text-xs text-stone-400 text-center py-2">Buscando clientes...</p>
                    ) : userSearchResults.length === 0 ? (
                      <p className="text-xs text-stone-400 text-center py-2">
                        {userQuery ? 'No se encontraron usuarios.' : 'Ingresa datos arriba para buscar.'}
                      </p>
                    ) : (
                      userSearchResults.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => setSelectedUserForAssignment(u)}
                          className="flex items-center justify-between p-2 hover:bg-amber-100/60 rounded-[4px] cursor-pointer transition-colors"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-stone-800 block truncate">
                              {u.name || 'Cliente'}
                            </span>
                            <span className="text-[11px] text-stone-500 block truncate">
                              {u.email}
                            </span>
                          </div>
                          <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                            Seleccionar
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Paso 2: Parámetros personalizados para este cliente en particular */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-[8px] space-y-3">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                  <MdTune className="text-amber-800" />
                  <span>2. Parámetros Personalizados para este Cliente:</span>
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      {assigningTemplate.discountType === 'PERCENTAGE' ? 'Descuento (%)' : 'Descuento ($)'}
                    </label>
                    {assigningTemplate.discountType === 'PERCENTAGE' ? (
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={customPercent}
                        onChange={(e) => setCustomPercent(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-[6px] text-xs font-bold text-stone-800"
                      />
                    ) : (
                      <input
                        type="number"
                        min={1}
                        step={0.5}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-[6px] text-xs font-bold text-stone-800"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Límite de Usos *
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={customUsageLimit}
                      onChange={(e) => setCustomUsageLimit(Number(e.target.value))}
                      placeholder="Ej: 3 para este cliente"
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-[6px] text-xs font-bold text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Expiración Exclusiva (Opcional)
                  </label>
                  <input
                    type="date"
                    value={customExpiresAt}
                    onChange={(e) => setCustomExpiresAt(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-[6px] text-xs text-stone-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setAssigningTemplate(null)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending || !selectedUserForAssignment}
                  className="px-4 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-[6px] text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? 'Asignando...' : 'Asignar Cupón al Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
