export interface WhatsAppTemplateDef {
  key: string;
  title: string;
  category: 'cliente' | 'admin';
  location: string;
  description: string;
  defaultText: string;
  supportedVariables: { name: string; label: string; example: string }[];
}

export const WHATSAPP_TEMPLATES_REGISTRY: WhatsAppTemplateDef[] = [
  {
    key: 'wa_tpl_cart_order',
    title: 'Pedido Completo del Carrito',
    category: 'cliente',
    location: 'Carrito de Compras (Bolsa) -> Finalizar Pedido',
    description: 'Mensaje estructurado que se genera al procesar la compra de los productos en el carrito.',
    defaultText: `¡Hola Yamgurumi Studio! 🧶✨ Quisiera realizar el siguiente pedido:

{productos}

💰 Subtotal: \${subtotal}
🏷️ Descuento: -\${descuento}
🚚 Envío: \${envio}
TOTAL A PAGAR: \${total}

📍 Zona de entrega: {zona}
📝 Notas: {notas}

¡Quedo a la espera de sus datos bancarios para confirmar mi pedido! 💖`,
    supportedVariables: [
      { name: '{productos}', label: 'Lista de Productos', example: '• Amigurumi Oso (x1) - $25.00' },
      { name: '{subtotal}', label: 'Subtotal', example: '25.00' },
      { name: '{descuento}', label: 'Descuento', example: '3.00' },
      { name: '{envio}', label: 'Costo de Envío', example: '3.50' },
      { name: '{total}', label: 'Total', example: '25.50' },
      { name: '{zona}', label: 'Zona de Envío', example: 'San Salvador, Col. San Benito' },
      { name: '{notas}', label: 'Notas del Cliente', example: 'Por favor entregar por la mañana' },
    ],
  },
  {
    key: 'wa_tpl_product_buy',
    title: 'Consulta o Compra Directa de Producto en Stock',
    category: 'cliente',
    location: 'Ficha de Producto -> Botón "Comprar por WhatsApp"',
    description: 'Mensaje al consultar o comprar un amigurumi que tiene stock inmediato.',
    defaultText: `¡Hola Yamgurumi! 🧶 Me interesa comprar el amigurumi "{producto}" (\${precio}).

¿Está disponible para envío inmediato? 📦✨`,
    supportedVariables: [
      { name: '{producto}', label: 'Nombre del Producto', example: 'Oso Tejido Mágico' },
      { name: '{precio}', label: 'Precio ($)', example: '25.00' },
      { name: '{dias_elaboracion}', label: 'Días de Elaboración', example: 'Entrega Inmediata ⚡' },
    ],
  },
  {
    key: 'wa_tpl_product_custom',
    title: 'Encargo de Producto Sin Stock (Bajo Encargo)',
    category: 'cliente',
    location: 'Ficha de Producto -> Botón "Encargar por WhatsApp"',
    description: 'Mensaje al solicitar la confección a medida de un amigurumi que no tiene stock inmediato.',
    defaultText: `¡Hola Yamgurumi! 🧶 Me gustaría encargar la elaboración del amigurumi "{producto}" (\${precio}).

Entiendo que toma aproximadamente {dias_elaboracion}. ¿Podemos coordinar el encargo? 🎨✨`,
    supportedVariables: [
      { name: '{producto}', label: 'Nombre del Producto', example: 'Zorro Artesanal' },
      { name: '{precio}', label: 'Precio ($)', example: '28.00' },
      { name: '{dias_elaboracion}', label: 'Días de Elaboración', example: '5-10 días hábiles' },
    ],
  },
  {
    key: 'wa_tpl_hero_custom',
    title: 'Encargo Especial a Medida (Inicio)',
    category: 'cliente',
    location: 'Página Principal (Home) -> Banner Hero "Encargo Especial"',
    description: 'Mensaje enviado desde el botón de la portada principal.',
    defaultText: `¡Hola Yamgurumi! 🧵 Quisiera solicitar un encargo especial a medida.

Me gustaría que me ayuden a crear un amigurumi personalizado con mi propia idea. 🎨`,
    supportedVariables: [],
  },
  {
    key: 'wa_tpl_transformations',
    title: 'Cotización en Amigurumis Personalizados',
    category: 'cliente',
    location: 'Sección "De Foto a Amigurumi" -> Botón "Cotizar mi Propio Diseño"',
    description: 'Mensaje enviado al cotizar la transformación de una foto o dibujo a tejido.',
    defaultText: `¡Hola Yamgurumi! 🧶 Vi la sección de Amigurumis Personalizados en la web y me gustaría cotizar mi propio diseño tejido a mano. 📸✨`,
    supportedVariables: [],
  },
  {
    key: 'wa_tpl_contact_form',
    title: 'Mensaje desde Formulario de Contacto',
    category: 'cliente',
    location: 'Página de Contacto -> Formulario de Mensaje',
    description: 'Mensaje enviado cuando un cliente llena el formulario de contacto.',
    defaultText: `¡Hola Yamgurumi! 🧶 Mi nombre es {nombre} ({email}).

Asunto: {asunto}

Mensaje: {mensaje}`,
    supportedVariables: [
      { name: '{nombre}', label: 'Nombre del Cliente', example: 'María López' },
      { name: '{email}', label: 'Correo Electrónico', example: 'maria@gmail.com' },
      { name: '{asunto}', label: 'Asunto', example: 'Consulta de pedido' },
      { name: '{mensaje}', label: 'Mensaje', example: '¿Hacen envíos a Santa Ana?' },
    ],
  },
  {
    key: 'wa_tpl_contact_direct',
    title: 'Contacto Directo en Página de Contacto',
    category: 'cliente',
    location: 'Página de Contacto -> Botón "WhatsApp Directo"',
    description: 'Mensaje enviado al hacer clic en el botón de WhatsApp directo en la página de contacto.',
    defaultText: `¡Hola Yamgurumi! 🧶 Quisiera solicitar información sobre sus amigurumis hechos a mano y cómo realizar un pedido.`,
    supportedVariables: [],
  },
  {
    key: 'wa_tpl_our_history',
    title: 'Consulta desde Nuestra Historia',
    category: 'cliente',
    location: 'Página "Nuestra Historia" -> Banner Inferior',
    description: 'Mensaje enviado desde la página sobre la historia del taller.',
    defaultText: `¡Hola Yamgurumi! 🧶 Leí su historia y me encantaría hacer un pedido especial tejido a mano con ustedes. ✨`,
    supportedVariables: [],
  },
  {
    key: 'wa_tpl_workshop_status',
    title: 'Consulta de Estado de Pedido (Mi Taller)',
    category: 'cliente',
    location: 'Mi Taller -> Rastreo de Pedido -> "Consultar Estado por WhatsApp"',
    description: 'Mensaje enviado cuando el cliente consulta sobre el avance de su pedido.',
    defaultText: `¡Hola Yamgurumi! 🧶 Quisiera consultar el estado de mi pedido #{pedido_id} a nombre de {nombre} (Total: \${total}). ¡Muchas gracias!`,
    supportedVariables: [
      { name: '{pedido_id}', label: 'ID de Pedido', example: 'ORD-8490' },
      { name: '{nombre}', label: 'Nombre del Cliente', example: 'Carlos Benítez' },
      { name: '{total}', label: 'Total ($)', example: '45.00' },
    ],
  },
  {
    key: 'wa_tpl_admin_order_contact',
    title: 'Administrador ➔ Cliente (Gestión de Pedidos)',
    category: 'admin',
    location: 'Panel Admin -> Pedidos -> Botón "Contactar por WhatsApp"',
    description: 'Mensaje enviado por el administrador para coordinar el pago o entrega de un pedido regular.',
    defaultText: `¡Hola {nombre}! 🧵 Te saludamos de Yamgurumi Studio sobre tu pedido #{pedido_id} por un total de \${total}.

Estado actual: {estado}.

¿Tienes alguna duda o confirmación de pago? Estamos a la orden. ✨`,
    supportedVariables: [
      { name: '{nombre}', label: 'Nombre del Cliente', example: 'Andrea Meléndez' },
      { name: '{pedido_id}', label: 'ID de Pedido', example: 'ORD-8490' },
      { name: '{total}', label: 'Total ($)', example: '45.00' },
      { name: '{estado}', label: 'Estado del Pedido', example: 'Pendiente de Pago' },
    ],
  },
  {
    key: 'wa_tpl_admin_custom_order',
    title: 'Administrador ➔ Cliente (Encargos Personalizados)',
    category: 'admin',
    location: 'Panel Admin -> Encargos -> Botón "Contactar por WhatsApp"',
    description: 'Mensaje enviado por el administrador para definir detalles de un encargo personalizado.',
    defaultText: `¡Hola {nombre}! 🧶 Te saludamos de Yamgurumi Studio para coordinar los detalles de tu encargo personalizado #{encargo_id}.

Detalles: {detalles}

¿Podemos revisar juntos el diseño y los tiempos de elaboración? ✨`,
    supportedVariables: [
      { name: '{nombre}', label: 'Nombre del Cliente', example: 'Sofía Martínez' },
      { name: '{encargo_id}', label: 'ID del Encargo', example: 'ENC-1029' },
      { name: '{detalles}', label: 'Detalles del Encargo', example: 'Gato tejido de 20cm' },
    ],
  },
  {
    key: 'wa_tpl_footer_general',
    title: 'Consulta General del Pie de Página',
    category: 'cliente',
    location: 'Pie de Página Global (Footer) -> Ícono / Botón de WhatsApp',
    description: 'Mensaje predeterminado enviando una consulta general desde el pie de página.',
    defaultText: `¡Hola Yamgurumi! 🧶 Quisiera hacer una consulta sobre la tienda y sus amigurumis.`,
    supportedVariables: [],
  },
];

/**
 * Reemplaza las variables {variable} en el texto de la plantilla por sus valores reales.
 */
export function interpolateWhatsAppTemplate(
  rawText: string,
  variables: Record<string, string | number | undefined | null>
): string {
  let result = rawText;
  for (const [key, val] of Object.entries(variables)) {
    const placeholder = key.startsWith('{') ? key : `{${key}}`;
    const safeVal = val !== undefined && val !== null ? String(val) : '';
    result = result.replaceAll(placeholder, safeVal);
  }
  return result;
}

/**
 * Construye el enlace final a WhatsApp codificado con el teléfono y el mensaje interpolado.
 */
export function buildWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
}
