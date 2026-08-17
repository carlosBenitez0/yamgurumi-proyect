import React from 'react';
import { getAdminCategoriesAction } from '@/src/actions/admin/categories';
import AdminCategoriesClient from '@/components/admin/AdminCategoriesClient';

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategoriesAction();

  return <AdminCategoriesClient initialCategories={categories} />;
}
