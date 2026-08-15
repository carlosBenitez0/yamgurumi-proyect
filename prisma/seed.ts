import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

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
      create: d,
    });
    console.log(`🎟️ Cupón de descuento disponible: ${d.code} (${d.percent}% OFF)`);
  }

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