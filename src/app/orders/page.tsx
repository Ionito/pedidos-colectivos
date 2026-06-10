"use client";

import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { OrderList } from "@/components/orders/OrderList";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

type StatusFilter = "open" | "closed" | undefined;

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [filter, setFilter] = useState<StatusFilter>("open");
  // Skip the query until Convex has the auth token ready
  const orders = useQuery(
    api.orders.list,
    isAuthenticated ? { status: filter } : "skip"
  );

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-10" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 relative overflow-hidden"
            style={{ background: 'var(--teal)', fontFamily: 'var(--pc-font-display)', fontSize: '16px', fontWeight: 800, boxShadow: 'var(--sh-sm)' }}
          >
            PC
            <span className="absolute right-[-5px] bottom-[-5px] w-4 h-4 rounded-md" style={{ background: 'var(--amber)' }} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none" style={{ fontFamily: 'var(--pc-font-display)', color: 'var(--ink)' }}>Pedidos Colectivos</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Compras en grupo, sin caos</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/orders/new"
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] flex items-center gap-1"
          >
            <span>+</span> Nuevo
          </Link>
          <UserButton />
        </div>
      </header>

      <div className="px-4 py-5 max-w-2xl mx-auto">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { label: "Abiertos", value: "open" as StatusFilter },
            { label: "Cerrados", value: "closed" as StatusFilter },
            { label: "Todos", value: undefined as StatusFilter },
          ].map((tab) => (
            <button
              key={String(tab.value)}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors min-h-[40px] ${
                filter === tab.value
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <OrderList
          orders={orders}
          emptyMessage={
            filter === "open"
              ? "No hay pedidos abiertos. ¡Creá uno!"
              : filter === "closed"
              ? "No hay pedidos cerrados"
              : "No hay pedidos todavía"
          }
        />
      </div>
    </main>
  );
}
