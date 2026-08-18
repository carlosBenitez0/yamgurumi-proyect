import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { categories as mockCategories, products as mockProducts } from '../data/products';
import { OrderStatus } from '@prisma/client';

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
  const createdProducts = [];
  for (const p of mockProducts) {
    const categoryId = categoryMap.get(p.category);
    if (!categoryId) continue;

    const prodSlug = p.slug || slugify(p.name);
    const prod = await prisma.product.upsert({
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
    createdProducts.push(prod);
  }
  console.log(`🧸 Total de productos sembrados en PostgreSQL: ${createdProducts.length}`);

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

  // 6. Inyección Masiva de Pedidos Reales (15 Pedidos)
  const sampleOrders = [
    {
      id: 'ORD-8490',
      email: 'andrea.melendez@gmail.com',
      phone: '+503 7201 8844',
      zone: 'San Salvador, Colonia San Benito',
      notes: 'Por favor entregar por la mañana en recepción.',
      subtotal: 45.00,
      discount: 0,
      total: 45.00,
      status: OrderStatus.DELIVERED,
      trackingNumber: 'GUIA-CEX-98101',
      whatsappUrl: 'https://wa.me/50372018844',
      adminNotes: 'Entregado a la recepcionista del edificio.',
      createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8491',
      email: 'roberto.alvarado@outlook.com',
      phone: '+503 7844 1122',
      zone: 'Santa Tecla, Residencial Utila',
      subtotal: 38.00,
      discount: 0,
      total: 38.00,
      status: OrderStatus.DELIVERED,
      trackingNumber: 'GUIA-CEX-98102',
      whatsappUrl: 'https://wa.me/50378441122',
      createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8492',
      email: 'maria.gonzalez@gmail.com',
      phone: '+503 7812 9043',
      zone: 'San Salvador, Colonia Escalón',
      notes: 'Por favor envolver para regalo de cumpleaños con una nota azul.',
      subtotal: 42.50,
      discount: 0,
      total: 42.50,
      status: OrderStatus.PENDING,
      whatsappUrl: 'https://wa.me/50378129043',
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: 'ORD-8493',
      email: 'carlos.mendoza@hotmail.com',
      phone: '+503 7123 4567',
      zone: 'Santa Tecla, La Libertad',
      notes: 'Entregar en horario de tarde.',
      subtotal: 55.00,
      discount: 5.00,
      discountCode: 'BIENVENIDO20',
      total: 50.00,
      status: OrderStatus.CONFIRMED,
      whatsappUrl: 'https://wa.me/50371234567',
      adminNotes: 'Pago por transferencia verificado.',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000),
    },
    {
      id: 'ORD-8494',
      email: 'sofia.martinez@yahoo.com',
      phone: '+503 7987 6543',
      zone: 'Antiguo Cuscatlán, San Elena',
      subtotal: 35.00,
      discount: 0,
      total: 35.00,
      status: OrderStatus.SHIPPED,
      trackingNumber: 'GUIA-CEX-98214',
      whatsappUrl: 'https://wa.me/50379876543',
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8495',
      email: 'gabriel.rivas@gmail.com',
      phone: '+503 7654 3210',
      zone: 'San Salvador, Colonia Miramonte',
      notes: 'Llamar antes de llegar.',
      subtotal: 65.00,
      discount: 0,
      total: 65.00,
      status: OrderStatus.CONFIRMED,
      whatsappUrl: 'https://wa.me/50376543210',
      createdAt: new Date(Date.now() - 4 * 3600 * 1000),
    },
    {
      id: 'ORD-8496',
      email: 'daniela.flores@gmail.com',
      phone: '+503 7543 2109',
      zone: 'Soyapango, Prados de Venecia',
      subtotal: 38.00,
      discount: 0,
      total: 38.00,
      status: OrderStatus.PENDING,
      whatsappUrl: 'https://wa.me/50375432109',
      createdAt: new Date(Date.now() - 50 * 60 * 1000),
    },
    {
      id: 'ORD-8497',
      email: 'luis.henriquez@outlook.com',
      phone: '+503 7321 0987',
      zone: 'Mejicanos, Colonia Metrópolis',
      subtotal: 40.00,
      discount: 4.00,
      discountCode: 'YAM10',
      total: 36.00,
      status: OrderStatus.SHIPPED,
      trackingNumber: 'GUIA-CEX-98219',
      whatsappUrl: 'https://wa.me/50373210987',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8498',
      email: 'valeria.ramos@icloud.com',
      phone: '+503 7890 1234',
      zone: 'San Salvador, Colonia Flor Blanca',
      subtotal: 48.00,
      discount: 0,
      total: 48.00,
      status: OrderStatus.DELIVERED,
      trackingNumber: 'GUIA-CEX-98220',
      whatsappUrl: 'https://wa.me/50378901234',
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8499',
      email: 'fer.reyes@gmail.com',
      phone: '+503 7012 3456',
      zone: 'San Miguel, Colonia El Escalón',
      subtotal: 15.00,
      discount: 0,
      total: 15.00,
      status: OrderStatus.CANCELLED,
      whatsappUrl: 'https://wa.me/50370123456',
      adminNotes: 'Cliente solicitó cancelación por cambio de dirección.',
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8500',
      email: 'lucia.vasquez@gmail.com',
      phone: '+503 7432 1098',
      zone: 'Sonsonate, Centro',
      subtotal: 45.00,
      discount: 0,
      total: 45.00,
      status: OrderStatus.PENDING,
      whatsappUrl: 'https://wa.me/50374321098',
      createdAt: new Date(Date.now() - 1 * 3600 * 1000),
    },
    {
      id: 'ORD-8501',
      email: 'ale.aguilar@gmail.com',
      phone: '+503 7678 9012',
      zone: 'Santa Ana, Residencial Los Viñedos',
      subtotal: 52.00,
      discount: 5.20,
      discountCode: 'YAM10',
      total: 46.80,
      status: OrderStatus.CONFIRMED,
      whatsappUrl: 'https://wa.me/50376789012',
      createdAt: new Date(Date.now() - 3 * 3600 * 1000),
    },
    {
      id: 'ORD-8502',
      email: 'camilo.f@gmail.com',
      phone: '+503 7111 2233',
      zone: 'Apopa, San Salvador',
      subtotal: 44.00,
      discount: 0,
      total: 44.00,
      status: OrderStatus.SHIPPED,
      trackingNumber: 'GUIA-CEX-98235',
      whatsappUrl: 'https://wa.me/50371112233',
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8503',
      email: 'natalia.cruz@outlook.com',
      phone: '+503 7999 8877',
      zone: 'La Libertad, Puerto de La Libertad',
      subtotal: 39.00,
      discount: 0,
      total: 39.00,
      status: OrderStatus.DELIVERED,
      trackingNumber: 'GUIA-CEX-98240',
      whatsappUrl: 'https://wa.me/50379998877',
      createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000),
    },
    {
      id: 'ORD-8504',
      email: 'rodrigo.m@gmail.com',
      phone: '+503 7333 4455',
      zone: 'Ilopango, San Salvador',
      subtotal: 18.00,
      discount: 0,
      total: 18.00,
      status: OrderStatus.CANCELLED,
      whatsappUrl: 'https://wa.me/50373334455',
      adminNotes: 'Pedido duplicado por error.',
      createdAt: new Date(Date.now() - 9 * 24 * 3600 * 1000),
    },
  ];

  for (let i = 0; i < sampleOrders.length; i++) {
    const o = sampleOrders[i];
    const prod1 = createdProducts[i % createdProducts.length] || createdProducts[0];
    const prod2 = createdProducts[(i + 1) % createdProducts.length] || createdProducts[0];

    const existingOrder = await prisma.order.findUnique({ where: { id: o.id } });
    if (!existingOrder) {
      await prisma.order.create({
        data: {
          id: o.id,
          email: o.email,
          phone: o.phone,
          zone: o.zone,
          notes: o.notes || null,
          subtotal: o.subtotal,
          discount: o.discount,
          discountCode: o.discountCode || null,
          total: o.total,
          status: o.status,
          whatsappUrl: o.whatsappUrl,
          trackingNumber: o.trackingNumber || null,
          adminNotes: o.adminNotes || null,
          createdAt: o.createdAt,
          items: {
            create: [
              {
                productId: prod1.id,
                name: prod1.name,
                price: prod1.price,
                quantity: 1,
                size: prod1.size,
              },
              {
                productId: prod2.id,
                name: prod2.name,
                price: prod2.price,
                quantity: 1,
                size: 'Mediano',
              },
            ],
          },
        },
      });
    }
  }
  console.log(`📦 Se han sembrado 15 pedidos reales de prueba en PostgreSQL.`);

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