import { Html, Head, Body, Container, Section, Text, Heading, Button, Hr } from '@react-email/components';
import * as React from 'react';

interface VerifyEmailProps {
  verificationUrl: string;
}

export const VerifyEmail = ({ verificationUrl = 'http://localhost:3000/auth/verify?token=123' }: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F8F5F0', fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: '36px 12px' }}>
        <Container style={{ backgroundColor: '#FFFFFF', border: '1px solid #EBE4D8', borderRadius: '24px', margin: '0 auto', padding: '36px 28px', maxWidth: '520px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          
          {/* Header Badge */}
          <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#F4EDE2', border: '1px solid #E2D5C3', color: '#B85C43', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', padding: '6px 16px', borderRadius: '9999px', display: 'inline-block' }}>
              Taller Yamgurumi 🧶
            </span>
          </Section>

          {/* Title */}
          <Heading style={{ fontSize: '24px', fontWeight: '800', color: '#2A2421', textAlign: 'center', marginTop: '12px', marginBottom: '12px', lineHeight: '1.2' }}>
            ¡Verifica tu correo electrónico!
          </Heading>

          {/* Subtitle */}
          <Text style={{ fontSize: '14px', lineHeight: '1.6', color: '#574F4A', textAlign: 'center', margin: '0 0 24px 0' }}>
            Gracias por unirte a nuestra comunidad. Para comenzar a tejer historias y acceder a tu cuenta, haz clic en el botón de abajo para confirmar tu correo.
          </Text>

          {/* Action Button */}
          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Button
              href={verificationUrl}
              style={{ backgroundColor: '#206776', color: '#FFFFFF', fontSize: '15px', fontWeight: 'bold', textDecoration: 'none', padding: '16px 36px', borderRadius: '9999px', textAlign: 'center', display: 'inline-block', boxShadow: '0 4px 14px rgba(32, 103, 118, 0.25)' }}
            >
              Verificar mi Cuenta
            </Button>
          </Section>

          {/* Backup Link Box */}
          <Section style={{ backgroundColor: '#FBF9F5', border: '1px solid #EBE4D8', borderRadius: '12px', padding: '14px 16px', marginTop: '24px', textAlign: 'center' }}>
            <Text style={{ fontSize: '11px', color: '#8C827A', margin: '0 0 6px 0' }}>
              Si el botón no funciona, copia y pega este enlace en tu navegador:
            </Text>
            <a href={verificationUrl} style={{ fontSize: '11px', color: '#206776', wordBreak: 'break-all', textDecoration: 'underline' }}>
              {verificationUrl}
            </a>
          </Section>

          <Hr style={{ borderColor: '#EBE4D8', margin: '28px 0 20px 0' }} />

          {/* Footer */}
          <Text style={{ fontSize: '11px', color: '#A0958C', textAlign: 'center', margin: 0, lineHeight: '1.5' }}>
            Si no solicitaste esta cuenta en Yamgurumi, puedes ignorar este mensaje de forma segura.
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

export default VerifyEmail;
