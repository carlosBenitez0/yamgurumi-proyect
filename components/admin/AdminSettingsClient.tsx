'use client';

import React, { useState, useTransition } from 'react';
import {
  MdSettings,
  MdPhone,
  MdLocalShipping,
  MdAccountBalance,
  MdCampaign,
  MdSave,
  MdCheckCircle,
} from 'react-icons/md';
import { updateStoreSettingsAction } from '@/src/actions/admin/settings';

interface SettingItem {
  id?: string;
  key: string;
  value: string;
  category?: string;
  description?: string | null;
}

export default function AdminSettingsClient({
  initialSettings,
}: {
  initialSettings: SettingItem[];
}) {
  const getSetting = (key: string, fallback: string = '') => {
    const found = initialSettings.find((s) => s.key === key);
    return found ? found.value : fallback;
  };

  const [activeTab, setActiveTab] = useState<'general' | 'shipping' | 'payment' | 'banner'>('general');

  // Form State
  const [storePhone, setStorePhone] = useState(getSetting('store_phone', '+503 7731 1064'));
  const [storeEmail, setStoreEmail] = useState(getSetting('store_email', 'contacto@yamgurumi.com'));
  const [instagramUrl, setInstagramUrl] = useState(getSetting('instagram_url', 'https://instagram.com/yamgurumi'));
  
  const [shippingRate, setShippingRate] = useState(getSetting('shipping_flat_rate', '3.50'));
  const [freeShippingMin, setFreeShippingMin] = useState(getSetting('free_shipping_threshold', '50.00'));

  const [bankName, setBankName] = useState(getSetting('bank_name', 'Banco Agrícola El Salvador'));
  const [bankAccount, setBankAccount] = useState(getSetting('bank_account', '0030012345678'));
  const [bankOwner, setBankOwner] = useState(getSetting('bank_owner', 'Carlos Benítez (Yamgurumi)'));

  const [topBannerText, setTopBannerText] = useState(getSetting('top_banner_text', '🧵 ¡Todos los muñecos son 100% hechos a mano! Envíos a todo el país 🇸🇻'));

  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    startTransition(async () => {
      try {
        const settingsToUpdate = [
          { key: 'store_phone', value: storePhone, category: 'general', description: 'Teléfono WhatsApp Business' },
          { key: 'store_email', value: storeEmail, category: 'general', description: 'Correo oficial de contacto' },
          { key: 'instagram_url', value: instagramUrl, category: 'general', description: 'Perfil de Instagram' },
          { key: 'shipping_flat_rate', value: shippingRate, category: 'shipping', description: 'Costo fijo de envío' },
          { key: 'free_shipping_threshold', value: freeShippingMin, category: 'shipping', description: 'Monto mínimo para envío gratis' },
          { key: 'bank_name', value: bankName, category: 'payment', description: 'Nombre del Banco' },
          { key: 'bank_account', value: bankAccount, category: 'payment', description: 'Número de Cuenta' },
          { key: 'bank_owner', value: bankOwner, category: 'payment', description: 'Titular de la Cuenta' },
          { key: 'top_banner_text', value: topBannerText, category: 'notification', description: 'Texto del banner superior' },
        ];

        const res = await updateStoreSettingsAction(settingsToUpdate);
        if (res.success) {
          setSuccessMsg('¡Configuraciones guardadas correctamente en la tienda!');
          setTimeout(() => setSuccessMsg(''), 3000);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error al guardar configuraciones');
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/90 p-6 rounded-[12px] shadow-xs">
        <div className="space-y-1">
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
            <MdSettings className="text-[#72594e]" />
            <span>Configuraciones Generales de la Tienda</span>
          </h2>
          <p className="text-xs text-stone-500">
            Ajusta teléfonos oficiales, tarifas de envío, datos bancarios para transferencias y avisos de la web.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[8px] shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors disabled:opacity-50"
        >
          <MdSave className="text-base" />
          <span>{isPending ? 'Guardando...' : 'Guardar Todo'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[8px] text-emerald-900 text-xs font-bold flex items-center gap-2">
          <MdCheckCircle className="text-base text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-[8px] text-rose-900 text-xs font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* CONTENEDOR CON TABS Y FORMULARIO */}
      <div className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-6">
        {/* TABS */}
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3 overflow-x-auto">
          {[
            { key: 'general', label: 'Contacto & WhatsApp', icon: MdPhone },
            { key: 'shipping', label: 'Envíos & Tarifas', icon: MdLocalShipping },
            { key: 'payment', label: 'Datos Bancarios', icon: MdAccountBalance },
            { key: 'banner', label: 'Barra de Anuncios Web', icon: MdCampaign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3.5 py-2 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#72594e] text-white shadow-2xs'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon className="text-sm" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENIDO DE PESTAÑAS */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-4 max-w-xl animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Teléfono Oficial de WhatsApp Business *
                </label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Este es el número al que se redirigirán los pedidos del carrito y las consultas de los clientes.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Correo Electrónico de Contacto *
                </label>
                <input
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Enlace a Instagram Oficial
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ENVÍOS */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-xl animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tarifa Fija de Envío ($) *
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={shippingRate}
                    onChange={(e) => setShippingRate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Monto Mínimo para Envío Gratis ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={freeShippingMin}
                    onChange={(e) => setFreeShippingMin(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-[8px] text-xs text-stone-600 space-y-1">
                <span className="font-bold text-stone-800 block">Zonas de Cobertura Predeterminadas:</span>
                <p>• San Salvador, Santa Tecla, Antiguo Cuscatlán, San Miguel, Santa Ana, Sonsonate y municipios aledaños en El Salvador 🇸🇻.</p>
              </div>
            </div>
          )}

          {/* TAB 3: PAGOS */}
          {activeTab === 'payment' && (
            <div className="space-y-4 max-w-xl animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nombre del Banco *
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-semibold focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Número de Cuenta Bancaria / IBAN / CBU *
                </label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-mono font-bold focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Titular de la Cuenta *
                </label>
                <input
                  type="text"
                  value={bankOwner}
                  onChange={(e) => setBankOwner(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>
          )}

          {/* TAB 4: BANNER */}
          {activeTab === 'banner' && (
            <div className="space-y-4 max-w-xl animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Texto del Banner de Anuncio Superior (Top Bar)
                </label>
                <textarea
                  rows={3}
                  value={topBannerText}
                  onChange={(e) => setTopBannerText(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700 resize-none"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Este mensaje aparecerá en la franja superior de toda la tienda web pública.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-[8px] text-xs text-amber-900 font-medium">
                👁️ <strong>Vista previa del banner:</strong>
                <div className="mt-2 p-2 bg-[#72594e] text-white text-center text-xs font-semibold rounded-[4px] shadow-2xs">
                  {topBannerText}
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-[#72594e] hover:bg-[#60493f] text-white font-semibold text-xs rounded-[8px] shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <MdSave className="text-base" />
              <span>{isPending ? 'Guardando Cambios...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
