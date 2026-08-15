import * as React from 'react';
import { resend, emailFrom, appUrl } from './resend';
import { render } from '@react-email/components';
import WelcomeEmail from './templates/welcome';
import VerifyEmail from './templates/verify-email';
import ResetPasswordEmail from './templates/reset-password';
import OrderConfirmationEmail, { OrderEmailData } from './templates/order-confirmation';

export async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) {
  const { data, error } = await resend.emails.send({ from: emailFrom, to, subject, html, text });
  if (error) {
    console.error(`[Resend Error] ${error.name}: ${error.message}`);
    throw new Error(`Resend error: ${error.message}`);
  }
  return data;
}

export async function sendWelcomeEmail(to: string, discountCode: string) {
  try {
    const html = await render(React.createElement(WelcomeEmail, { discountCode }));
    return await sendEmail({ to, subject: '¡Bienvenido a la Comunidad Yamgurumi! 🧶', html });
  } catch (err: any) {
    console.warn(`⚠️ [Welcome Email] Error enviando correo vía Resend (${err?.message || err}).`);
  }
}

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${appUrl}/auth/verify?token=${token}`;
  console.log(`\n======================================================`);
  console.log(`✉️ [VERIFICACIÓN] ENLACE PARA: ${to}`);
  console.log(`🔗 ${url}`);
  console.log(`======================================================\n`);

  const html = await render(React.createElement(VerifyEmail, { verificationUrl: url }));
  return await sendEmail({ to, subject: 'Verifica tu email en Yamgurumi 🧶', html });
}

export async function sendResetPasswordEmail(to: string, token: string) {
  const url = `${appUrl}/auth/reset-password?token=${token}`;
  console.log(`\n======================================================`);
  console.log(`✉️ [RECUPERACIÓN] ENLACE PARA: ${to}`);
  console.log(`🔗 ${url}`);
  console.log(`======================================================\n`);

  const html = await render(React.createElement(ResetPasswordEmail, { resetUrl: url }));
  return await sendEmail({ to, subject: 'Restablece tu contraseña en Yamgurumi 🔒', html });
}

export async function sendOrderConfirmationEmail(to: string, orderData: OrderEmailData) {
  try {
    const html = await render(React.createElement(OrderConfirmationEmail, { data: orderData }));
    return await sendEmail({ to, subject: `Confirmación de pedido #${orderData.orderId.slice(0,8)} - Yamgurumi 🛍️`, html });
  } catch (err: any) {
    console.warn(`⚠️ [Order Confirmation] Error enviando correo vía Resend (${err?.message || err}).`);
  }
}
