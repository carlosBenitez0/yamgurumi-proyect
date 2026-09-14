import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/cart/CartDrawer";
import { getSession } from "@/src/lib/auth/session";
import { AuthProvider } from "@/src/lib/auth/auth-context";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  
  return (
    <AuthProvider
      session={{
        sub: session?.sub,
        email: session?.email,
        role: session?.role,
      }}
    >
      <Navbar session={session} />
      {children}
      <Footer />
      <CartDrawer />
    </AuthProvider>
  );
}
