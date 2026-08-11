import * as React from 'react';
import { resend, emailFrom, appUrl } from './resend';
import { renderToStaticMarkup } from 'react-dom/server';
import WelcomeEmail from './templates/welcome';
import VerifyEmail from './templates/verify-email';
import ResetPasswordEmail from './templates/reset-password';
import OrderConfirmationEmail, { OrderEmailData } from './templates/order-confirmation';

export async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) {
  const { data, error } = await resend.emails.send({ from: emailFrom, to, subject, html, text });
  if (error) throw new Error(`Resend error: ${error.message}`);
  return data;
}

export async function sendWelcomeEmail(to: string, discountCode: string) {
  const html = renderToStaticMarkup(React.createElement(WelcomeEmail, { discountCode }));
  return sendEmail({ to, subject: '¡Bienvenido a la Comunidad Yamgurumi! 🧶', html });
}

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${appUrl}/auth/verify?token=${token}`;
  const html = renderToStaticMarkup(React.createElement(VerifyEmail, { verificationUrl: url }));
  return sendEmail({ to, subject: 'Verifica tu email en Yamgurumi', html });
}

export async function sendResetPasswordEmail(to: string, token: string) {
  const url = `${appUrl}/auth/reset-password?token=${token}`;
  const html = renderToStaticMarkup(React.createElement(ResetPasswordEmail, { resetUrl: url }));
  return sendEmail({ to, subject: 'Restablece tu contraseña en Yamgurumi', html });
}

export async function sendOrderConfirmationEmail(to: string, orderData: OrderEmailData) {
  const html = renderToStaticMarkup(React.createElement(OrderConfirmationEmail, { data: orderData }));
  return sendEmail({ to, subject: `Confirmación de pedido #${orderData.orderId.slice(0,8)} - Yamgurumi`, html });
}
