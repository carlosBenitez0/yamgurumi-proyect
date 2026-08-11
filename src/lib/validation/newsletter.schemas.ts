import { z } from 'zod';

export const subscribeSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  website: z.string().optional().refine((v) => !v || v === '', 'Spam detectado'),
});
