"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { parseProductList, ParsedProduct } from "@/lib/parseProducts";
import { formatCurrency } from "@/lib/formatters";

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  unit: string;
}

interface Props {
  order: {
    _id: Id<"orders">;
    title: string;
    description: string;
    deadline: number;
    products: Product[];
  };
  onClose: () => void;
}

type Tab = "info" | "products";

export function EditOrderModal({ order, onClose }: Props) {
  const updateOrder = useMutation(api.orders.update);

  // ── Info fields ───────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>("info");
  const [title, setTitle] = useState(order.title);
  const [description, setDescription] = useState(order.description);
  const [deadline, setDeadline] = useState(
    new Date(order.deadline).toISOString().slice(0, 16)
  );

  // ── Products state ────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>(order.products);
  const [parserText, setParserText] = useState("");
  const [parsed, setParsed] = useState<ReturnType<typeof parseProductList> | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Live parser preview
  const handleParserChange = useCallback((value: string) => {
    setParserText(value);
    if (!value.trim()) { setParsed(null); return; }
    setParsed(parseProductList(value));
  }, []);

  // Add parsed products to the list
  function handleAddParsed() {
    if (!parsed || parsed.products.length === 0) return;
    setProducts((prev) => [...prev, ...parsed.products]);
    setParserText("");
    setParsed(null);
  }

  // Remove a product by id
  function handleRemove(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  // Save everything
  async function handleSave() {
    if (!title.trim() || !deadline || products.length === 0) return;
    setIsSaving(true);
    setError(null);
    try {
      await updateOrder({
        id: order._id,
        title: title.trim(),
        description: description.trim(),
        deadline: new Date(deadline).getTime(),
        products,
      });
      onClose();
    } catch {
      setError("No se pudo guardar. Intentá de nuevo.");
      setIsSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90dvh]">

        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Editar pedido</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pb-3 shrink-0">
          {([
            { key: "info", label: "Datos" },
            { key: "products", label: `Productos (${products.length})` },
          ] as { key: Tab; label: string }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors min-h-[40px] ${
                tab === t.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 pb-2">

          {/* ── TAB: INFO ─────────────────────────────────────────── */}
          {tab === "info" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha límite <span className="text-red-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px]"
                />
              </div>
            </div>
          )}

          {/* ── TAB: PRODUCTS ─────────────────────────────────────── */}
          {tab === "products" && (
            <div className="space-y-4">

              {/* Current products list */}
              {products.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">
                  No hay productos. Agregá usando el parser de abajo.
                </div>
              ) : (
                <div className="space-y-2">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                        <p className="text-xs text-gray-400">
                          {formatCurrency(p.price)} / {p.unit}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(p.id)}
                        className="shrink-0 w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                        aria-label={`Eliminar ${p.title}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Agregar productos</p>
                <p className="text-xs text-gray-400 mb-2">
                  Pegá una lista y presioná "Agregar". Formato: Nombre $precio x unidad
                </p>
                <textarea
                  value={parserText}
                  onChange={(e) => handleParserChange(e.target.value)}
                  placeholder={"_Langostinos $3500 x 100 grs\n_Camarones $3800 x 100 grs"}
                  className="w-full border border-gray-300 rounded-xl px-3 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />

                {/* Parser preview */}
                {parsed && (parsed.products.length > 0 || parsed.errors.length > 0) && (
                  <div className="mt-2 space-y-1">
                    {parsed.products.map((p) => (
                      <div key={p.id} className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 flex justify-between text-xs">
                        <span className="font-medium text-gray-800">{p.title}</span>
                        <span className="text-gray-500">{formatCurrency(p.price)} / {p.unit}</span>
                      </div>
                    ))}
                    {parsed.errors.map((e, i) => (
                      <div key={i} className="bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 text-xs text-red-500">
                        {e.line} — {e.reason}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddParsed}
                  disabled={!parsed || parsed.products.length === 0}
                  className="mt-3 w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium min-h-[44px] disabled:opacity-30"
                >
                  {parsed && parsed.products.length > 0
                    ? `Agregar ${parsed.products.length} producto${parsed.products.length !== 1 ? "s" : ""}`
                    : "Agregar productos"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer — always visible */}
        <div className="shrink-0 px-5 py-4 border-t border-gray-100">
          {error && (
            <div className="mb-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium text-base min-h-[50px]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !title.trim() || products.length === 0}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-base min-h-[50px] disabled:opacity-40"
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
