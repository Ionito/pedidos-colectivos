"use client";

// Feed público de pedidos abiertos.
// Antes era la home ("/"). Ahora la home es la landing y este feed vive en "/explorar".
// (Movido tal cual desde src/app/page.tsx — sólo cambió el nombre del componente
//  y la profundidad del import de convex.)

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { OrderList } from "@/components/orders/OrderList";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function ExplorarPage() {
  const orders = useQuery(api.orders.listOpen);
  const { isSignedIn } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center sticky top-0 z-10" style={{ borderColor: 'var(--line)' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white relative overflow-hidden shrink-0"
            style={{ background: 'var(--teal)', fontFamily: 'var(--pc-font-display)', fontSize: '16px', fontWeight: 800, boxShadow: 'var(--sh-sm)' }}
          >
            PC
            <span className="absolute right-[-5px] bottom-[-5px] w-4 h-4 rounded-md" style={{ background: 'var(--amber)' }} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none" style={{ fontFamily: 'var(--pc-font-display)', color: 'var(--ink)' }}>Pedidos Colectivos</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Compras en grupo, sin caos</p>
          </div>
        </Link>

        {!isSignedIn && (
          <Link
            href="/sign-in"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] flex items-center"
          >
            Ingresar
          </Link>
        )}

        {isSignedIn && (
          <div className="flex items-center gap-3">
            <Link href="/orders" className="text-sm text-blue-600 font-medium">
              Mis pedidos
            </Link>
            <UserButton />
          </div>
        )}
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Pedidos abiertos
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sumarte a una compra colectiva es fácil
          </p>
        </div>

        <OrderList
          orders={orders}
          emptyMessage="No hay pedidos abiertos por ahora"
        />

        {!isSignedIn && (
          <div className="mt-8 bg-blue-50 rounded-2xl p-5 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Ingresá para sumarte a pedidos o crear el tuyo
            </p>
            <Link
              href="/sign-in"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold min-h-[44px]"
            >
              Ingresar con Google o Facebook
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
