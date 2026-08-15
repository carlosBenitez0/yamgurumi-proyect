import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const url = request.nextUrl.clone();

  const isProtected = url.pathname.startsWith('/mi-taller') || url.pathname.startsWith('/admin');
  const isAdminRoute = url.pathname.startsWith('/admin');
  const isAuthRoute = url.pathname === '/auth/login' || url.pathname === '/auth/register';

  // Si el usuario ya está autenticado e intenta ir a /auth/login o /auth/register -> Redirigir al inicio /
  if (isAuthRoute && token) {
    try {
      if (!secretKey) throw new Error('JWT_SECRET missing');
      await jwtVerify(token, key);
      url.pathname = '/';
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
      if (!secretKey) throw new Error('JWT_SECRET missing');
      
      const { payload } = await jwtVerify(token, key);
      
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
      url.pathname = '/auth/login';
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
