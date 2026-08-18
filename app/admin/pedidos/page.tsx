import React from 'react';
import AdminOrdersClient from '@/components/admin/AdminOrdersClient';
import { getAdminOrdersAction, seedSampleOrdersIfEmptyAction } from '@/src/actions/admin/orders';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminOrdersPage() {
  let orders = await getAdminOrdersAction();

  // Si no hay pedidos en la base de datos, sembrar pedidos de muestra automáticamente para pruebas
  if (orders.length === 0) {
    await seedSampleOrdersIfEmptyAction();
    orders = await getAdminOrdersAction();
  }

  return <AdminOrdersClient initialOrders={orders} />;
}
