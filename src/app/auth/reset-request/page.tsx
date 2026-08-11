import { requestResetAction } from '@/actions/auth/request-reset';
import Link from 'next/link';

export default function ResetRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Recuperar Contraseña</h1>
        
        <form action={requestResetAction} className="space-y-4">
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
          
          <button 
            type="submit" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Enviar enlace
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-sm text-pink-600 hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
