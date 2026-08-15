'use client';

import { resetPasswordAction } from '@/src/actions/auth/reset-password';
import { resetPasswordSchema, ResetPasswordFormData } from '@/src/lib/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, startTransition, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { MdCheckCircle, MdErrorOutline, MdRadioButtonUnchecked } from 'react-icons/md';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, isPending] = useActionState(resetPasswordAction, null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const passwordValue = watch('password') || '';
  const confirmPasswordValue = watch('confirmPassword') || '';

  const passwordRequirements = useMemo(() => [
    { id: 'length', label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
    { id: 'number', label: 'Al menos un número (0-9)', test: (p: string) => /[0-9]/.test(p) },
    { id: 'uppercase', label: 'Al menos una mayúscula (A-Z)', test: (p: string) => /[A-Z]/.test(p) },
    { id: 'symbol', label: 'Al menos un símbolo (@, #, $, etc.)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ], []);

  const onSubmit = (data: ResetPasswordFormData) => {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <>
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
        <input type="hidden" name="token" value={token} />
        
        {/* Nueva Contraseña */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-body-sm font-bold text-on-surface-variant">
            Nueva Contraseña
          </label>
          <div className="relative">
            <input 
              type="password" 
              id="password"
              {...register('password')}
              placeholder="Ingresa tu nueva contraseña"
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

          {/* Requisitos de contraseña */}
          <div className="bg-surface-container-low/60 p-3.5 rounded-2xl border border-outline-variant/20 space-y-2 mt-2">
            <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider mb-1">
              Requisitos de la contraseña:
            </p>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {passwordRequirements.map((req) => {
                const isMet = req.test(passwordValue);
                return (
                  <div 
                    key={req.id} 
                    className={`flex items-center gap-2 transition-colors duration-200 ${
                      isMet ? 'text-emerald-600 font-semibold' : 'text-on-surface-variant/50'
                    }`}
                  >
                    {isMet ? (
                      <MdCheckCircle className="text-emerald-500 text-sm shrink-0" />
                    ) : (
                      <MdRadioButtonUnchecked className="text-on-surface-variant/30 text-sm shrink-0" />
                    )}
                    <span>{req.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Confirmar Contraseña */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-body-sm font-bold text-on-surface-variant">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <input 
              type="password" 
              id="confirmPassword"
              {...register('confirmPassword')}
              placeholder="Repite tu nueva contraseña"
              className={`block w-full rounded-2xl border p-4 text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all duration-200 ${
                errors.confirmPassword 
                  ? 'border-error bg-error/5 focus:ring-2 focus:ring-error' 
                  : confirmPasswordValue && !errors.confirmPassword
                  ? 'border-emerald-500/60 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-500'
                  : 'border-outline-variant/40 bg-surface-container-lowest focus:ring-2 focus:ring-secondary'
              }`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              {errors.confirmPassword && <MdErrorOutline className="text-error text-lg" />}
              {confirmPasswordValue && !errors.confirmPassword && <MdCheckCircle className="text-emerald-500 text-lg" />}
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs font-semibold text-error mt-1 flex items-center gap-1 animate-fadeIn">
              <MdErrorOutline className="text-sm shrink-0" />
              <span>{errors.confirmPassword.message}</span>
            </p>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full flex justify-center py-4 px-6 bg-secondary text-white font-bold rounded-full shadow-button hover:bg-secondary/90 transition-all duration-300 tactile-press active:scale-95 text-body-md mt-8 disabled:opacity-50"
        >
          {isPending ? 'Guardando...' : 'Guardar Contraseña'}
        </button>
      </form>
    </>
  );
}
