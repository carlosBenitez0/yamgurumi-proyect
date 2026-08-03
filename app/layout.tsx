import type { Metadata } from "next";
import { Comfortaa, Manrope } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/cart/CartDrawer";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-comfortaa",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Yamgurumi | Hecho a mano, tejido con amor",
  description:
    "Descubre nuestra colección de amigurumis artesanales, diseñados con hilos de primera calidad y rellenos de pura ternura para acompañar tus mejores momentos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${comfortaa.variable} ${manrope.variable}`}
    >
      <head>
      </head>
      <body className="bg-background text-on-surface antialiased overflow-x-hidden w-full">
        <Navbar />
        {children}
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
