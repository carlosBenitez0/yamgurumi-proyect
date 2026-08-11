import { Html, Head, Body, Container, Section, Text, Heading, Tailwind, Button } from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
  resetUrl: string;
}

export const ResetPasswordEmail = ({ resetUrl = 'http://localhost:3000/auth/reset-password?token=123' }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white my-10 mx-auto p-8 rounded-lg shadow-sm max-w-xl">
            <Heading className="text-2xl text-center text-pink-600 font-bold mb-4">
              Restablece tu contraseña
            </Heading>
            <Text className="text-gray-700 text-base mb-6 text-center">
              Hemos recibido una solicitud para cambiar la contraseña de tu cuenta en Yamgurumi. Haz click en el siguiente botón para continuar:
            </Text>
            <Section className="text-center mb-6">
              <Button
                href={resetUrl}
                className="bg-pink-600 text-white font-bold px-6 py-3 rounded-md"
              >
                Cambiar Contraseña
              </Button>
            </Section>
            <Text className="text-sm text-gray-500 text-center">
              Este enlace expira en 1 hora. Si no solicitaste este cambio, puedes ignorar este mensaje.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;
