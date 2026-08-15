import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .optional()
    .refine((val) => !val || val.trim().length >= 2, {
      message: 'El nombre debe tener al menos 2 caracteres',
    }),
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[0-9]/, 'Debe incluir al menos un número')
    .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
    .regex(/[^A-Za-z0-9]/, 'Debe incluir al menos un símbolo especial'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const resetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido'),
});

export type ResetRequestFormData = z.infer<typeof resetRequestSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[0-9]/, 'Debe incluir al menos un número')
      .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
      .regex(/[^A-Za-z0-9]/, 'Debe incluir al menos un símbolo especial'),
    confirmPassword: z
      .string()
      .min(1, 'Confirma tu nueva contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
