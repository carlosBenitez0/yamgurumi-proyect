import React from 'react';
import AdminCouponsClient from '@/components/admin/AdminCouponsClient';
import { getAdminCouponsAction } from '@/src/actions/admin/coupons';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminCouponsPage() {
  const coupons = await getAdminCouponsAction();
  return <AdminCouponsClient initialCoupons={coupons} />;
}
