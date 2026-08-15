import { Html, Head, Body, Container, Section, Text, Heading, Button, Hr } from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  discountCode: string;
}

export const WelcomeEmail = ({ discountCode = 'YAM-WELCOME10' }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F8F5F0', fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: '36px 12px' }}>
        <Container style={{ backgroundColor: '#FFFFFF', border: '1px solid #EBE4D8', borderRadius: '24px', margin: '0 auto', padding: '36px 28px', maxWidth: '520px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          
          {/* Header Badge */}
          <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#F4EDE2', border: '1px solid #E2D5C3', color: '#B85C43', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', padding: '6px 16px', borderRadius: '9999px', display: 'inline-block' }}>
              ¡Bienvenido a la Familia! 🧶
            </span>
          </Section>

          {/* Title */}
          <Heading style={{ fontSize: '24px', fontWeight: '800', color: '#2A2421', textAlign: 'center', marginTop: '12px', marginBottom: '12px', lineHeight: '1.2' }}>
            ¡Qué alegría tenerte con nosotros!
          </Heading>

          {/* Subtitle */}
          <Text style={{ fontSize: '14px', lineHeight: '1.6', color: '#574F4A', textAlign: 'center', margin: '0 0 24px 0' }}>
            En Yamgurumi cada personaje está tejido a mano punto por punto con muchísimo amor y dedicación. Queremos celebrar tu llegada con un regalo especial.
          </Text>

          {/* Discount Box */}
          <Section style={{ backgroundColor: '#F4EDE2', border: '1px solid #E2D5C3', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '24px' }}>
            <Text style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#B85C43', margin: '0 0 6px 0' }}>
              Tu regalo de bienvenida (10% OFF)
            </Text>
            <Text style={{ fontSize: '28px', fontFamily: 'monospace', fontWeight: 'bold', color: '#2A2421', letterSpacing: '3px', margin: '6px 0' }}>
              {discountCode}
            </Text>
            <Text style={{ fontSize: '11px', color: '#6E645E', margin: 0 }}>
              Úsalo al finalizar tu primera compra en el carrito
            </Text>
          </Section>

          {/* Action Button */}
          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button
              href="http://localhost:3000/catalog"
              style={{ backgroundColor: '#206776', color: '#FFFFFF', fontSize: '15px', fontWeight: 'bold', textDecoration: 'none', padding: '16px 36px', borderRadius: '9999px', textAlign: 'center', display: 'inline-block', boxShadow: '0 4px 14px rgba(32, 103, 118, 0.25)' }}
            >
              Explorar Catálogo
            </Button>
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

export default WelcomeEmail;
