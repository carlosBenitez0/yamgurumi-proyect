import { resetPasswordAction } from '@/src/actions/auth/reset-password';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ResetPasswordPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const token = searchParams.token as string | undefined;

  if (!token) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Nueva Contraseña</h1>
        
        <form action={async (formData) => {
          'use server';
          await resetPasswordAction(formData);
        }} className="space-y-4">
          <input type="hidden" name="token" value={token} />
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              minLength={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              required 
              minLength={8}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Guardar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
