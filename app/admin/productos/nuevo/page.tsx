import React from 'react';
import { getAdminCategoriesAction } from '@/src/actions/admin/categories';
import AdminNewProductClient from '@/components/admin/AdminNewProductClient';

export default async function AdminNewProductPage() {
  const categories = await getAdminCategoriesAction();

  return <AdminNewProductClient categories={categories} />;
}
