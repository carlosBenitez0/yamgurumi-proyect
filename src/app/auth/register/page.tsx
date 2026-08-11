'use client';
import { registerAction } from '@/src/actions/auth/register';
import Link from 'next/link';
import { useActionState } from 'react';

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(registerAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Crear Cuenta</h1>
        
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre (Opcional)</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          
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
              minLength={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
          >
            {isPending ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="font-medium text-pink-600 hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
