import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/cart/CartDrawer";
import { getSession } from "@/src/lib/auth/session";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  
  return (
    <>
      <Navbar session={session} />
      {children}
      <Footer />
      <CartDrawer />
    </>
  );
}
