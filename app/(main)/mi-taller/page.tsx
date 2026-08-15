import prisma from '@/src/lib/prisma';
import { getAuthCookie, verifyToken } from '@/src/lib/auth/tokens';
import { logoutAction } from '@/src/actions/auth/logout';
import { redirect } from 'next/navigation';
import MiTallerClient from '@/components/taller/MiTallerClient';

// Re-evaluar página con el esquema actualizado de Prisma (campos image y favorites)

export default async function MiTallerPage() {
  const token = await getAuthCookie();
  if (!token) redirect('/auth/login');

  const payload = await verifyToken(token);
  if (!payload) redirect('/auth/login');

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
      role: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
          zone: true,
          whatsappUrl: true,
        },
      },
      addresses: {
        select: {
          id: true,
          name: true,
          phone: true,
          zone: true,
          notes: true,
          isDefault: true,
        },
      },
      discountCodes: {
        select: {
          code: true,
          percent: true,
          usedCount: true,
          usageLimit: true,
          expiresAt: true,
        },
      },
      favorites: {
        select: {
          productId: true,
        },
      },
    },
  });

  if (!user) redirect('/auth/login');

  const formattedDate = new Date(user.createdAt).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  let discountCodes = user.discountCodes;

  // Si el usuario no tiene ningún código de bienvenida registrado, generamos su código único de 10% (1 solo uso)
  if (discountCodes.length === 0) {
    const welcomeCodeStr = `BIENVENIDA10-${user.id.slice(-4).toUpperCase()}`;
    const newDiscount = await prisma.discountCode.create({
      data: {
        code: welcomeCodeStr,
        percent: 10,
        userId: user.id,
        usageLimit: 1,
        usedCount: 0,
      },
    });
    discountCodes = [
      {
        code: newDiscount.code,
        percent: newDiscount.percent,
        usedCount: newDiscount.usedCount,
        usageLimit: newDiscount.usageLimit,
        expiresAt: newDiscount.expiresAt,
      },
    ];
  }

  const serializedOrders = user.orders.map((o) => ({
    id: o.id,
    total: Number(o.total),
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    zone: o.zone,
    whatsappUrl: o.whatsappUrl,
  }));

  const serializedDiscountCodes = discountCodes.map((d) => ({
    code: d.code,
    percent: d.percent,
    usedCount: d.usedCount,
    usageLimit: d.usageLimit,
    expiresAt: d.expiresAt ? d.expiresAt.toISOString() : null,
  }));

  const clientUserData = {
    id: user.id,
    name: user.name,
    image: user.image,
    email: user.email,
    role: user.role,
    formattedDate,
    orders: serializedOrders,
    addresses: user.addresses,
    discountCodes: serializedDiscountCodes,
    favorites: user.favorites.map((f) => f.productId),
  };

  return <MiTallerClient user={clientUserData} logoutAction={logoutAction} />;
}
