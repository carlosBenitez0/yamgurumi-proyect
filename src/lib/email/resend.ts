import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
export const emailFrom = process.env.EMAIL_FROM || 'Yamgurumi <onboarding@resend.dev>';
export const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
