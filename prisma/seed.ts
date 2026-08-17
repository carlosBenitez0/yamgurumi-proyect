import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { categories as mockCategories, products as mockProducts } from '../data/products';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function main() {
  console.log('🌱 Iniciando sembrado de base de datos Yamgurumi...');

  const defaultPassword = 'Contrasena123!';
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  // 1. Usuarios (Admin y Clientes)
  const usersData = [
    {
      email: 'admin@yamgurumi.com',
      name: 'Carlos Benítez (Admin)',
      role: 'ADMIN' as const,
      passwordHash,
      emailVerified: new Date(),
    },
    {
      email: 'cb2724136@gmail.com',
      name: 'Carlos Benítez',
      role: 'ADMIN' as const,
      passwordHash,
      emailVerified: new Date(),
    },
    {
      email: 'carlos@yamgurumi.com',
      name: 'Carlos Benítez Cliente',
      role: 'CUSTOMER' as const,
      passwordHash,
      emailVerified: new Date(),
    },
    {
      email: 'maria.artesana@yamgurumi.com',
      name: 'María Gutiérrez',
      role: 'CUSTOMER' as const,
      passwordHash,
      emailVerified: new Date(),
    },
    {
      email: 'cliente@yamgurumi.com',
      name: 'Cliente Yamgurumi',
      role: 'CUSTOMER' as const,
      passwordHash,
      emailVerified: new Date(),
    },
  ];

  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        passwordHash: u.passwordHash,
        role: u.role,
        name: u.name,
      },
      create: u,
    });
    console.log(`👤 Usuario registrado/actualizado: ${user.email} (${user.role}) - Contraseña: ${defaultPassword}`);

    // Crear dirección de envío por defecto si no tiene
    const addressCount = await prisma.address.count({ where: { userId: user.id } });
    if (addressCount === 0) {
      await prisma.address.create({
        data: {
          userId: user.id,
          name: `${user.name || 'Cliente'} - Casa`,
          phone: '+503 7731-1064',
          zone: 'San Salvador, El Salvador 🇸🇻',
          notes: 'Residencial Escalón, Avenida Masferrer Norte #123, San Salvador.',
          isDefault: true,
        },
      });
    }
  }

  // 2. Cupones de Descuento
  const discountCodes = [
    { code: 'YAM10', percent: 10, usageLimit: 100 },
    { code: 'BIENVENIDO20', percent: 20, usageLimit: 50 },
    { code: 'CRAFT15', percent: 15, usageLimit: 200 },
  ];

  for (const d of discountCodes) {
    await prisma.discountCode.upsert({
      where: { code: d.code },
      update: { percent: d.percent, usageLimit: d.usageLimit },
      create: {
        code: d.code,
        percent: d.percent,
        usageLimit: d.usageLimit,
      },
    });
    console.log(`🎟️ Cupón de descuento disponible: ${d.code} (${d.percent}% OFF)`);
  }

  // 3. Categorías
  const categoryMap = new Map<string, string>();
  for (let i = 0; i < mockCategories.length; i++) {
    const cat = mockCategories[i];
    const catSlug = slugify(cat.name);
    const createdCategory = await prisma.category.upsert({
      where: { slug: catSlug },
      update: {
        name: cat.name,
        icon: cat.icon,
        sortOrder: i + 1,
      },
      create: {
        name: cat.name,
        slug: catSlug,
        icon: cat.icon,
        description: `Colección de ${cat.name} tejidos 100% a mano en crochet hipoalergénico.`,
        sortOrder: i + 1,
        isActive: true,
      },
    });
    categoryMap.set(cat.name, createdCategory.id);
    console.log(`🏷️ Categoría sembrada: ${createdCategory.name} (${createdCategory.icon})`);
  }

  // 4. Productos
  for (const p of mockProducts) {
    const categoryId = categoryMap.get(p.category);
    if (!categoryId) continue;

    const prodSlug = p.slug || slugify(p.name);
    await prisma.product.upsert({
      where: { slug: prodSlug },
      update: {
        name: p.name,
        price: p.price,
        categoryId: categoryId,
        size: p.size,
        description: p.description,
        materials: p.materials,
        tags: p.tags,
        imageUrls: [p.imageUrl],
        rating: p.rating,
        reviewsCount: p.reviews,
      },
      create: {
        id: p.id,
        name: p.name,
        slug: prodSlug,
        price: p.price,
        stock: Math.floor(Math.random() * 15) + 3,
        categoryId: categoryId,
        size: p.size,
        description: p.description,
        materials: p.materials,
        tags: p.tags,
        imageUrls: [p.imageUrl],
        isFeatured: Math.random() > 0.6,
        isActive: true,
        rating: p.rating,
        reviewsCount: p.reviews,
      },
    });
  }
  console.log(`🧸 Total de productos sembrados en PostgreSQL: ${mockProducts.length}`);

  // 5. Ajustes de la tienda (StoreSetting)
  const defaultSettings = [
    { key: 'store_phone', value: '+503 7731-1064', category: 'general', description: 'Teléfono oficial de WhatsApp Business' },
    { key: 'shipping_flat_rate', value: '3.50', category: 'shipping', description: 'Costo fijo de envío en El Salvador' },
    { key: 'top_banner_text', value: '🧵 ¡Todos los muñecos son 100% hechos a mano! Envíos a todo el país 🇸🇻', category: 'notification', description: 'Mensaje de la barra superior' },
  ];

  for (const s of defaultSettings) {
    await prisma.storeSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description, category: s.category },
      create: s,
    });
  }
  console.log('⚙️ Configuraciones de tienda sembradas.');

  console.log('✨ Semilla completada exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el sembrado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });