"use client";

import { useQuery, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ProductList } from "@/components/orders/ProductList";
import { ParticipantList } from "@/components/orders/ParticipantList";
import { EditOrderModal } from "@/components/orders/EditOrderModal";
import { formatDate, formatDeadline } from "@/lib/formatters";
import Link from "next/link";
import { useState } from "react";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const order = useQuery(api.orders.getById, { id: id as Id<"orders"> });
  const items = useQuery(api.orderItems.listByOrder, { orderId: id as Id<"orders"> });
  const myItems = useQuery(api.orderItems.myItemsForOrder, { orderId: id as Id<"orders"> });
  const me = useQuery(api.users.getMe);
  const creator = useQuery(
    api.users.getById,
    order ? { id: order.createdBy } : "skip"
  );

  const upsertItem = useMutation(api.orderItems.upsertItem);
  const closeOrder = useMutation(api.orders.close);

  const [isClosing, setIsClosing] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // ── Loading skeleton ──────────────────────────────────────────────
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

  // ── Not found ─────────────────────────────────────────────────────
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
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
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
          {/* Edit button — only for owner */}
          {isOwner && (
            <button
              onClick={() => setShowEdit(true)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-blue-600"
              aria-label="Editar pedido"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          <span
            className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${
              isOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {isOpen ? "Abierto" : "Cerrado"}
          </span>
        </header>

        <div className="px-4 py-5 max-w-lg mx-auto space-y-6">

          {/* Order info card */}
          <div className="bg-white rounded-2xl border border-gray-200 px-4 py-4 space-y-3">
            {order.description && (
              <p className="text-sm text-gray-600">{order.description}</p>
            )}

            {/* Deadline */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">⏰ Cierre:</span>
              <span
                className={
                  isOpen && order.deadline - Date.now() < 86400000
                    ? "text-orange-500 font-medium"
                    : "text-gray-700"
                }
              >
                {isOpen ? formatDeadline(order.deadline) : formatDate(order.deadline)}
              </span>
            </div>

            {/* Creator info */}
            <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
              {creator?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={creator.imageUrl}
                  alt={creator.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                  {(creator?.name ?? "?")[0].toUpperCase()}
                </div>
              )}
              <div className="text-sm text-gray-500">
                Organiza{" "}
                <span className="font-medium text-gray-800">
                  {isOwner ? "vos" : (creator?.name ?? "...")}
                </span>
                {creator?.email && !isOwner && (
                  <a
                    href={`mailto:${creator.email}`}
                    className="ml-2 text-blue-500 text-xs underline underline-offset-2"
                  >
                    Contactar
                  </a>
                )}
              </div>
            </div>

            {/* Owner actions */}
            {isOwner && isOpen && (
              <button
                onClick={handleClose}
                disabled={isClosing}
                className="w-full border border-red-300 text-red-500 py-2.5 rounded-xl text-sm font-medium min-h-[44px] disabled:opacity-50"
              >
                {isClosing ? "Cerrando..." : "Cerrar pedido"}
              </button>
            )}

            {deadlinePassed && isOpen && (
              <p className="text-xs text-orange-500">
                ⚠️ El plazo venció, pero el pedido sigue abierto hasta que el organizador lo cierre.
              </p>
            )}
          </div>

          {/* Products */}
          <ProductList
            products={order.products}
            myItems={myItems ?? []}
            orderStatus={order.status}
            onQuantityChange={(productId, quantity) =>
              upsertItem({ orderId: id as Id<"orders">, productId, quantity })
            }
          />

          {/* Participants */}
          <ParticipantList items={items ?? []} products={order.products} />
        </div>
      </main>

      {/* Edit modal */}
      {showEdit && (
        <EditOrderModal
          order={order}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
}
