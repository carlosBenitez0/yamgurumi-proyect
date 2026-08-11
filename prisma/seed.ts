import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'cb2724136@gmail.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (!existing) {
    const passwordHash = await bcrypt.hash('yamiadmin3123', 12);
    const admin = await prisma.user.create({
      data: {
        email,
        name: 'yami',
        passwordHash,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });
    console.log('✅ Admin creado:', admin.email);
  } else {
    console.log('ℹ️ Admin ya existe:', existing.email);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });