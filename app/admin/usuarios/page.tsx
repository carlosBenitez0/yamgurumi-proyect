import React from 'react';
import AdminUsersClient from '@/components/admin/AdminUsersClient';
import { getAdminUsersAction } from '@/src/actions/admin/users';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminUsersPage() {
  const users = await getAdminUsersAction();
  return <AdminUsersClient initialUsers={users} />;
}
