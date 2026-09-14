import prisma from '@/src/lib/prisma';
import { WHATSAPP_TEMPLATES_REGISTRY } from './whatsappTemplates';

/**
 * Obtiene todas las plantillas desde la base de datos (StoreSetting), combinadas con los valores por defecto.
 */
export async function getWhatsAppTemplatesMap(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.storeSetting.findMany({
      where: { key: { startsWith: 'wa_tpl_' } },
    });
    const map: Record<string, string> = {};
    for (const def of WHATSAPP_TEMPLATES_REGISTRY) {
      const found = settings.find((s) => s.key === def.key);
      map[def.key] = found ? found.value : def.defaultText;
    }
    return map;
  } catch (err) {
    const fallbackMap: Record<string, string> = {};
    for (const def of WHATSAPP_TEMPLATES_REGISTRY) {
      fallbackMap[def.key] = def.defaultText;
    }
    return fallbackMap;
  }
}
