import { Html, Head, Body, Container, Section, Text, Heading, Tailwind, Hr } from '@react-email/components';
import * as React from 'react';

export interface OrderEmailData {
  orderId: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  total: number;
  delivery: { name: string; phone: string; zone: string; notes?: string };
}

interface OrderConfirmationEmailProps {
  data: OrderEmailData;
}

export const OrderConfirmationEmail = ({ data }: OrderConfirmationEmailProps) => {
  // Default data for preview if not provided
  const emailData = data || {
    orderId: 'preview-123',
    items: [{ name: 'Amigurumi de prueba', qty: 1, price: 10 }],
    subtotal: 10,
    discount: 0,
    total: 10,
    delivery: { name: 'Usuario Prueba', phone: '12345678', zone: 'Centro' }
  };

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white my-10 mx-auto p-8 rounded-lg shadow-sm max-w-xl">
            <Heading className="text-2xl text-center text-pink-600 font-bold mb-4">
              ¡Gracias por tu pedido!
            </Heading>
            <Text className="text-gray-700 text-base mb-6">
              Hola {emailData.delivery.name}, hemos recibido tu pedido #{emailData.orderId.slice(0, 8)} y ya nos pondremos en contacto contigo por WhatsApp para coordinar la entrega.
            </Text>
            
            <Heading className="text-lg text-gray-800 font-bold mb-3">Resumen de tu pedido:</Heading>
            <Section className="mb-6">
              {emailData.items.map((item, i) => (
                <Text key={i} className="text-gray-700 my-1">
                  • {item.qty}× {item.name} — ${(item.price * item.qty).toFixed(2)}
                </Text>
              ))}
            </Section>
            
            <Hr className="border-gray-200 my-4" />
            
            <Section className="mb-6">
              <Text className="text-gray-700 my-1">Subtotal: ${emailData.subtotal.toFixed(2)}</Text>
              {emailData.discount > 0 && (
                <Text className="text-pink-600 my-1">
                  Descuento ({emailData.discountCode || 'Código'}): -${emailData.discount.toFixed(2)}
                </Text>
              )}
              <Text className="text-gray-900 font-bold text-lg my-1">Total: ${emailData.total.toFixed(2)}</Text>
            </Section>
            
            <Hr className="border-gray-200 my-4" />
            
            <Heading className="text-lg text-gray-800 font-bold mb-3">Datos de entrega:</Heading>
            <Section className="text-gray-600 text-sm bg-gray-50 p-4 rounded-md">
              <Text className="m-0 mb-1"><strong>Nombre:</strong> {emailData.delivery.name}</Text>
              <Text className="m-0 mb-1"><strong>Teléfono:</strong> {emailData.delivery.phone}</Text>
              <Text className="m-0 mb-1"><strong>Zona:</strong> {emailData.delivery.zone}</Text>
              {emailData.delivery.notes && (
                <Text className="m-0 mt-2"><strong>Notas:</strong> {emailData.delivery.notes}</Text>
              )}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrderConfirmationEmail;
