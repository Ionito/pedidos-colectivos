"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { OrderList } from "@/components/orders/OrderList";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

type StatusFilter = "open" | "closed" | undefined;

export default function OrdersPage() {
  const [filter, setFilter] = useState<StatusFilter>("open");
  const orders = useQuery(api.orders.list, { status: filter });

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-blue-600 leading-none">PC</h1>
          <p className="text-xs text-gray-400">Pedidos Colectivos</p>
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

      <div className="px-4 py-5 max-w-lg mx-auto">
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
