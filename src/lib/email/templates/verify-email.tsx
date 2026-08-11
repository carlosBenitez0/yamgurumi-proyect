import { Html, Head, Body, Container, Section, Text, Heading, Tailwind, Button } from '@react-email/components';
import * as React from 'react';

interface VerifyEmailProps {
  verificationUrl: string;
}

export const VerifyEmail = ({ verificationUrl = 'http://localhost:3000/auth/verify?token=123' }: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white my-10 mx-auto p-8 rounded-lg shadow-sm max-w-xl">
            <Heading className="text-2xl text-center text-pink-600 font-bold mb-4">
              Verifica tu email
            </Heading>
            <Text className="text-gray-700 text-base mb-6 text-center">
              Gracias por unirte a Yamgurumi. Por favor haz click en el botón de abajo para verificar tu cuenta de correo electrónico.
            </Text>
            <Section className="text-center mb-6">
              <Button
                href={verificationUrl}
                className="bg-pink-600 text-white font-bold px-6 py-3 rounded-md"
              >
                Verificar cuenta
              </Button>
            </Section>
            <Text className="text-sm text-gray-500 text-center">
              Si no solicitaste crear una cuenta en Yamgurumi, puedes ignorar este correo.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyEmail;
