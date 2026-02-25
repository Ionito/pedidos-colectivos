"use client";

import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ProductList } from "@/components/orders/ProductList";
import { ParticipantList } from "@/components/orders/ParticipantList";
import { formatDate, formatDeadline } from "@/lib/formatters";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user: clerkUser } = useUser();

  const order = useQuery(api.orders.getById, { id: id as Id<"orders"> });
  const items = useQuery(api.orderItems.listByOrder, {
    orderId: id as Id<"orders">,
  });
  const myItems = useQuery(api.orderItems.myItemsForOrder, {
    orderId: id as Id<"orders">,
  });
  const me = useQuery(api.users.getMe);

  const upsertItem = useMutation(api.orderItems.upsertItem);
  const closeOrder = useMutation(api.orders.close);

  const [isClosing, setIsClosing] = useState(false);

  if (order === undefined) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-4 py-4 flex items-center gap-3">
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </header>
        <div className="px-4 py-6 max-w-lg mx-auto space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (order === null) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-4xl mb-3">❓</p>
          <p className="text-gray-500">Pedido no encontrado</p>
          <Link href="/orders" className="text-blue-600 text-sm mt-3 inline-block">
            Volver a pedidos
          </Link>
        </div>
      </main>
    );
  }

  const isOwner = me && order.createdBy === me._id;
  const isOpen = order.status === "open";
  const deadlinePassed = order.deadline < Date.now();

  async function handleClose() {
    if (!confirm("¿Cerrar este pedido? Ya no se podrán sumar más personas.")) return;
    setIsClosing(true);
    try {
      await closeOrder({ id: id as Id<"orders"> });
    } finally {
      setIsClosing(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link
          href="/orders"
          className="text-gray-500 min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2"
          aria-label="Volver"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {order.title}
          </h1>
        </div>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${
            isOpen
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {isOpen ? "Abierto" : "Cerrado"}
        </span>
      </header>

      <div className="px-4 py-5 max-w-lg mx-auto space-y-6">
        {/* Order info */}
        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-4 space-y-2">
          {order.description && (
            <p className="text-sm text-gray-600">{order.description}</p>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Cierre:</span>
            <span
              className={
                isOpen && order.deadline - Date.now() < 86400000
                  ? "text-orange-500 font-medium"
                  : "text-gray-600"
              }
            >
              {isOpen ? formatDeadline(order.deadline) : formatDate(order.deadline)}
            </span>
          </div>

          {isOwner && isOpen && (
            <button
              onClick={handleClose}
              disabled={isClosing}
              className="mt-2 w-full border border-red-300 text-red-500 py-2 rounded-xl text-sm font-medium min-h-[44px] disabled:opacity-50"
            >
              {isClosing ? "Cerrando..." : "Cerrar pedido"}
            </button>
          )}

          {deadlinePassed && isOpen && (
            <p className="text-xs text-orange-500">
              ⚠️ El plazo venció, pero el pedido sigue abierto hasta que el creador lo cierre.
            </p>
          )}
        </div>

        {/* Products */}
        <ProductList
          products={order.products}
          myItems={myItems ?? []}
          orderStatus={order.status}
          onQuantityChange={(productId, quantity) =>
            upsertItem({
              orderId: id as Id<"orders">,
              productId,
              quantity,
            })
          }
        />

        {/* Participants */}
        <ParticipantList items={items ?? []} products={order.products} />
      </div>
    </main>
  );
}
