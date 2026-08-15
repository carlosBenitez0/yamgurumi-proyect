'use client';

import { requestResetAction } from '@/src/actions/auth/request-reset';
import { resetRequestSchema, ResetRequestFormData } from '@/src/lib/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useActionState, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';

export default function ResetRequestPage() {
  const [state, action, isPending] = useActionState(requestResetAction, null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<ResetRequestFormData>({
    resolver: zodResolver(resetRequestSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: ResetRequestFormData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    startTransition(() => {
      action(formData);
    });
  };

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
          Recuperación
        </div>

        <div className="text-center mb-8 mt-2">
          <h1 className="font-headline text-[32px] font-bold text-on-surface mb-2 leading-none">
            Recuperar Contraseña
          </h1>
          <p className="font-body text-body-sm text-on-surface-variant">
            Te enviaremos un enlace de verificación para restablecer tu acceso de forma segura.
          </p>
        </div>

        {state && !state.success && (
          <div className="bg-error-container text-error p-4 rounded-2xl mb-6 text-body-sm font-semibold border border-error/10 flex items-center gap-2">
            <MdErrorOutline className="text-lg shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {state && state.success && (
          <div className="bg-secondary-container text-on-secondary-container p-4 rounded-2xl mb-6 text-body-sm font-semibold border border-secondary/10 flex items-center gap-2">
            <MdCheckCircle className="text-lg shrink-0 text-secondary" />
            <span>{state.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-body" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-body-sm font-bold text-on-surface-variant">
              Correo electrónico
            </label>
            <div className="relative">
              <input 
                type="email" 
                id="email"
                {...register('email')}
                placeholder="tuemail@ejemplo.com"
                className={`block w-full rounded-2xl border p-4 text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all duration-200 ${
                  errors.email 
                    ? 'border-error bg-error/5 focus:ring-2 focus:ring-error' 
                    : (touchedFields.email || dirtyFields.email) && !errors.email
                    ? 'border-emerald-500/60 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-500'
                    : 'border-outline-variant/40 bg-surface-container-lowest focus:ring-2 focus:ring-secondary'
                }`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                {errors.email && <MdErrorOutline className="text-error text-lg" />}
                {!errors.email && (touchedFields.email || dirtyFields.email) && <MdCheckCircle className="text-emerald-500 text-lg" />}
              </div>
            </div>
            {errors.email && (
              <p className="text-xs font-semibold text-error mt-1 flex items-center gap-1 animate-fadeIn">
                <MdErrorOutline className="text-sm shrink-0" />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full flex justify-center py-4 px-6 bg-secondary text-white font-bold rounded-full shadow-button hover:bg-secondary/90 transition-all duration-300 tactile-press active:scale-95 text-body-md mt-6 disabled:opacity-50"
          >
            {isPending ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center font-body">
          <Link href="/auth/login" className="font-bold text-secondary hover:text-secondary/85 transition-colors text-body-sm">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
