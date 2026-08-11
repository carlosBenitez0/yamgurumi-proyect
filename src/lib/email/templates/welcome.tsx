import { Html, Head, Body, Container, Section, Text, Heading, Tailwind, Button } from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  discountCode: string;
}

export const WelcomeEmail = ({ discountCode = 'WELCOME-123' }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white my-10 mx-auto p-8 rounded-lg shadow-sm max-w-xl">
            <Heading className="text-2xl text-center text-pink-600 font-bold mb-4">
              ¡Bienvenido a la Comunidad Yamgurumi! 🧶
            </Heading>
            <Text className="text-gray-700 text-base mb-4">
              Hola, qué alegría tenerte aquí. Prepárate para descubrir los amigurumis más adorables y tejidos con mucho amor.
            </Text>
            <Section className="bg-pink-50 p-6 rounded-md text-center mb-6">
              <Text className="text-sm text-pink-800 mb-2">Aquí tienes tu código de descuento del 10% para tu primera compra:</Text>
              <Text className="text-2xl font-mono font-bold text-pink-900 tracking-wider">
                {discountCode}
              </Text>
            </Section>
            <Section className="text-center">
              <Button
                href="https://yamgurumi.com/tienda"
                className="bg-pink-600 text-white font-bold px-6 py-3 rounded-md"
              >
                Ir a la tienda
              </Button>
            </Section>
            <Text className="text-xs text-gray-400 mt-8 text-center">
              © {new Date().getFullYear()} Yamgurumi. Todos los derechos reservados.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
