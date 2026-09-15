import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const DEFAULT_JWT_SECRET = 'h3gh45h7-supersecret-yamgurumi-jwt-key-h87dhy6d';

function getJwtKey() {
  const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const url = request.nextUrl.clone();

  const isProtected = url.pathname.startsWith('/mi-taller') || url.pathname.startsWith('/admin');
  const isAdminRoute = url.pathname.startsWith('/admin');
  const isAuthRoute = url.pathname === '/auth/login' || url.pathname === '/auth/register';

  // Si el usuario ya está autenticado e intenta ir a /auth/login o /auth/register
  if (isAuthRoute && token) {
    try {
      const { payload } = await jwtVerify(token, getJwtKey());
      url.pathname = payload.role === 'ADMIN' ? '/admin' : '/';
      url.search = '';
      return NextResponse.redirect(url);
    } catch (e) {
      // Si la cookie es inválida o caducada, la borramos y le dejamos ver el login/register
      const response = NextResponse.next();
      response.cookies.delete('auth_token');
      return response;
    }
  }

  // Rutas que requieren estar autenticado
  if (isProtected) {
    if (!token) {
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, getJwtKey());
      
      if (isAdminRoute && payload.role !== 'ADMIN') {
        url.pathname = '/';
        return NextResponse.redirect(url);
      }

      // Pasar headers a las rutas Server
      const response = NextResponse.next();
      response.headers.set('x-user-id', payload.sub as string);
      response.headers.set('x-user-role', payload.role as string);
      return response;
    } catch (error) {
      console.error('Middleware JWT verification error:', error);
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      const response = NextResponse.redirect(url);
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mi-taller/:path*', '/admin/:path*', '/auth/login', '/auth/register'],
};
