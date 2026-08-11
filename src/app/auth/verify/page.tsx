import { verifyEmailAction } from '@/src/actions/auth/verify-email';
import Link from 'next/link';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function VerifyPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const token = searchParams.token as string | undefined;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Token Inválido</h1>
          <p className="text-gray-600 mb-6">No se encontró el token de verificación.</p>
          <Link href="/auth/login" className="text-pink-600 font-semibold hover:underline">
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  const result = await verifyEmailAction(token);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
        {result.success ? (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-4">¡Correo Verificado!</h1>
            <p className="text-gray-600 mb-6">{result.message}</p>
            <Link href="/cuenta" className="bg-pink-600 text-white font-bold px-6 py-3 rounded-md hover:bg-pink-700 transition">
              Ir a mi cuenta
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error de Verificación</h1>
            <p className="text-gray-600 mb-6">{result.error}</p>
            <Link href="/auth/login" className="text-pink-600 font-semibold hover:underline">
              Ir al inicio de sesión
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
