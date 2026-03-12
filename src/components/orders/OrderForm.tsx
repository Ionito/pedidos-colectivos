"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { ProductParserInput } from "./ProductParserInput";
import { ParsedProduct } from "@/lib/parseProducts";

export function OrderForm() {
  const router = useRouter();
  const createOrder = useMutation(api.orders.create);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProductsParsed = useCallback((p: ParsedProduct[]) => {
    setProducts(p);
  }, []);

  // Min datetime: now
  const minDatetime = new Date(Date.now() + 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !deadline || products.length === 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const parsedShipping = parseFloat(shippingCost.replace(",", "."));
      const id = await createOrder({
        title: title.trim(),
        description: description.trim(),
        deadline: new Date(deadline).getTime(),
        shippingCost: !isNaN(parsedShipping) && parsedShipping > 0 ? parsedShipping : undefined,
        products,
      });
      router.push(`/orders/${id}`);
    } catch (err) {
      setError("Error al crear el pedido. Intentá de nuevo.");
      setIsSubmitting(false);
    }
  }

  const canSubmit = title.trim() && deadline && products.length > 0 && !isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Mariscos del mes"
          className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles del pedido, mínimo de compra, forma de pago, etc."
          className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha límite para sumarse <span className="text-red-400">*</span>
        </label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={minDatetime}
          className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Costo de envío
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">$</span>
          <input
            type="number"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            placeholder="0"
            min="0"
            step="1"
            className="w-full border border-gray-300 rounded-xl pl-7 pr-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px]"
          />
        </div>
      </div>

      <ProductParserInput onProductsParsed={handleProductsParsed} />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-base min-h-[52px] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
      >
        {isSubmitting
          ? "Creando pedido..."
          : products.length === 0
          ? "Agregá productos para continuar"
          : `Crear pedido con ${products.length} producto${products.length !== 1 ? "s" : ""}`}
      </button>
    </form>
  );
}
