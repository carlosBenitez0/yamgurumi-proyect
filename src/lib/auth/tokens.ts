import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export interface JWTPayload {
  sub: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
  jti: string;
}

export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  if (!secretKey) throw new Error('JWT_SECRET not configured');
  
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    if (!secretKey) throw new Error('JWT_SECRET not configured');
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}
