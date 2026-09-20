import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || 'postgresql://yamgurumi:yamiadmin3123@localhost:5432/yamgurumi?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedNotificationsForAdmin() {
  console.log('🚀 Iniciando inyección de notificaciones y datos de prueba...');

  const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@yamgurumi.com';
  const defaultPassword = process.env.TEST_ADMIN_PASSWORD || 'Contrasena123!';
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  // 1. Obtener o crear usuario Admin
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      name: 'Carlos Benítez (Admin)',
      passwordHash,
    },
    create: {
      email: adminEmail,
      name: 'Carlos Benítez (Admin)',
      role: 'ADMIN',
      passwordHash,
      emailVerified: new Date(),
    },
  });

  console.log(`👤 Usuario Admin preparado: ${adminUser.email} (ID: ${adminUser.id})`);

  // 2. Crear / Actualizar Categoría por defecto si no existe
  let category = await prisma.category.findFirst();
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Amigurumis Navideños',
        slug: 'amigurumis-navidenos',
        description: 'Edición especial de amigurumis tejidos a mano',
      },
    });
  }

  // 3. Inyectar / Actualizar Productos de prueba con bajo stock
  const p1 = await prisma.product.upsert({
    where: { slug: 'gatito-amigurumi-navideno' },
    update: { stock: 1, isActive: true },
    create: {
      name: 'Gatito Amigurumi Navideño',
      slug: 'gatito-amigurumi-navideno',
      price: 18.50,
      stock: 1,
      categoryId: category.id,
      description: 'Hermoso gatito navideño tejido 100% a mano con hilo de algodón hipoalergénico.',
      materials: 'Hilo de algodón 100%, relleno sintético.',
      imageUrls: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80'],
    },
  });

  const p2 = await prisma.product.upsert({
    where: { slug: 'llavero-muneco-crochet' },
    update: { stock: 0, isActive: true },
    create: {
      name: 'Llavero Muñeco Crochet',
      slug: 'llavero-muneco-crochet',
      price: 8.00,
      stock: 0,
      categoryId: category.id,
      description: 'Llavero personalizado con diseño de muñeco de nieve.',
      materials: 'Hilo de algodón, aro metálico inoxidable.',
      imageUrls: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&q=80'],
    },
  });

  const p3 = await prisma.product.upsert({
    where: { slug: 'cactus-en-maceta-tejida' },
    update: { stock: 2, isActive: true },
    create: {
      name: 'Cactus en Maceta Tejida',
      slug: 'cactus-en-maceta-tejida',
      price: 22.00,
      stock: 2,
      categoryId: category.id,
      description: 'Cactus decorativo en maceta de terracota tejida a crochet.',
      materials: 'Hilo acrílico suave, maceta miniatura.',
      imageUrls: ['https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80'],
    },
  });

  const p4 = await prisma.product.upsert({
    where: { slug: 'oso-teddy-artesanal-gigante' },
    update: { stock: 5, isActive: true },
    create: {
      name: 'Oso Teddy Artesanal Gigante',
      slug: 'oso-teddy-artesanal-gigante',
      price: 35.00,
      stock: 5,
      categoryId: category.id,
      description: 'Oso de felpa tejido a mano de tamaño grande.',
      materials: 'Algodón orgánico y felpa.',
      imageUrls: ['https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80'],
    },
  });

  const p5 = await prisma.product.upsert({
    where: { slug: 'muneco-de-nieve-crochet' },
    update: { stock: 8, isActive: true },
    create: {
      name: 'Muñeco de Nieve Crochet',
      slug: 'muneco-de-nieve-crochet',
      price: 15.00,
      stock: 8,
      categoryId: category.id,
      description: 'Muñeco de nieve decorativo tejido.',
      materials: 'Hilo acrílico suave.',
      imageUrls: ['https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=500&q=80'],
    },
  });

  const p6 = await prisma.product.upsert({
    where: { slug: 'zorrito-de-los-bosques-tejido' },
    update: { stock: 4, isActive: true },
    create: {
      name: 'Zorrito de los Bosques Tejido',
      slug: 'zorrito-de-los-bosques-tejido',
      price: 24.00,
      stock: 4,
      categoryId: category.id,
      description: 'Tierno zorro artesanal en color naranja.',
      materials: 'Algodón 100%.',
      imageUrls: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80'],
    },
  });

  const p7 = await prisma.product.upsert({
    where: { slug: 'llavero-agave-tejido' },
    update: { stock: 12, isActive: true },
    create: {
      name: 'Llavero Agave Tejido',
      slug: 'llavero-agave-tejido',
      price: 9.50,
      stock: 12,
      categoryId: category.id,
      description: 'Mini llavero en forma de suculenta.',
      materials: 'Hilo de algodón.',
      imageUrls: ['https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80'],
    },
  });

  const p8 = await prisma.product.upsert({
    where: { slug: 'conejo-pascua-de-algodon' },
    update: { stock: 6, isActive: true },
    create: {
      name: 'Conejo Pascua de Algodón',
      slug: 'conejo-pascua-de-algodon',
      price: 19.00,
      stock: 6,
      categoryId: category.id,
      description: 'Conejo suave de orejas largas.',
      materials: 'Algodón hipoalergénico.',
      imageUrls: ['https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80'],
    },
  });

  const p9 = await prisma.product.upsert({
    where: { slug: 'dragon-magico-amigurumi' },
    update: { stock: 3, isActive: true },
    create: {
      name: 'Dragón Mágico Amigurumi',
      slug: 'dragon-magico-amigurumi',
      price: 42.00,
      stock: 3,
      categoryId: category.id,
      description: 'Dragón de fantasía con detalles en alas.',
      materials: 'Hilo mercerizado.',
      imageUrls: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&q=80'],
    },
  });

  const p10 = await prisma.product.upsert({
    where: { slug: 'pinguino-con-bufanda-tejida' },
    update: { stock: 7, isActive: true },
    create: {
      name: 'Pingüino con Bufanda Tejida',
      slug: 'pinguino-con-bufanda-tejida',
      price: 16.50,
      stock: 7,
      categoryId: category.id,
      description: 'Pingüino invernal artesanal.',
      materials: 'Algodón suave.',
      imageUrls: ['https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=500&q=80'],
    },
  });

  console.log(`📦 Catálogo de productos amplio configurado (p1-p10)`);

  // 4. Inyectar Pedidos reales asociados al Admin
  const order1 = await prisma.order.upsert({
    where: { id: 'ORD-TEST-901' },
    update: { status: 'CONFIRMED' },
    create: {
      id: 'ORD-TEST-901',
      userId: adminUser.id,
      email: adminUser.email,
      phone: '+503 7731 1064',
      zone: 'San Salvador, El Salvador',
      notes: 'Entregar en bolsa de regalo especial',
      subtotal: 18.50,
      discount: 0,
      total: 18.50,
      status: 'CONFIRMED',
      whatsappUrl: 'https://wa.me/50377311064',
      items: {
        create: [
          {
            productId: p1.id,
            name: p1.name,
            price: p1.price,
            quantity: 1,
            size: 'Mediano',
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.upsert({
    where: { id: 'ORD-TEST-902' },
    update: { status: 'SHIPPED', trackingNumber: 'GUIA-CEX-98214' },
    create: {
      id: 'ORD-TEST-902',
      userId: adminUser.id,
      email: adminUser.email,
      phone: '+503 7731 1064',
      zone: 'Santa Tecla, El Salvador',
      subtotal: 22.00,
      discount: 0,
      total: 22.00,
      status: 'SHIPPED',
      trackingNumber: 'GUIA-CEX-98214',
      whatsappUrl: 'https://wa.me/50377311064',
      items: {
        create: [
          {
            productId: p3.id,
            name: p3.name,
            price: p3.price,
            quantity: 1,
            size: 'Mediano',
          },
        ],
      },
    },
  });

  // Pedido con 6 Productos
  const order3 = await prisma.order.upsert({
    where: { id: 'ORD-TEST-903' },
    update: { status: 'CONFIRMED' },
    create: {
      id: 'ORD-TEST-903',
      userId: adminUser.id,
      email: adminUser.email,
      phone: '+503 7731 1064',
      zone: 'Colonia Escalón, San Salvador',
      notes: 'Llamar antes de entregar en la caseta principal.',
      subtotal: 188.00,
      discount: 10.00,
      discountCode: 'NAVIDAD30',
      total: 178.00,
      status: 'CONFIRMED',
      whatsappUrl: 'https://wa.me/50377311064',
      items: {
        create: [
          { productId: p4.id, name: p4.name, price: p4.price, quantity: 2, size: 'Grande' },
          { productId: p1.id, name: p1.name, price: p1.price, quantity: 1, size: 'Mediano' },
          { productId: p2.id, name: p2.name, price: p2.price, quantity: 3, size: 'Llavero' },
          { productId: p3.id, name: p3.name, price: p3.price, quantity: 1, size: 'Mediano' },
          { productId: p5.id, name: p5.name, price: p5.price, quantity: 2, size: 'Mediano' },
          { productId: p6.id, name: p6.name, price: p6.price, quantity: 1, size: 'Mediano' },
        ],
      },
    },
  });

  // Pedido con 8 Productos
  const order4 = await prisma.order.upsert({
    where: { id: 'ORD-TEST-904' },
    update: { status: 'SHIPPED', trackingNumber: 'GUIA-CEX-99881' },
    create: {
      id: 'ORD-TEST-904',
      userId: adminUser.id,
      email: adminUser.email,
      phone: '+503 7731 1064',
      zone: 'Antiguo Cuscatlán, La Libertad',
      subtotal: 216.50,
      discount: 0,
      total: 216.50,
      status: 'SHIPPED',
      trackingNumber: 'GUIA-CEX-99881',
      whatsappUrl: 'https://wa.me/50377311064',
      items: {
        create: [
          { productId: p9.id, name: p9.name, price: p9.price, quantity: 1, size: 'Grande' },
          { productId: p8.id, name: p8.name, price: p8.price, quantity: 2, size: 'Mediano' },
          { productId: p10.id, name: p10.name, price: p10.price, quantity: 2, size: 'Mediano' },
          { productId: p7.id, name: p7.name, price: p7.price, quantity: 4, size: 'Llavero' },
          { productId: p1.id, name: p1.name, price: p1.price, quantity: 1, size: 'Mediano' },
          { productId: p2.id, name: p2.name, price: p2.price, quantity: 2, size: 'Llavero' },
          { productId: p3.id, name: p3.name, price: p3.price, quantity: 1, size: 'Mediano' },
          { productId: p6.id, name: p6.name, price: p6.price, quantity: 1, size: 'Mediano' },
        ],
      },
    },
  });

  // Pedido Gran Formato con 10 Productos
  const order5 = await prisma.order.upsert({
    where: { id: 'ORD-TEST-905' },
    update: { status: 'PENDING' },
    create: {
      id: 'ORD-TEST-905',
      userId: adminUser.id,
      email: adminUser.email,
      phone: '+503 7731 1064',
      zone: 'Santa Tecla, La Libertad',
      notes: 'Por favor empacar cada muñeco individualmente con etiqueta de regalo.',
      subtotal: 308.00,
      discount: 20.00,
      discountCode: 'SUPERCOMBO',
      total: 288.00,
      status: 'PENDING',
      whatsappUrl: 'https://wa.me/50377311064',
      items: {
        create: [
          { productId: p9.id, name: p9.name, price: p9.price, quantity: 1, size: 'Grande' },
          { productId: p4.id, name: p4.name, price: p4.price, quantity: 1, size: 'Grande' },
          { productId: p6.id, name: p6.name, price: p6.price, quantity: 2, size: 'Mediano' },
          { productId: p3.id, name: p3.name, price: p3.price, quantity: 1, size: 'Mediano' },
          { productId: p8.id, name: p8.name, price: p8.price, quantity: 2, size: 'Mediano' },
          { productId: p1.id, name: p1.name, price: p1.price, quantity: 1, size: 'Mediano' },
          { productId: p10.id, name: p10.name, price: p10.price, quantity: 2, size: 'Mediano' },
          { productId: p5.id, name: p5.name, price: p5.price, quantity: 2, size: 'Mediano' },
          { productId: p7.id, name: p7.name, price: p7.price, quantity: 3, size: 'Llavero' },
          { productId: p2.id, name: p2.name, price: p2.price, quantity: 4, size: 'Llavero' },
        ],
      },
    },
  });

  console.log(`🛍️ Pedidos creados: #ORD-TEST-901, #ORD-TEST-902, #ORD-TEST-903 (6 ítems), #ORD-TEST-904 (8 ítems), #ORD-TEST-905 (10 ítems)`);

  // 5. Inyectar Cupones reales asignados al Admin
  const now = new Date();
  const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const couponExpiring = await prisma.discountCode.upsert({
    where: { id: 'coup_expiring_test_1' },
    update: { expiresAt: twoDaysFromNow },
    create: {
      id: 'coup_expiring_test_1',
      code: 'NAVIDAD30',
      percent: 30,
      userId: adminUser.id,
      usageLimit: 1,
      usedCount: 0,
      isActive: true,
      expiresAt: twoDaysFromNow,
    },
  });

  const couponExpired = await prisma.discountCode.upsert({
    where: { id: 'coup_expired_test_1' },
    update: { expiresAt: yesterday },
    create: {
      id: 'coup_expired_test_1',
      code: 'VERANO90',
      percent: 90,
      userId: adminUser.id,
      usageLimit: 1,
      usedCount: 0,
      isActive: true,
      expiresAt: yesterday,
    },
  });

  console.log(`🎟️ Cupones de prueba asignados: "${couponExpiring.code}" (Vence en 2d) y "${couponExpired.code}" (Expirado)`);

  // 6. Eliminar notificaciones antiguas de prueba si existen para refrescar
  await prisma.notification.deleteMany({
    where: { userId: adminUser.id },
  });

  // 7. Inyectar Notificaciones reales de TODOS los tipos para admin@yamgurumi.com
  const notificationsToCreate = [
    {
      userId: adminUser.id,
      type: 'COUPON_EXPIRING' as const,
      couponId: couponExpiring.id,
      title: '¡Tu cupón "NAVIDAD30" vence pronto!',
      message: 'Tu descuento especial de 30% OFF vence en 2 día(s). ¡Aprovéchalo antes de que caduque en tu próxima compra!',
      link: '/mi-taller?tab=beneficios',
      isRead: false,
    },
    {
      userId: adminUser.id,
      type: 'COUPON_EXPIRED' as const,
      couponId: couponExpired.id,
      title: 'El cupón "VERANO90" ha expirado',
      message: 'Lamentablemente tu cupón de 90% OFF ha alcanzado su fecha de expiración y ya no está activo.',
      link: '/mi-taller?tab=beneficios',
      isRead: false,
    },
    {
      userId: adminUser.id,
      type: 'ORDER_STATUS' as const,
      title: `¡Tu pedido #${order2.id} ha sido enviado!`,
      message: `Tu amigurumi "${p3.name}" va en camino con la guía de rastreo GUIA-CEX-98214.`,
      link: '/mi-taller?tab=pedidos',
      isRead: false,
    },
    {
      userId: adminUser.id,
      type: 'ORDER_STATUS' as const,
      title: `Pedido #${order1.id} en confección`,
      message: `Tu pedido de "${p1.name}" ya se encuentra en proceso de tejido a mano en nuestro taller.`,
      link: '/mi-taller?tab=pedidos',
      isRead: false,
    },
    {
      userId: adminUser.id,
      type: 'GENERAL' as const,
      title: `Alerta de Catálogo: ${p1.name}`,
      message: `El producto "${p1.name}" tiene un inventario crítico (solo 1 unidad disponible). ¡Haz clic para ver el producto!`,
      link: `/producto/${p1.slug}`,
      isRead: false,
    },
    {
      userId: adminUser.id,
      type: 'GENERAL' as const,
      title: '¡Bienvenido al Club Yamgurumi!',
      message: 'Gracias por ser parte de nuestra comunidad artesanal. Tienes tus beneficios VIP activados.',
      link: '/mi-taller?tab=beneficios',
      isRead: true,
    },
  ];

  for (const notif of notificationsToCreate) {
    await prisma.notification.create({ data: notif });
  }

  console.log(`🔔 ¡Se inyectaron ${notificationsToCreate.length} notificaciones de todos los tipos para ${adminUser.email}!`);
  console.log('✅ Inyección completada exitosamente.');
}

seedNotificationsForAdmin()
  .catch((e) => {
    console.error('❌ Error inyectando datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
