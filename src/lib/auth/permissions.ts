import { Role } from '@prisma/client';
import { getSession } from './session';

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === 'ADMIN';
}

export async function isCustomer(): Promise<boolean> {
  const session = await getSession();
  return session?.role === 'CUSTOMER';
}
