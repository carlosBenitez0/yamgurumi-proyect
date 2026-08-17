import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Panel de Administración | Yamgurumi',
  description: 'Gestión de productos, categorías, pedidos, cupones y configuraciones de Yamgurumi.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-800 font-body flex flex-col lg:flex-row antialiased selection:bg-amber-200 selection:text-stone-900">
      {/* BARRA LATERAL (ASIDE) */}
      <AdminSidebar />

      {/* ÁREA DE CONTENIDO A LA DERECHA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER SUPERIOR */}
        <AdminHeader />

        {/* PÁGINA PRINCIPAL / CONTENIDO DINÁMICO */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#faf7f2] overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
