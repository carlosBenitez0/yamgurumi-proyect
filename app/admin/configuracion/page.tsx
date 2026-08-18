import React from 'react';
import AdminSettingsClient from '@/components/admin/AdminSettingsClient';
import { getAdminSettingsAction } from '@/src/actions/admin/settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await getAdminSettingsAction();
  return <AdminSettingsClient initialSettings={settings} />;
}
