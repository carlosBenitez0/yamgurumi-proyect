'use client';

import React, { useState, useTransition } from 'react';
import {
  MdChat,
  MdSave,
  MdCheckCircle,
  MdRefresh,
  MdSearch,
  MdInfoOutline,
  MdSend,
  MdPhone,
  MdVideocam,
  MdMoreVert,
  MdDoneAll,
} from 'react-icons/md';
import {
  WHATSAPP_TEMPLATES_REGISTRY,
  WhatsAppTemplateDef,
  interpolateWhatsAppTemplate,
} from '@/src/lib/whatsappTemplates';
import { updateStoreSettingsAction } from '@/src/actions/admin/settings';

interface SettingItem {
  id?: string;
  key: string;
  value: string;
  category?: string;
  description?: string | null;
}

/* ── Formateador de Sintaxis de WhatsApp (*bold*, _italic_, ~strike~) ── */
function parseWhatsAppLine(lineText: string) {
  const regex = /(\*[^*]+\*|_[^_]+_|~[^~]+~)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(lineText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(lineText.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <strong key={match.index} className="font-extrabold text-stone-950">
          {token.slice(1, -1)}
        </strong>
      );
    } else if (token.startsWith('_') && token.endsWith('_')) {
      parts.push(
        <em key={match.index} className="italic text-stone-900">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('~') && token.endsWith('~')) {
      parts.push(
        <del key={match.index} className="line-through text-stone-500">
          {token.slice(1, -1)}
        </del>
      );
    } else {
      parts.push(token);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < lineText.length) {
    parts.push(lineText.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [lineText];
}

function renderWhatsAppFormattedText(text: string) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => (
    <React.Fragment key={idx}>
      {idx > 0 && <br />}
      {parseWhatsAppLine(line)}
    </React.Fragment>
  ));
}

/* ── Componente de Vista Previa Estilo WhatsApp Web ── */
interface WhatsAppChatPreviewProps {
  category: 'cliente' | 'admin';
  title: string;
  previewText: string;
}

function WhatsAppChatPreview({ category, title, previewText }: WhatsAppChatPreviewProps) {
  const isClientMsg = category === 'cliente';
  const chatName = isClientMsg ? 'Yamgurumi Studio 🧵' : 'Cliente (Ejemplo)';
  const avatarText = isClientMsg ? '🧶' : '👤';
  const avatarBg = isClientMsg ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900';

  return (
    <div className="rounded-[16px] border border-stone-300/80 bg-[#efeae2] shadow-sm overflow-hidden flex flex-col h-full min-h-[380px]">
      {/* CABECERA ESTILO WHATSAPP WEB */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center font-bold text-base shadow-xs shrink-0`}>
            {avatarText}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-xs text-white leading-tight truncate">
              {chatName}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-100/90 font-medium">en línea</span>
            </div>
          </div>
        </div>

        {/* ÍCONOS DE ACCIÓN */}
        <div className="flex items-center gap-3 text-emerald-100/80 text-sm">
          <MdPhone className="hover:text-white cursor-pointer transition-colors" />
          <MdVideocam className="hover:text-white cursor-pointer transition-colors" />
          <MdMoreVert className="hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>

      {/* ÁREA DE CHAT CON WALLPAPER Y FECHA */}
      <div className="p-4 flex-1 flex flex-col justify-between relative bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:12px_12px]">
        {/* INSIGNIA CENTRAL DE FECHA */}
        <div className="flex justify-center mb-3">
          <span className="px-3 py-0.5 bg-white/90 backdrop-blur-xs text-stone-600 text-[10px] font-bold rounded-md shadow-2xs border border-stone-200/60 uppercase tracking-wider">
            HOY
          </span>
        </div>

        {/* CONTENEDOR DE BURBUJA DE CHAT VERDE */}
        <div className="flex justify-end my-auto pl-4">
          <div className="relative bg-[#d9fdd3] text-stone-900 rounded-2xl rounded-tr-none px-4 py-3 shadow-[0_1px_1px_rgba(11,20,26,0.14)] border border-[#b8f5a8] max-w-full">
            {/* TAIL SVG DE BURBUJA */}
            <svg
              className="absolute -right-2 top-0 text-[#d9fdd3] fill-current"
              width="9"
              height="14"
              viewBox="0 0 9 14"
            >
              <path d="M0 0v14l9-14H0z" />
            </svg>

            {/* TEXTO FORMATEADO DINÁMICO */}
            <div className="text-xs text-[#111b21] font-sans leading-[1.48] whitespace-pre-wrap break-words">
              {renderWhatsAppFormattedText(previewText)}
            </div>

            {/* HORA Y LEÍDO (DOBLE CHECK AZUL) */}
            <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-stone-500 font-medium">
              <span>12:00 PM</span>
              <MdDoneAll className="text-[#53bdeb] text-sm" />
            </div>
          </div>
        </div>

        {/* MOCKUP BARRA DE MENSAJE ABAJO */}
        <div className="mt-4 pt-2 border-t border-stone-300/40 flex items-center gap-2 bg-white/80 backdrop-blur-xs rounded-full px-3 py-1.5 shadow-2xs border border-stone-200/50">
          <span className="text-stone-400 text-sm select-none">😊</span>
          <span className="text-stone-400 text-[11px] flex-1 truncate font-sans">Escribe un mensaje...</span>
          <span className="w-6 h-6 rounded-full bg-[#075e54] text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
            <MdSend className="text-[10px]" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdminWhatsAppSettingsClient({
  initialSettings,
}: {
  initialSettings: SettingItem[];
}) {
  // Map of stored template keys to custom texts
  const [templateTexts, setTemplateTexts] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const def of WHATSAPP_TEMPLATES_REGISTRY) {
      const found = initialSettings.find((s) => s.key === def.key);
      map[def.key] = found ? found.value : def.defaultText;
    }
    return map;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cliente' | 'admin'>('all');

  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleTextChange = (key: string, newText: string) => {
    setTemplateTexts((prev) => ({ ...prev, [key]: newText }));
  };

  const handleInsertVariable = (key: string, variableName: string) => {
    setTemplateTexts((prev) => {
      const current = prev[key] || '';
      return { ...prev, [key]: `${current} ${variableName}` };
    });
  };

  const handleResetToDefault = (def: WhatsAppTemplateDef) => {
    setTemplateTexts((prev) => ({ ...prev, [def.key]: def.defaultText }));
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    startTransition(async () => {
      try {
        const settingsToUpdate = WHATSAPP_TEMPLATES_REGISTRY.map((def) => ({
          key: def.key,
          value: templateTexts[def.key] || def.defaultText,
          category: 'whatsapp',
          description: def.title,
        }));

        const res = await updateStoreSettingsAction(settingsToUpdate);
        if (res.success) {
          setSuccessMsg('¡Todas las plantillas de WhatsApp se guardaron e integraron correctamente en la tienda!');
          setTimeout(() => setSuccessMsg(''), 4000);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error al guardar plantillas de WhatsApp');
      }
    });
  };

  const filteredTemplates = WHATSAPP_TEMPLATES_REGISTRY.filter((def) => {
    const matchesCategory = selectedCategory === 'all' || def.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      def.title.toLowerCase().includes(q) ||
      def.location.toLowerCase().includes(q) ||
      def.description.toLowerCase().includes(q) ||
      (templateTexts[def.key] || '').toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER & CONTROLES PRINCIPALES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/90 p-6 rounded-[12px] shadow-xs">
        <div className="space-y-1">
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
            <MdChat className="text-[#25D366]" />
            <span>Gestión Centralizada de Mensajes de WhatsApp</span>
          </h2>
          <p className="text-xs text-stone-500">
            Modifica las 12 plantillas predeterminadas de WhatsApp utilizadas en botones de compra, formulario de contacto y panel de control.
          </p>
        </div>

        <button
          onClick={() => handleSaveAll()}
          disabled={isPending}
          className="px-5 py-2.5 bg-[#25D366] hover:bg-[#1faa52] text-white font-bold text-xs rounded-[8px] shadow-xs flex items-center gap-2 self-start sm:self-auto transition-colors disabled:opacity-50 cursor-pointer"
        >
          <MdSave className="text-base" />
          <span>{isPending ? 'Guardando Cambios...' : 'Guardar Mensajes'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[8px] text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-1">
          <MdCheckCircle className="text-base text-emerald-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-[8px] text-rose-900 text-xs font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="bg-white border border-stone-200/90 rounded-[12px] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* BUSCADOR */}
        <div className="relative w-full sm:w-80">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-base" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por botón o mensaje..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-[6px] text-xs text-stone-800 focus:outline-none focus:border-amber-700"
          />
        </div>

        {/* FILTROS POR CATEGORÍA */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'Todos (12)' },
            { id: 'cliente', label: 'Cliente ➔ Tienda (9)' },
            { id: 'admin', label: 'Admin ➔ Cliente (3)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#72594e] text-white shadow-2xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* TARJETAS DE PLANTILLAS */}
      <div className="space-y-6">
        {filteredTemplates.map((def) => {
          const currentText = templateTexts[def.key] ?? def.defaultText;
          const isModified = currentText !== def.defaultText;

          // Generar variables de ejemplo para la simulación
          const sampleVars: Record<string, string> = {};
          def.supportedVariables.forEach((v) => {
            sampleVars[v.name] = v.example;
          });
          const previewText = interpolateWhatsAppTemplate(currentText, sampleVars);

          return (
            <div
              key={def.key}
              className="bg-white border border-stone-200/90 rounded-[12px] p-6 shadow-xs space-y-4 relative"
            >
              {/* ENCABEZADO DE PLANTILLA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-headline font-bold text-sm text-stone-800">
                      {def.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        def.category === 'cliente'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {def.category === 'cliente' ? 'Cliente ➔ Tienda' : 'Admin ➔ Cliente'}
                    </span>
                    {isModified && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-bold">
                        Personalizado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MdInfoOutline className="text-stone-400 shrink-0" />
                    <span>Ubicación en la web: <strong className="text-stone-700">{def.location}</strong></span>
                  </p>
                </div>

                {isModified && (
                  <button
                    type="button"
                    onClick={() => handleResetToDefault(def)}
                    className="text-stone-500 hover:text-stone-800 text-xs font-semibold flex items-center gap-1 self-start sm:self-auto transition-colors cursor-pointer"
                    title="Restablecer plantilla a su versión original"
                  >
                    <MdRefresh className="text-sm text-amber-700" />
                    <span>Restablecer Original</span>
                  </button>
                )}
              </div>

              {/* EDITOR Y VISTA PREVIA LADO A LADO */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* COLUMNA IZQUIERDA: EDITOR */}
                <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-3">
                  <div className="flex-1 flex flex-col space-y-3 min-h-0">
                    <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider shrink-0">
                      Plantilla del Mensaje de WhatsApp
                    </label>

                    {/* FICHAS DE VARIABLES DINÁMICAS */}
                    {def.supportedVariables.length > 0 ? (
                      <div className="space-y-1.5 shrink-0">
                        <span className="text-[11px] text-stone-500 font-medium block">
                          Haz clic en una variable para insertarla en el mensaje:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {def.supportedVariables.map((v) => (
                            <button
                              key={v.name}
                              type="button"
                              onClick={() => handleInsertVariable(def.key, v.name)}
                              className="px-2.5 py-1 bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/80 text-amber-900 rounded-md font-mono text-[11px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-2xs"
                              title={`Insertar ${v.label} (Ejemplo: ${v.example})`}
                            >
                              + {v.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-stone-400 italic shrink-0">
                        Esta plantilla es un mensaje directo fijo. No requiere variables dinámicas.
                      </p>
                    )}

                    <textarea
                      value={currentText}
                      onChange={(e) => handleTextChange(def.key, e.target.value)}
                      className="w-full flex-1 min-h-[180px] p-3.5 bg-stone-50/80 border border-stone-200 rounded-[10px] text-xs text-stone-800 font-mono leading-relaxed focus:outline-none focus:border-amber-700 focus:bg-white transition-all resize-y"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 shrink-0">
                    <span>{currentText.length} caracteres</span>
                    <span>{currentText.split('\n').length} líneas</span>
                  </div>
                </div>

                {/* COLUMNA DERECHA: VISTA PREVIA ESTILO WHATSAPP WEB */}
                <div className="lg:col-span-6">
                  <WhatsAppChatPreview
                    category={def.category}
                    title={def.title}
                    previewText={previewText}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTÓN INFERIOR DE GUARDADO GLOBAL */}
      <div className="p-4 bg-white border border-stone-200/90 rounded-[12px] shadow-xs flex items-center justify-between">
        <p className="text-xs text-stone-500 font-medium">
          Al guardar, todas las pantallas de la tienda web actualizarán inmediatamente sus enlaces a WhatsApp.
        </p>
        <button
          onClick={() => handleSaveAll()}
          disabled={isPending}
          className="px-6 py-2.5 bg-[#25D366] hover:bg-[#1faa52] text-white font-bold text-xs rounded-[8px] shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <MdSave className="text-base" />
          <span>{isPending ? 'Guardando Cambios...' : 'Guardar Todo'}</span>
        </button>
      </div>
    </div>
  );
}
