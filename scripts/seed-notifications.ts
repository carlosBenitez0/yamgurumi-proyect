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

  console.log(`📦 Productos con poco stock creados: "${p1.name}" (1 disp.), "${p2.name}" (Agotado), "${p3.name}" (2 disp.)`);

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

  console.log(`🛍️ Pedidos creados/actualizados: #${order1.id} (CONFIRMED) y #${order2.id} (SHIPPED)`);

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
