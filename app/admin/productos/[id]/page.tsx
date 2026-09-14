import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/src/lib/prisma';
import { requireAdmin } from '@/src/lib/auth/adminGuard';
import { getAdminCategoriesAction } from '@/src/actions/admin/categories';
import AdminEditProductClient from '@/components/admin/AdminEditProductClient';

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const categories = await getAdminCategoriesAction();

  const formattedProduct = {
    id: product.id,
    name: product.name,
    categoryId: product.categoryId,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    stock: product.stock,
    size: product.size,
    description: product.description,
    materials: product.materials,
    imageUrls: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [],
    isFeatured: product.isFeatured,
    isActive: product.isActive,
  };

  return (
    <AdminEditProductClient
      product={formattedProduct}
      categories={categories}
    />
  );
}
