'use client';

import { registerAction } from '@/src/actions/auth/register';
import { resendVerificationAction } from '@/src/actions/auth/resend-verification';
import { registerSchema, RegisterFormData } from '@/src/lib/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useActionState, startTransition, useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  MdArrowBack, 
  MdCheckCircle, 
  MdErrorOutline, 
  MdRadioButtonUnchecked,
  MdShield,
  MdMarkEmailRead,
  MdRefresh
} from 'react-icons/md';
import Register3D from "@/components/Register3D";

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(registerAction, null);
  const [resendState, resendAction, isResendPending] = useActionState(resendVerificationAction, null);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [targetEmail, setTargetEmail] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const passwordValue = watch('password') || '';

  // Password complexity requirements checklist
  const passwordRequirements = useMemo(() => [
    { id: 'length', label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
    { id: 'number', label: 'Al menos un número (0-9)', test: (p: string) => /[0-9]/.test(p) },
    { id: 'uppercase', label: 'Al menos una mayúscula (A-Z)', test: (p: string) => /[A-Z]/.test(p) },
    { id: 'symbol', label: 'Al menos un símbolo (@, #, $, etc.)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ], []);

  const metRequirementsCount = useMemo(() => {
    return passwordRequirements.filter((req) => req.test(passwordValue)).length;
  }, [passwordValue, passwordRequirements]);

  const isPasswordFullyValid = passwordValue.length > 0 && metRequirementsCount === 4;

  // Strength label & color calculation
  const strengthInfo = useMemo(() => {
    if (!passwordValue) return { label: '', color: 'bg-outline-variant/30', textCol: 'text-on-surface-variant/40' };
    if (metRequirementsCount <= 1) return { label: 'Débil', color: 'bg-error', textCol: 'text-error' };
    if (metRequirementsCount <= 3) return { label: 'Media', color: 'bg-amber-500', textCol: 'text-amber-500' };
    return { label: 'Fuerte', color: 'bg-emerald-500', textCol: 'text-emerald-500' };
  }, [passwordValue, metRequirementsCount]);

  // Handle countdown timer for resend button
  useEffect(() => {
    if (state?.success) {
      if (state.emailSentTo) setTargetEmail(state.emailSentTo);
      setCooldown(60);
    }
  }, [state]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = (data: RegisterFormData) => {
    setTargetEmail(data.email);
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    startTransition(() => {
      action(formData);
    });
  };

  const handleResend = () => {
    if (cooldown > 0 || !targetEmail) return;
    const formData = new FormData();
    formData.append('email', targetEmail);
    setCooldown(60);
    startTransition(() => {
      resendAction(formData);
    });
  };

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

      {/* Contenedor Grid Dividido */}
      <div className="w-full max-w-md lg:max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center z-10 relative">
        {/* Columna Izquierda: Modelo 3D */}
        <div className="hidden lg:block lg:col-span-7 h-[450px] xl:h-[550px] relative order-1">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-secondary-container/20 rounded-full blur-3xl -z-10 pointer-events-none" />
          <Register3D />
        </div>

        {/* Columna Derecha: Tarjeta de Registro */}
        <div className="lg:col-span-5 w-full flex justify-center order-2">
          <div className="relative w-full bg-surface-container-lowest p-8 sm:p-10 rounded-3xl shadow-card border border-primary-container/20 transition-all duration-300 hover:shadow-elevation">
            
            {/* Detalle cosido superior */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-full shadow-sm">
              Únete a Nosotros
            </div>

            {/* VISTA 1: Éxito con Confirmación de Correo y Botón de Reenvío */}
            {state && state.success ? (
              <div className="text-center py-4 space-y-5 font-body animate-fadeIn">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto text-secondary text-3xl">
                  <MdMarkEmailRead />
                </div>

                <div>
                  <h2 className="font-headline text-[26px] font-bold text-on-surface mb-2 leading-tight">
                    ¡Revisa tu Correo!
                  </h2>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Hemos enviado un enlace de confirmación a:
                    <br />
                    <span className="font-bold text-secondary text-sm block mt-1">{targetEmail}</span>
                  </p>
                </div>

                <div className="bg-surface-container-low/70 p-4 rounded-2xl border border-outline-variant/20 text-xs text-on-surface-variant/80 text-left space-y-1.5">
                  <p className="font-bold text-on-surface">Pasos para activar tu cuenta:</p>
                  <ol className="list-decimal list-inside space-y-1 pl-1">
                    <li>Abre tu bandeja de entrada o carpeta de Spam.</li>
                    <li>Haz clic en el botón <strong>&quot;Verificar mi Cuenta&quot;</strong>.</li>
                    <li>¡Listo! Podrás iniciar sesión inmediatamente.</li>
                  </ol>
                </div>

                {/* Feedback de Reenvío */}
                {resendState && !resendState.success && (
                  <div className="bg-error-container text-error p-3 rounded-2xl text-xs font-semibold border border-error/10 flex items-center gap-2">
                    <MdErrorOutline className="text-base shrink-0" />
                    <span>{resendState.error}</span>
                  </div>
                )}
                {resendState && resendState.success && (
                  <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl text-xs font-semibold border border-emerald-500/30 flex items-center gap-2">
                    <MdCheckCircle className="text-base shrink-0 text-emerald-600" />
                    <span>{resendState.message}</span>
                  </div>
                )}

                {/* Botón de Reenvío con Cooldown */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || isResendPending}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full border border-secondary text-secondary font-bold text-body-sm hover:bg-secondary/10 transition-all duration-300 tactile-press active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdRefresh className={`text-lg ${isResendPending ? 'animate-spin' : ''}`} />
                    <span>
                      {isResendPending
                        ? 'Enviando...'
                        : cooldown > 0
                        ? `Reenviar correo en ${cooldown}s`
                        : 'Reenviar Correo de Verificación'}
                    </span>
                  </button>
                </div>

                <div className="pt-4 border-t border-outline-variant/20">
                  <Link href="/auth/login" className="text-body-sm font-bold text-secondary hover:underline">
                    Ir al inicio de sesión
                  </Link>
                </div>
              </div>
            ) : (
              /* VISTA 2: Formulario de Registro */
              <>
                <div className="text-center mb-8 mt-2">
                  <h1 className="font-headline text-[32px] font-bold text-on-surface mb-2 leading-none">
                    Crear Cuenta
                  </h1>
                  <p className="font-body text-body-sm text-on-surface-variant">
                    Regístrate y recibe un 10% de descuento en tu primer amigurumi
                  </p>
                </div>

                {state && !state.success && (
                  <div className="bg-error-container text-error p-4 rounded-2xl mb-6 text-body-sm font-semibold border border-error/10 flex items-center gap-2 animate-fadeIn">
                    <MdErrorOutline className="text-lg shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-body" noValidate>
                  {/* Campo Nombre */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-body-sm font-bold text-on-surface-variant">
                      Nombre <span className="text-on-surface-variant/40 font-normal">(Opcional)</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        id="name"
                        {...register('name')}
                        placeholder="Ej. Elizabeth"
                        className={`block w-full rounded-2xl border p-4 text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all duration-200 ${
                          errors.name 
                            ? 'border-error bg-error/5 focus:ring-2 focus:ring-error' 
                            : (touchedFields.name || dirtyFields.name) && !errors.name
                            ? 'border-emerald-500/60 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-500'
                            : 'border-outline-variant/40 bg-surface-container-lowest focus:ring-2 focus:ring-secondary'
                        }`}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        {errors.name && <MdErrorOutline className="text-error text-lg" />}
                        {!errors.name && (touchedFields.name || dirtyFields.name) && <MdCheckCircle className="text-emerald-500 text-lg" />}
                      </div>
                    </div>
                    {errors.name && (
                      <p className="text-xs font-semibold text-error mt-1 flex items-center gap-1 animate-fadeIn">
                        <MdErrorOutline className="text-sm shrink-0" />
                        <span>{errors.name.message}</span>
                      </p>
                    )}
                  </div>

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
                        placeholder="lizi123@gmail.com"
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

                  {/* Campo Contraseña con Popover Flotante Inteligente */}
                  <div className="space-y-1.5 relative">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-body-sm font-bold text-on-surface-variant">
                        Contraseña
                      </label>
                      {isPasswordFullyValid && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded-full shadow-sm animate-fadeIn">
                          <MdCheckCircle className="text-white text-sm" />
                          Segura
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <input 
                        type="password" 
                        id="password"
                        {...register('password')}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        placeholder="••••••••"
                        className={`block w-full rounded-2xl border p-4 text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all duration-200 ${
                          errors.password 
                            ? 'border-error bg-error/5 focus:ring-2 focus:ring-error' 
                            : isPasswordFullyValid
                            ? 'border-emerald-500/60 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-500'
                            : 'border-outline-variant/40 bg-surface-container-lowest focus:ring-2 focus:ring-secondary'
                        }`}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        {errors.password && <MdErrorOutline className="text-error text-lg" />}
                        {isPasswordFullyValid && <MdCheckCircle className="text-emerald-500 text-lg" />}
                      </div>
                    </div>

                    {/* Popover Flotante Glassmorphism para Requisitos de Contraseña */}
                    {(isPasswordFocused || (passwordValue && !isPasswordFullyValid)) && (
                      <div className="lg:absolute lg:left-[102%] lg:-top-6 lg:w-64 w-full mt-2 lg:mt-0 p-4 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-xl border border-secondary/20 shadow-2xl z-40 transition-all duration-300 animate-fadeIn">
                        {/* Flechita orientadora hacia el input en Desktop */}
                        <div className="hidden lg:block absolute -left-2 top-9 w-4 h-4 bg-surface-container-lowest/95 border-l border-b border-secondary/20 rotate-45" />

                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-outline-variant/20">
                          <span className="text-[11px] font-bold text-on-surface flex items-center gap-1.5">
                            <MdShield className="text-secondary text-sm" />
                            Requisitos de Seguridad
                          </span>
                          {passwordValue && (
                            <span className={`text-[10px] font-bold ${strengthInfo.textCol}`}>
                              {strengthInfo.label}
                            </span>
                          )}
                        </div>

                        {/* Mini Barra de Seguridad */}
                        {passwordValue && (
                          <div className="h-1 w-full bg-outline-variant/20 rounded-full overflow-hidden flex gap-1 mb-2.5">
                            {Array.from({ length: 4 }).map((_, idx) => (
                              <div 
                                key={idx} 
                                className={`h-full flex-1 transition-all duration-300 rounded-full ${
                                  idx < metRequirementsCount ? strengthInfo.color : 'bg-transparent'
                                }`} 
                              />
                            ))}
                          </div>
                        )}

                        {/* Checklist Compacto */}
                        <div className="space-y-1 text-[11px]">
                          {passwordRequirements.map((req) => {
                            const isMet = req.test(passwordValue);
                            return (
                              <div 
                                key={req.id} 
                                className={`flex items-center gap-1.5 transition-colors duration-200 ${
                                  isMet ? 'text-emerald-600 font-semibold' : 'text-on-surface-variant/50'
                                }`}
                              >
                                {isMet ? (
                                  <MdCheckCircle className="text-emerald-500 text-xs shrink-0" />
                                ) : (
                                  <MdRadioButtonUnchecked className="text-on-surface-variant/30 text-xs shrink-0" />
                                )}
                                <span>{req.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full flex justify-center py-4 px-6 bg-secondary text-white font-bold rounded-full shadow-button hover:bg-secondary/90 transition-all duration-300 tactile-press active:scale-95 disabled:opacity-50 mt-8 text-body-md"
                  >
                    {isPending ? 'Registrando...' : 'Registrarse'}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center font-body">
                  <p className="text-body-sm text-on-surface-variant">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/auth/login" className="font-bold text-secondary hover:text-secondary/85 transition-colors">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
