import React from 'react';
import AdminCustomOrdersClient from '@/components/admin/AdminCustomOrdersClient';
import { getAdminCustomOrdersAction, seedSampleCustomOrdersIfEmptyAction } from '@/src/actions/admin/custom-orders';
import { getAdminSettingsAction } from '@/src/actions/admin/settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminCustomOrdersPage() {
  let customOrders = await getAdminCustomOrdersAction();
  const settings = await getAdminSettingsAction();

  if (customOrders.length === 0) {
    await seedSampleCustomOrdersIfEmptyAction();
    customOrders = await getAdminCustomOrdersAction();
  }

  return <AdminCustomOrdersClient initialCustomOrders={customOrders} initialSettings={settings} />;
}
