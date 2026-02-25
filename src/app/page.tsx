"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { OrderList } from "@/components/orders/OrderList";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  const orders = useQuery(api.orders.listOpen);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-blue-600 leading-none">PCA</h1>
          <p className="text-xs text-gray-400">Pedidos Colectivos Angiru</p>
        </div>

        <SignedOut>
          <Link
            href="/sign-in"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] flex items-center"
          >
            Ingresar
          </Link>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-3">
            <Link href="/orders" className="text-sm text-blue-600 font-medium">
              Mis pedidos
            </Link>
            <UserButton />
          </div>
        </SignedIn>
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

        <SignedOut>
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
        </SignedOut>
      </div>
    </main>
  );
}
