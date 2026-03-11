"use client";

import { formatCurrency } from "@/lib/formatters";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useState, useEffect } from "react";

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
  unavailable?: boolean;
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
  isOwner?: boolean;
  orderId?: string;
}

interface ModalTarget {
  userId: string;
  userName: string;
  currentItems: ItemWithUser[];
}

// ── Modal para que el owner agregue productos a un participante ───────────────
function AddProductModal({
  target,
  products,
  orderId,
  onClose,
}: {
  target: ModalTarget;
  products: Product[];
  orderId: string;
  onClose: () => void;
}) {
  const upsertItemForUser = useMutation(api.orderItems.upsertItemForUser);

  // Inicializar cantidades con las existentes del usuario
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const item of target.currentItems) {
      init[item.productId] = item.quantity;
    }
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Cerrar con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function setQty(productId: string, delta: number) {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] ?? 0) + delta),
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Determinar cantidades originales para saber cuáles cambiaron
      const original: Record<string, number> = {};
      for (const item of target.currentItems) {
        original[item.productId] = item.quantity;
      }

      const calls: Promise<unknown>[] = [];
      for (const product of products) {
        const newQty = quantities[product.id] ?? 0;
        const oldQty = original[product.id] ?? 0;
        if (newQty !== oldQty) {
          calls.push(
            upsertItemForUser({
              orderId: orderId as Id<"orders">,
              userId: target.userId as Id<"users">,
              productId: product.id,
              quantity: newQty,
            })
          );
        }
      }
      await Promise.all(calls);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const hasChanges = products.some((p) => {
    const original = target.currentItems.find((i) => i.productId === p.id)?.quantity ?? 0;
    return (quantities[p.id] ?? 0) !== original;
  });

  const filteredProducts = search.trim()
    ? products.filter((p) =>
        p.title.toLowerCase().includes(search.trim().toLowerCase())
      )
    : products;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Sheet */}
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Agregar productos</p>
            <p className="font-semibold text-gray-900 text-sm mt-0.5">{target.userName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Buscador */}
        <div className="px-4 py-2 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
              autoFocus
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            )}
          </div>
        </div>

        {/* Lista de productos */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          {filteredProducts.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-6">Sin resultados</p>
          )}
          {filteredProducts.map((product) => {
            const qty = quantities[product.id] ?? 0;
            return (
              <div
                key={product.id}
                className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                  <p className="text-xs text-gray-400">{formatCurrency(product.price)} / {product.unit}</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setQty(product.id, -1)}
                    disabled={qty === 0}
                    className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </button>
                  <span className={`w-6 text-center text-sm font-semibold ${qty > 0 ? "text-blue-600" : "text-gray-300"}`}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(product.id, +1)}
                    className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 shrink-0">
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export function ParticipantList({ items, products, meId, isOwner, orderId }: Props) {
  const removeItem = useMutation(api.orderItems.removeItem);
  const removeUserItems = useMutation(api.orderItems.removeUserItems);
  const setItemUnavailable = useMutation(api.orderItems.setItemUnavailable);

  const [modalTarget, setModalTarget] = useState<ModalTarget | null>(null);

  const productMap: Record<string, Product> = {};
  for (const p of products) {
    productMap[p.id] = p;
  }

  // Group items by userId
  const byUser: Record<string, { user: User | null; items: ItemWithUser[] }> = {};
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

  async function handleToggleUnavailable(itemId: string, current: boolean) {
    await setItemUnavailable({
      itemId: itemId as Id<"orderItems">,
      unavailable: !current,
    });
  }

  return (
    <>
      <section>
        <h2 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Participantes ({participants.length})
        </h2>
        <div className="space-y-3">
          {participants.map(({ user, items: userItems }) => {
            const userId = user?._id ?? userItems[0].userId;
            const userName = user?.name ?? "Usuario";
            const isSelf = meId === userId;
            const canDeleteOrder = isOwner || isSelf;

            // Total excluye ítems no disponibles
            const total = userItems.reduce((sum, item) => {
              if (item.unavailable) return sum;
              const product = productMap[item.productId];
              return sum + (product ? product.price * item.quantity : 0);
            }, 0);

            return (
              <div
                key={userId}
                className="bg-white rounded-2xl border border-gray-200 px-4 py-3"
              >
                {/* Encabezado del participante */}
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
                    {/* Botón agregar producto — solo owner */}
                    {isOwner && orderId && (
                      <button
                        onClick={() =>
                          setModalTarget({ userId, userName, currentItems: userItems })
                        }
                        className="text-xs text-blue-500 hover:text-blue-700 border border-blue-200 hover:border-blue-400 rounded-lg px-2 py-0.5 transition-colors"
                      >
                        + Agregar
                      </button>
                    )}
                    {canDeleteOrder && orderId && (
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

                {/* Ítems del participante */}
                <div className="space-y-1 pl-10">
                  {userItems.map((item) => {
                    const product = productMap[item.productId];
                    if (!product) return null;
                    const isUnavailable = !!item.unavailable;

                    return (
                      <div
                        key={item._id}
                        className="flex items-center justify-between text-xs text-gray-500"
                      >
                        <span className={`truncate flex-1 mr-2 ${isUnavailable ? "line-through text-gray-300" : ""}`}>
                          {product.title}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={isUnavailable ? "line-through text-gray-300" : ""}>
                            x{item.quantity} · {formatCurrency(product.price * item.quantity)}
                          </span>

                          {/* Botón "no disponible" — solo owner del pedido */}
                          {isOwner && (
                            <button
                              onClick={() => handleToggleUnavailable(item._id, isUnavailable)}
                              className={`transition-colors rounded ${
                                isUnavailable
                                  ? "text-orange-400 hover:text-orange-600"
                                  : "text-gray-300 hover:text-orange-400"
                              }`}
                              title={isUnavailable ? "Marcar como disponible" : "Marcar como no disponible"}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                              </svg>
                            </button>
                          )}

                          {/* Tacho — solo el dueño del ítem */}
                          {isSelf && (
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-red-300 hover:text-red-500 transition-colors"
                              aria-label={`Eliminar ${product.title}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Modal agregar producto */}
      {modalTarget && orderId && (
        <AddProductModal
          target={modalTarget}
          products={products}
          orderId={orderId}
          onClose={() => setModalTarget(null)}
        />
      )}
    </>
  );
}
