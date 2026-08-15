'use client';

import { verifyEmailAction } from '@/src/actions/auth/verify-email';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition, Suspense } from 'react';
import { MdCheckCircle, MdErrorOutline, MdAutoFixHigh } from 'react-icons/md';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token')?.trim();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  useEffect(() => {
    if (!token) return;
    startTransition(async () => {
      const res = await verifyEmailAction(token);
      setResult(res);
    });
  }, [token]);

  if (!token) {
    return (
      <div className="relative w-full max-w-[460px] bg-surface-container-lowest p-8 sm:p-10 rounded-3xl shadow-card border border-primary-container/20 text-center font-body">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto text-4xl mb-4">
          <MdErrorOutline />
        </div>
        <h1 className="font-headline text-[32px] font-bold text-error mb-4 leading-none">Enlace Inválido</h1>
        <p className="text-on-surface-variant mb-6 text-body-sm">No se encontró el token de verificación o ha expirado.</p>
        <Link href="/auth/login" className="font-bold text-secondary hover:text-secondary/85 transition-colors">
          Ir al inicio de sesión
        </Link>
      </div>
    );
  }

  if (isPending || !result) {
    return (
      <div className="relative w-full max-w-[460px] bg-surface-container-lowest p-8 sm:p-10 rounded-3xl shadow-card border border-primary-container/20 text-center font-body space-y-4">
        <div className="relative w-14 h-14 mx-auto">
          <div className="absolute inset-0 rounded-full border-[3px] border-primary/20" />
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <MdAutoFixHigh className="text-primary text-lg animate-pulse" />
          </div>
        </div>
        <h2 className="font-headline text-[24px] font-bold text-on-surface leading-tight">Verificando tu cuenta...</h2>
        <p className="text-xs text-on-surface-variant/70">Por favor espera un momento mientras activamos tu acceso.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[460px] bg-surface-container-lowest p-8 sm:p-10 rounded-3xl shadow-card border border-primary-container/20 text-center font-body animate-fadeIn">
      {result.success ? (
        <>
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl mb-4">
            <MdCheckCircle />
          </div>
          <h1 className="font-headline text-[28px] sm:text-[30px] font-bold text-secondary mb-6 leading-tight">
            Tu cuenta ha sido creada con éxito
          </h1>
          <Link href="/auth/login" className="inline-block py-4 px-8 bg-secondary text-white font-bold rounded-full shadow-button hover:bg-secondary/90 transition-all duration-300 tactile-press active:scale-95 text-body-md">
            Iniciar sesión ahora
          </Link>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto text-4xl mb-4">
            <MdErrorOutline />
          </div>
          <h1 className="font-headline text-[32px] font-bold text-error mb-4 leading-none">Verificación Fallida</h1>
          <p className="text-on-surface-variant mb-6 text-body-sm">{result.error}</p>
          <Link href="/auth/login" className="font-bold text-secondary hover:text-secondary/85 transition-colors">
            Ir al inicio de sesión
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Hilos de lana de fondo decorativos */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg width="100%" height="100%">
          <path d="M -50 100 Q 200 300, 500 100 T 1200 200 T 1800 100" fill="none" stroke="#72594e" strokeWidth="4" className="craft-drift" />
          <path d="M -50 400 Q 400 200, 900 500 T 1800 300" fill="none" stroke="#206776" strokeWidth="3" strokeDasharray="8 8" className="craft-sway" />
        </svg>
      </div>

      <Suspense fallback={
        <div className="relative w-full max-w-[460px] bg-surface-container-lowest p-8 sm:p-10 rounded-3xl shadow-card border border-primary-container/20 text-center font-body">
          <p className="text-sm text-on-surface-variant">Cargando verificación...</p>
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
