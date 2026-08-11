'use client';
import { loginAction } from '@/actions/auth/login';
import Link from 'next/link';
import { useActionState } from 'react';

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h1>
        
        {state && !state.success && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {state.error}
          </div>
        )}
        
        {state && state.success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm">
            {state.message}
          </div>
        )}

        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          
          <div className="flex items-center justify-end">
            <Link href="/auth/reset-request" className="text-sm text-pink-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
          >
            {isPending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" className="font-medium text-pink-600 hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
