"use client";

import { formatCurrency } from "@/lib/formatters";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

interface User {
  _id: string;
  name: string;
  imageUrl?: string;
}

interface ItemWithUser {
  _id: string;
  productId: string;
  quantity: number;
  userId: string;
  user: User | null;
}

interface Product {
  id: string;
  title: string;
  price: number;
  unit: string;
}

interface Props {
  items: ItemWithUser[];
  products: Product[];
  meId?: string;
  orderId?: string;
}

export function ParticipantList({ items, products, meId, orderId }: Props) {
  const removeItem = useMutation(api.orderItems.removeItem);
  const removeUserItems = useMutation(api.orderItems.removeUserItems);

  const productMap: Record<string, Product> = {};
  for (const p of products) {
    productMap[p.id] = p;
  }

  // Group items by userId
  const byUser: Record<string, { user: User | null; items: ItemWithUser[] }> =
    {};
  for (const item of items) {
    const key = item.userId;
    if (!byUser[key]) {
      byUser[key] = { user: item.user, items: [] };
    }
    byUser[key].items.push(item);
  }

  const participants = Object.values(byUser);

  if (participants.length === 0) {
    return (
      <section>
        <h2 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Participantes
        </h2>
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">👥</p>
          <p className="text-sm">Nadie se sumó todavía</p>
        </div>
      </section>
    );
  }

  async function handleRemoveItem(itemId: string) {
    if (!confirm("¿Eliminar este ítem del pedido?")) return;
    await removeItem({ itemId: itemId as Id<"orderItems"> });
  }

  async function handleRemoveUserItems(userId: string, userName: string) {
    if (!confirm(`¿Borrar todo el pedido de ${userName}? Esta acción es permanente.`)) return;
    await removeUserItems({
      orderId: orderId as Id<"orders">,
      userId: userId as Id<"users">,
    });
  }

  return (
    <section>
      <h2 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        Participantes ({participants.length})
      </h2>
      <div className="space-y-3">
        {participants.map(({ user, items: userItems }) => {
          const total = userItems.reduce((sum, item) => {
            const product = productMap[item.productId];
            return sum + (product ? product.price * item.quantity : 0);
          }, 0);

          const userId = user?._id ?? userItems[0].userId;
          const userName = user?.name ?? "Usuario";

          return (
            <div
              key={userId}
              className="bg-white rounded-2xl border border-gray-200 px-4 py-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {user?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.imageUrl}
                      alt={userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {userName[0].toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-gray-900 text-sm">
                    {userName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {meId === userId && orderId && (
                    <button
                      onClick={() => handleRemoveUserItems(userId, userName)}
                      className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 rounded-lg px-2 py-0.5 transition-colors"
                    >
                      Borrar pedido
                    </button>
                  )}
                  <span className="text-sm font-semibold text-blue-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <div className="space-y-1 pl-10">
                {userItems.map((item) => {
                  const product = productMap[item.productId];
                  if (!product) return null;
                  return (
                    <div
                      key={item._id}
                      className="flex items-center justify-between text-xs text-gray-500"
                    >
                      <span className="truncate flex-1 mr-2">
                        {product.title}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span>
                          x{item.quantity} ·{" "}
                          {formatCurrency(product.price * item.quantity)}
                        </span>
                        {meId === item.userId && (
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-300 hover:text-red-500 transition-colors"
                            aria-label={`Eliminar ${product.title}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
