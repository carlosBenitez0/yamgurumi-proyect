import Link from 'next/link';
import { redirect } from 'next/navigation';
import ResetPasswordForm from './ResetPasswordForm';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ResetPasswordPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const token = searchParams.token as string | undefined;

  if (!token) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Hilos de lana de fondo decorativos */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg width="100%" height="100%">
          <path d="M -50 100 Q 200 300, 500 100 T 1200 200 T 1800 100" fill="none" stroke="#72594e" strokeWidth="4" className="craft-drift" />
          <path d="M -50 400 Q 400 200, 900 500 T 1800 300" fill="none" stroke="#206776" strokeWidth="3" strokeDasharray="8 8" className="craft-sway" />
        </svg>
      </div>

      <div className="relative w-full max-w-[460px] bg-surface-container-lowest p-8 sm:p-10 rounded-3xl shadow-card border border-primary-container/20 transition-all duration-300 hover:shadow-elevation">
        
        {/* Detalle cosido superior */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-full shadow-sm">
          Nueva Contraseña
        </div>

        <div className="text-center mb-8 mt-2">
          <h1 className="font-headline text-[32px] font-bold text-on-surface mb-2 leading-none">
            Restablecer Contraseña
          </h1>
          <p className="font-body text-body-sm text-on-surface-variant">
            Ingresa tu nueva contraseña para volver a tejer historias con nosotros.
          </p>
        </div>

        <ResetPasswordForm token={token} />

        <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center font-body">
          <Link href="/auth/login" className="font-bold text-secondary hover:text-secondary/85 transition-colors text-body-sm">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
