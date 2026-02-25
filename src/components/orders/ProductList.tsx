"use client";

import { formatCurrency } from "@/lib/formatters";

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  unit: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
}

interface Props {
  products: Product[];
  myItems: OrderItem[];
  orderStatus: "open" | "closed";
  onQuantityChange: (productId: string, quantity: number) => void;
}

export function ProductList({
  products,
  myItems,
  orderStatus,
  onQuantityChange,
}: Props) {
  const myQuantityMap: Record<string, number> = {};
  for (const item of myItems) {
    myQuantityMap[item.productId] = item.quantity;
  }

  return (
    <section>
      <h2 className="text-base font-semibold text-gray-700 mb-3 uppercase tracking-wide text-xs">
        Productos disponibles
      </h2>
      <div className="space-y-3">
        {products.map((product) => {
          const qty = myQuantityMap[product.id] ?? 0;

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-200 px-4 py-3 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm leading-tight">
                  {product.title}
                </p>
                {product.description && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {product.description}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(product.price)}{" "}
                  <span className="text-gray-400">/ {product.unit}</span>
                </p>
              </div>

              {orderStatus === "open" && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      onQuantityChange(product.id, Math.max(0, qty - 1))
                    }
                    className="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-600 text-xl font-bold flex items-center justify-center active:scale-90 transition-transform"
                    aria-label="Restar uno"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-base font-semibold text-gray-900">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuantityChange(product.id, qty + 1)}
                    className="w-10 h-10 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center active:scale-90 transition-transform"
                    aria-label="Sumar uno"
                  >
                    +
                  </button>
                </div>
              )}

              {orderStatus === "closed" && qty > 0 && (
                <span className="shrink-0 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  x{qty}
                </span>
              )}

              {orderStatus === "closed" && qty === 0 && (
                <span className="shrink-0 text-xs text-gray-300">—</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
