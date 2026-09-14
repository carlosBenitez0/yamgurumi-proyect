'use client';

import React, { useState, useTransition } from 'react';
import {
  MdSettings,
  MdPhone,
  MdShare,
  MdLocalShipping,
  MdAccountBalance,
  MdCampaign,
  MdSave,
  MdCheckCircle,
  MdStore,
} from 'react-icons/md';
import {
  FaTiktok,
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaWhatsapp,
} from 'react-icons/fa6';
import { updateStoreSettingsAction } from '@/src/actions/admin/settings';

import AdminWhatsAppSettingsClient from './AdminWhatsAppSettingsClient';

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

  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'shipping' | 'payment' | 'banner' | 'whatsapp'>('general');

  // Form State: Identidad y Contacto
  const [storeName, setStoreName] = useState(getSetting('store_name', 'Yamgurumi Studio'));
  const [storeSlogan, setStoreSlogan] = useState(getSetting('store_slogan', 'Amigurumis 100% Tejidos a Mano con Amor 🧵'));
  const [storePhone, setStorePhone] = useState(getSetting('store_phone', '+503 7731 1064'));
  const [storeEmail, setStoreEmail] = useState(getSetting('store_email', 'contacto@yamgurumi.com'));
  const [storeAddress, setStoreAddress] = useState(getSetting('store_address', 'San Salvador, El Salvador 🇸🇻'));

  // Form State: Redes Sociales
  const [tiktokUrl, setTiktokUrl] = useState(getSetting('tiktok_url', 'https://tiktok.com/@yamgurumi'));
  const [facebookUrl, setFacebookUrl] = useState(getSetting('facebook_url', 'https://facebook.com/yamgurumi'));
  const [instagramUrl, setInstagramUrl] = useState(getSetting('instagram_url', 'https://instagram.com/yamgurumi'));
  const [pinterestUrl, setPinterestUrl] = useState(getSetting('pinterest_url', 'https://pinterest.com/yamgurumi'));

  // Form State: Envíos y Logística
  const [shippingRate, setShippingRate] = useState(getSetting('shipping_flat_rate', '3.50'));
  const [shippingNote, setShippingNote] = useState(getSetting('shipping_note', '* La tarifa de envío es estimada ($3.50 base) y puede variar dependiendo del municipio o zona de entrega en El Salvador.'));
  const [freeShippingMin, setFreeShippingMin] = useState(getSetting('free_shipping_threshold', '50.00'));
  const [defaultCraftingDays, setDefaultCraftingDays] = useState(getSetting('default_crafting_days', '5-10 días hábiles'));
  const [minOrderAmount, setMinOrderAmount] = useState(getSetting('min_order_amount', '0.00'));

  // Form State: Pagos y Banco
  const [bankName, setBankName] = useState(getSetting('bank_name', 'Banco Agrícola El Salvador'));
  const [bankAccount, setBankAccount] = useState(getSetting('bank_account', '0030012345678'));
  const [bankOwner, setBankOwner] = useState(getSetting('bank_owner', 'Carlos Benítez (Yamgurumi)'));
  const [bankType, setBankType] = useState(getSetting('bank_type', 'Cuenta de Ahorros'));

  // Form State: Avisos y SEO
  const [topBannerText, setTopBannerText] = useState(getSetting('top_banner_text', '🧵 ¡Todos los muñecos son 100% hechos a mano! Envíos a todo el país 🇸🇻'));
  const [customOrderNote, setCustomOrderNote] = useState(getSetting('custom_order_note', 'Nuestros amigurumis son elaborados punto a punto por artesanas salvadoreñas con insumos 100% hipoalergénicos.'));
  const [metaDescription, setMetaDescription] = useState(getSetting('meta_description', 'Yamgurumi Studio — Tienda de amigurumis y muñecos tejidos a mano 100% en crochet en El Salvador.'));

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
          // Identidad & Contacto
          { key: 'store_name', value: storeName, category: 'general', description: 'Nombre oficial del negocio' },
          { key: 'store_slogan', value: storeSlogan, category: 'general', description: 'Eslogan de la marca' },
          { key: 'store_phone', value: storePhone, category: 'general', description: 'Teléfono WhatsApp Business' },
          { key: 'store_email', value: storeEmail, category: 'general', description: 'Correo oficial de contacto' },
          { key: 'store_address', value: storeAddress, category: 'general', description: 'Dirección o taller físico' },

          // Redes Sociales
          { key: 'tiktok_url', value: tiktokUrl, category: 'social', description: 'Perfil de TikTok' },
          { key: 'facebook_url', value: facebookUrl, category: 'social', description: 'Página de Facebook' },
          { key: 'instagram_url', value: instagramUrl, category: 'social', description: 'Perfil de Instagram' },
          { key: 'pinterest_url', value: pinterestUrl, category: 'social', description: 'Perfil de Pinterest' },

          // Logística & Envíos
          { key: 'shipping_flat_rate', value: shippingRate, category: 'shipping', description: 'Costo base estimado de envío' },
          { key: 'shipping_note', value: shippingNote, category: 'shipping', description: 'Aviso de Tarifa de Envío Variable' },
          { key: 'free_shipping_threshold', value: freeShippingMin, category: 'shipping', description: 'Monto mínimo para envío gratis' },
          { key: 'default_crafting_days', value: defaultCraftingDays, category: 'shipping', description: 'Días de elaboración por defecto' },
          { key: 'min_order_amount', value: minOrderAmount, category: 'shipping', description: 'Monto mínimo de compra' },

          // Pagos & Banco
          { key: 'bank_name', value: bankName, category: 'payment', description: 'Nombre del Banco' },
          { key: 'bank_account', value: bankAccount, category: 'payment', description: 'Número de Cuenta' },
          { key: 'bank_owner', value: bankOwner, category: 'payment', description: 'Titular de la Cuenta' },
          { key: 'bank_type', value: bankType, category: 'payment', description: 'Tipo de Cuenta' },

          // Avisos & SEO
          { key: 'top_banner_text', value: topBannerText, category: 'notification', description: 'Texto del banner superior' },
          { key: 'custom_order_note', value: customOrderNote, category: 'notification', description: 'Nota informativa de encargos' },
          { key: 'meta_description', value: metaDescription, category: 'seo', description: 'Descripción meta para buscadores (SEO)' },
        ];

        const res = await updateStoreSettingsAction(settingsToUpdate);
        if (res.success) {
          setSuccessMsg('¡Configuraciones de la tienda guardadas correctamente!');
          setTimeout(() => setSuccessMsg(''), 3500);
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
            Ajusta teléfonos oficiales, redes sociales (TikTok, Facebook, Instagram), tarifas de envío, datos bancarios y textos globales.
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
          <MdCheckCircle className="text-base text-emerald-700 shrink-0" />
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
            { key: 'general', label: 'Identidad & Contacto', icon: MdStore },
            { key: 'social', label: 'Redes Sociales', icon: MdShare },
            { key: 'shipping', label: 'Envíos & Logística', icon: MdLocalShipping },
            { key: 'payment', label: 'Datos Bancarios', icon: MdAccountBalance },
            { key: 'banner', label: 'Avisos Web & SEO', icon: MdCampaign },
            { key: 'whatsapp', label: 'Mensajes de WhatsApp', icon: FaWhatsapp },
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
        {activeTab === 'whatsapp' ? (
          <AdminWhatsAppSettingsClient initialSettings={initialSettings} />
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
          {/* TAB 1: IDENTIDAD & CONTACTO */}
          {activeTab === 'general' && (
            <div className="space-y-4 max-w-xl animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nombre Oficial de la Tienda *
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Eslogan o Frase de la Marca
                </label>
                <input
                  type="text"
                  value={storeSlogan}
                  onChange={(e) => setStoreSlogan(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Teléfono Oficial de WhatsApp Business *
                </label>
                <input
                  type="text"
                  required
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Número al que se enviarán los mensajes automáticos de compras y consultas.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Correo Electrónico de Contacto *
                </label>
                <input
                  type="email"
                  required
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ubicación del Taller / Dirección Física
                </label>
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  placeholder="Ej: San Salvador, El Salvador 🇸🇻"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>
          )}

          {/* TAB 2: REDES SOCIALES */}
          {activeTab === 'social' && (
            <div className="space-y-4 max-w-xl animate-in fade-in duration-150">
              <p className="text-xs text-stone-500 bg-stone-50 p-3 border border-stone-200/70 rounded-[6px]">
                Configura los enlaces oficiales de las redes sociales de la tienda. Se mostrarán y vincularán automáticamente en el pie de página y en los botones de la web pública.
              </p>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-2">
                  <FaTiktok className="text-stone-900 text-sm shrink-0" />
                  <span>Enlace a TikTok Oficial</span>
                </label>
                <input
                  type="url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://tiktok.com/@yamgurumi"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-2">
                  <FaFacebook className="text-[#1877F2] text-sm shrink-0" />
                  <span>Enlace a Facebook Oficial</span>
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/yamgurumi"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-2">
                  <FaInstagram className="text-[#E4405F] text-sm shrink-0" />
                  <span>Enlace a Instagram Oficial</span>
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/yamgurumi"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-2">
                  <FaPinterest className="text-[#BD081C] text-sm shrink-0" />
                  <span>Enlace a Pinterest Oficial (Opcional)</span>
                </label>
                <input
                  type="url"
                  value={pinterestUrl}
                  onChange={(e) => setPinterestUrl(e.target.value)}
                  placeholder="https://pinterest.com/yamgurumi"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>
          )}

          {/* TAB 3: ENVÍOS & LOGÍSTICA */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-xl animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tarifa Fija de Envío ($ USD) *
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
                    Monto Mínimo Envío Gratis ($ USD)
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tiempo de Confección General por Defecto
                  </label>
                  <input
                    type="text"
                    value={defaultCraftingDays}
                    onChange={(e) => setDefaultCraftingDays(e.target.value)}
                    placeholder="Ej: 5-10 días hábiles"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Compra Mínima en Carrito ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                  <MdLocalShipping className="text-amber-800 text-sm shrink-0" />
                  <span>Aviso / Nota sobre Tarifa de Envío Variable (para la Bolsa de Compras)</span>
                </label>
                <textarea
                  rows={3}
                  value={shippingNote}
                  onChange={(e) => setShippingNote(e.target.value)}
                  placeholder="Ej: * La tarifa de envío es estimada ($3.50 base) y puede variar dependiendo del municipio o zona de entrega en El Salvador."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Este aviso le aclarará al cliente en la Bolsa de Compras al realizar su pedido que la tarifa final de envío es estimada y puede variar según su zona o municipio.
                </p>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-[8px] text-xs text-stone-600 space-y-1">
                <span className="font-bold text-stone-800 block">Zonas de Cobertura Predeterminadas:</span>
                <p>• Todo El Salvador 🇸🇻 — Envíos a nivel nacional coordinados por WhatsApp Business.</p>
              </div>
            </div>
          )}

          {/* TAB 4: PAGOS */}
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

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tipo de Cuenta
                  </label>
                  <input
                    type="text"
                    value={bankType}
                    onChange={(e) => setBankType(e.target.value)}
                    placeholder="Ej: Cuenta de Ahorros"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-semibold focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BANNER & SEO */}
          {activeTab === 'banner' && (
            <div className="space-y-4 max-w-xl animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Texto del Banner Superior (Top Bar)
                </label>
                <textarea
                  rows={2}
                  value={topBannerText}
                  onChange={(e) => setTopBannerText(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700 resize-none"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Este mensaje aparecerá en la franja superior fija de toda la tienda web pública.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nota Informativa para Pedidos Bajo Encargo
                </label>
                <textarea
                  rows={2}
                  value={customOrderNote}
                  onChange={(e) => setCustomOrderNote(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descripción SEO por Defecto (Google & Meta Tags)
                </label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-700 resize-none"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-[8px] text-xs text-amber-900 font-medium space-y-1">
                <span className="font-bold block">👁️ Vista previa del banner superior:</span>
                <div className="p-2 bg-[#72594e] text-white text-center text-xs font-semibold rounded-[4px] shadow-2xs">
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
        )}
      </div>
    </div>
  );
}
