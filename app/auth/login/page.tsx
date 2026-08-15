'use client';

import { loginAction } from '@/src/actions/auth/login';
import { loginSchema, LoginFormData } from '@/src/lib/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, startTransition, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { MdArrowBack, MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import Login3D from "@/components/Login3D";

function LoginFormContent() {
  const [state, action, isPending] = useActionState(loginAction, null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (state?.success) {
      router.push(redirectTo);
      router.refresh();
    }
  }, [state, router, redirectTo]);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: LoginFormData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div className="w-full max-w-md lg:max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center z-10 relative">
      {/* Columna Izquierda: Tarjeta de Login */}
      <div className="lg:col-span-5 w-full flex justify-center order-1">
        <div className="relative w-full bg-surface-container-lowest p-8 sm:p-10 rounded-3xl shadow-card border border-primary-container/20 transition-all duration-300 hover:shadow-elevation">
          
          {/* Detalle cosido superior */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-full shadow-sm">
            Taller Yamgurumi
          </div>

          <div className="text-center mb-8 mt-2">
            <h1 className="font-headline text-[32px] font-bold text-on-surface mb-2 leading-none">
              ¡Hola de nuevo!
            </h1>
            <p className="font-body text-body-sm text-on-surface-variant">
              Inicia sesión para ver tus pedidos y tejer tu historia con nosotros
            </p>
          </div>

          {state && !state.success && (
            <div className="bg-error-container text-error p-4 rounded-2xl mb-6 text-body-sm font-semibold border border-error/10 flex items-center gap-2">
              <MdErrorOutline className="text-lg shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {state && state.success && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl mb-6 text-body-sm font-semibold border border-emerald-500/20 flex items-center gap-2 animate-fadeIn">
              <MdCheckCircle className="text-lg shrink-0 text-emerald-600" />
              <span>{state.message || 'Inicio de sesión exitoso. Redirigiendo...'}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-body" noValidate>
            {/* Campo Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-body-sm font-bold text-on-surface-variant">
                Correo electrónico
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  id="email"
                  {...register('email')}
                  placeholder="tuemail@gmail.com"
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

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-body-sm font-bold text-on-surface-variant">
                  Contraseña
                </label>
                <Link href="/auth/reset-request" className="text-body-sm font-bold text-secondary hover:text-secondary/85 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  id="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className={`block w-full rounded-2xl border p-4 text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all duration-200 ${
                    errors.password 
                      ? 'border-error bg-error/5 focus:ring-2 focus:ring-error' 
                      : (touchedFields.password || dirtyFields.password) && !errors.password
                      ? 'border-emerald-500/60 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-500'
                      : 'border-outline-variant/40 bg-surface-container-lowest focus:ring-2 focus:ring-secondary'
                  }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  {errors.password && <MdErrorOutline className="text-error text-lg" />}
                  {!errors.password && (touchedFields.password || dirtyFields.password) && <MdCheckCircle className="text-emerald-500 text-lg" />}
                </div>
              </div>
              {errors.password && (
                <p className="text-xs font-semibold text-error mt-1 flex items-center gap-1 animate-fadeIn">
                  <MdErrorOutline className="text-sm shrink-0" />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isPending || state?.success}
              className="w-full flex justify-center py-4 px-6 bg-secondary text-white font-bold rounded-full shadow-button hover:bg-secondary/90 transition-all duration-300 tactile-press active:scale-95 disabled:opacity-50 mt-8 text-body-md"
            >
              {isPending ? 'Entrando...' : state?.success ? 'Redirigiendo...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center font-body">
            <p className="text-body-sm text-on-surface-variant">
              ¿Aún no eres parte de la comunidad?{' '}
              <Link href="/auth/register" className="font-bold text-secondary hover:text-secondary/85 transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Modelo 3D */}
      <div className="hidden lg:block lg:col-span-7 h-[450px] xl:h-[550px] relative order-2">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-secondary-container/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <Login3D />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Botón de regresar al inicio */}
      <Link 
        href="/" 
        className="absolute top-4 left-4 sm:top-8 sm:left-8 inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm border border-outline-variant/20 text-on-surface-variant font-bold text-xs sm:text-sm shadow-button hover:bg-surface-container-lowest hover:text-secondary hover:shadow-elevation transition-all duration-300 active:scale-95 z-20 tactile-press"
      >
        <MdArrowBack className="text-base sm:text-lg" />
        <span>Volver al Inicio</span>
      </Link>
      
      {/* Hilos de lana de fondo decorativos */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg width="100%" height="100%">
          <path d="M -50 100 Q 200 300, 500 100 T 1200 200 T 1800 100" fill="none" stroke="#72594e" strokeWidth="4" className="craft-drift" />
          <path d="M -50 400 Q 400 200, 900 500 T 1800 300" fill="none" stroke="#206776" strokeWidth="3" strokeDasharray="8 8" className="craft-sway" />
        </svg>
      </div>

      <Suspense fallback={
        <div className="relative w-full max-w-md bg-surface-container-lowest p-8 rounded-3xl shadow-card border border-primary-container/20 text-center font-body">
          <p className="text-sm text-on-surface-variant">Cargando inicio de sesión...</p>
        </div>
      }>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
