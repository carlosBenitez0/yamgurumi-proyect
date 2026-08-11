import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const url = request.nextUrl.clone();

  // Rutas que requieren autenticación
  const isProtected = url.pathname.startsWith('/cuenta') || url.pathname.startsWith('/admin');
  const isAdminRoute = url.pathname.startsWith('/admin');

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
  matcher: ['/cuenta/:path*', '/admin/:path*'],
};
