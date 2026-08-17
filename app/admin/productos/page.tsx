import React from 'react';
import { getAdminProductsAction } from '@/src/actions/admin/products';
import { getAdminCategoriesAction } from '@/src/actions/admin/categories';
import AdminProductsClient from '@/components/admin/AdminProductsClient';

export default async function AdminProductsPage() {
  const products = await getAdminProductsAction();
  const categories = await getAdminCategoriesAction();

  return (
    <AdminProductsClient
      initialProducts={products}
      categories={categories}
    />
  );
}
