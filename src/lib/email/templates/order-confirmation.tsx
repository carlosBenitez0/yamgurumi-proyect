import { Html, Head, Body, Container, Section, Text, Heading, Hr } from '@react-email/components';
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
  const emailData = data || {
    orderId: 'preview-123',
    items: [{ name: 'Oso Panda Amigurumi Tejido', qty: 1, price: 25.00 }],
    subtotal: 25.00,
    discount: 2.50,
    discountCode: 'YAM-WELCOME10',
    total: 22.50,
    delivery: { name: 'Usuario Prueba', phone: '+503 7000-0000', zone: 'San Salvador, El Salvador' }
  };

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F8F5F0', fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: '36px 12px' }}>
        <Container style={{ backgroundColor: '#FFFFFF', border: '1px solid #EBE4D8', borderRadius: '24px', margin: '0 auto', padding: '36px 28px', maxWidth: '520px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          
          {/* Header Badge */}
          <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#F4EDE2', border: '1px solid #E2D5C3', color: '#B85C43', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', padding: '6px 16px', borderRadius: '9999px', display: 'inline-block' }}>
              Pedido Recibido 🧶
            </span>
          </Section>

          {/* Title */}
          <Heading style={{ fontSize: '24px', fontWeight: '800', color: '#2A2421', textAlign: 'center', marginTop: '12px', marginBottom: '12px', lineHeight: '1.2' }}>
            ¡Gracias por tu pedido!
          </Heading>

          {/* Subtitle */}
          <Text style={{ fontSize: '14px', lineHeight: '1.6', color: '#574F4A', textAlign: 'center', margin: '0 0 24px 0' }}>
            Hola <strong style={{ color: '#2A2421' }}>{emailData.delivery.name}</strong>, hemos recibido tu solicitud de pedido <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#B85C43' }}>#{emailData.orderId.slice(0, 8)}</span>. Nos pondremos en contacto contigo por WhatsApp para coordinar la entrega.
          </Text>

          {/* Items Box */}
          <Section style={{ backgroundColor: '#FBF8F5', border: '1px solid #EBE4D8', borderRadius: '16px', padding: '18px 20px', marginBottom: '20px' }}>
            <Heading style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#2A2421', margin: '0 0 12px 0' }}>
              Resumen de tu pedido:
            </Heading>
            {emailData.items.map((item, i) => (
              <div key={i} style={{ borderBottom: '1px solid #EBE4D8', padding: '8px 0', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#574F4A', fontWeight: 500 }}>{item.qty}× {item.name}</span>
                <span style={{ color: '#2A2421', fontWeight: 'bold' }}>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </Section>

          {/* Totals */}
          <Section style={{ padding: '0 4px', marginBottom: '20px', fontSize: '13px' }}>
            <div style={{ padding: '4px 0', color: '#6E645E' }}>Subtotal: <strong>${emailData.subtotal.toFixed(2)}</strong></div>
            {emailData.discount > 0 && (
              <div style={{ padding: '4px 0', color: '#B85C43', fontWeight: 'bold' }}>
                Descuento ({emailData.discountCode || 'Promo'}): -${emailData.discount.toFixed(2)}
              </div>
            )}
            <Hr style={{ borderColor: '#EBE4D8', margin: '10px 0' }} />
            <div style={{ padding: '4px 0', color: '#206776', fontSize: '16px', fontWeight: 'bold' }}>
              Total: ${emailData.total.toFixed(2)}
            </div>
          </Section>

          {/* Delivery Box */}
          <Section style={{ backgroundColor: '#F4EDE2', border: '1px solid #E2D5C3', borderRadius: '16px', padding: '18px 20px', fontSize: '12px', color: '#574F4A' }}>
            <Heading style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#B85C43', margin: '0 0 8px 0' }}>
              Datos para la Entrega:
            </Heading>
            <p style={{ margin: '0 0 4px 0' }}><strong>Contacto:</strong> {emailData.delivery.name}</p>
            <p style={{ margin: '0 0 4px 0' }}><strong>Teléfono:</strong> {emailData.delivery.phone}</p>
            <p style={{ margin: '0 0 4px 0' }}><strong>Zona/Dirección:</strong> {emailData.delivery.zone}</p>
            {emailData.delivery.notes && (
              <p style={{ margin: '6px 0 0 0', fontStyle: 'italic', color: '#6E645E' }}><strong>Notas:</strong> {emailData.delivery.notes}</p>
            )}
          </Section>

          <Hr style={{ borderColor: '#EBE4D8', margin: '28px 0 20px 0' }} />

          {/* Footer */}
          <Text style={{ fontSize: '11px', color: '#A0958C', textAlign: 'center', margin: 0, lineHeight: '1.5' }}>
            © {new Date().getFullYear()} Yamgurumi. Todos los derechos reservados.
            <br />
            <strong style={{ color: '#6E645E', display: 'inline-block', marginTop: '6px' }}>
              Yamgurumi • Hecho a mano punto por punto con amor 🧶
            </strong>
          </Text>

        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;
