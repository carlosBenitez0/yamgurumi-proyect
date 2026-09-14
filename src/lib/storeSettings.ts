import prisma from '@/src/lib/prisma';

export interface PublicStoreSettings {
  storeName: string;
  storeSlogan: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  facebookUrl: string;
  tiktokUrl: string;
  instagramUrl: string;
  pinterestUrl: string;
  shippingFlatRate: number;
  shippingNote: string;
  freeShippingThreshold: number;
  defaultCraftingDays: string;
  minOrderAmount: number;
  bankName: string;
  bankAccount: string;
  bankOwner: string;
  bankType: string;
  topBannerText: string;
  customOrderNote: string;
  metaDescription: string;
}

export async function getPublicStoreSettings(): Promise<PublicStoreSettings> {
  try {
    const settings = await prisma.storeSetting.findMany();
    const map = new Map(settings.map((s) => [s.key, s.value]));

    return {
      storeName: map.get('store_name') || 'Yamgurumi Studio',
      storeSlogan: map.get('store_slogan') || 'Amigurumis 100% Tejidos a Mano con Amor 🧵',
      storePhone: map.get('store_phone') || '+503 7731 1064',
      storeEmail: map.get('store_email') || 'contacto@yamgurumi.com',
      storeAddress: map.get('store_address') || 'San Salvador, El Salvador 🇸🇻',
      facebookUrl: map.get('facebook_url') || 'https://facebook.com/yamgurumi',
      tiktokUrl: map.get('tiktok_url') || 'https://tiktok.com/@yamgurumi',
      instagramUrl: map.get('instagram_url') || 'https://instagram.com/yamgurumi',
      pinterestUrl: map.get('pinterest_url') || 'https://pinterest.com/yamgurumi',
      shippingFlatRate: Number(map.get('shipping_flat_rate') || '3.50'),
      shippingNote: map.get('shipping_note') || '* La tarifa de envío es estimada ($3.50 base) y puede variar dependiendo del municipio o zona de entrega en El Salvador.',
      freeShippingThreshold: Number(map.get('free_shipping_threshold') || '50.00'),
      defaultCraftingDays: map.get('default_crafting_days') || '5-10 días hábiles',
      minOrderAmount: Number(map.get('min_order_amount') || '0.00'),
      bankName: map.get('bank_name') || 'Banco Agrícola El Salvador',
      bankAccount: map.get('bank_account') || '0030012345678',
      bankOwner: map.get('bank_owner') || 'Carlos Benítez (Yamgurumi)',
      bankType: map.get('bank_type') || 'Cuenta de Ahorros',
      topBannerText: map.get('top_banner_text') || '🧵 ¡Todos los muñecos son 100% hechos a mano! Envíos a todo el país 🇸🇻',
      customOrderNote: map.get('custom_order_note') || 'Nuestros amigurumis son elaborados punto a punto por artesanas salvadoreñas con insumos 100% hipoalergénicos.',
      metaDescription: map.get('meta_description') || 'Yamgurumi Studio — Tienda de amigurumis y muñecos tejidos a mano 100% en crochet en El Salvador.',
    };
  } catch (error) {
    return {
      storeName: 'Yamgurumi Studio',
      storeSlogan: 'Amigurumis 100% Tejidos a Mano con Amor 🧵',
      storePhone: '+503 7731 1064',
      storeEmail: 'contacto@yamgurumi.com',
      storeAddress: 'San Salvador, El Salvador 🇸🇻',
      facebookUrl: 'https://facebook.com/yamgurumi',
      tiktokUrl: 'https://tiktok.com/@yamgurumi',
      instagramUrl: 'https://instagram.com/yamgurumi',
      pinterestUrl: 'https://pinterest.com/yamgurumi',
      shippingFlatRate: 3.50,
      shippingNote: '* La tarifa de envío es estimada ($3.50 base) y puede variar dependiendo del municipio o zona de entrega en El Salvador.',
      freeShippingThreshold: 50.00,
      defaultCraftingDays: '5-10 días hábiles',
      minOrderAmount: 0.00,
      bankName: 'Banco Agrícola El Salvador',
      bankAccount: '0030012345678',
      bankOwner: 'Carlos Benítez (Yamgurumi)',
      bankType: 'Cuenta de Ahorros',
      topBannerText: '🧵 ¡Todos los muñecos son 100% hechos a mano! Envíos a todo el país 🇸🇻',
      customOrderNote: 'Nuestros amigurumis son elaborados punto a punto por artesanas salvadoreñas con insumos 100% hipoalergénicos.',
      metaDescription: 'Yamgurumi Studio — Tienda de amigurumis y muñecos tejidos a mano 100% en crochet en El Salvador.',
    };
  }
}
