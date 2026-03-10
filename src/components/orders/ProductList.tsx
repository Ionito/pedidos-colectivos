"use client";

import { formatCurrency } from "@/lib/formatters";
import { useState } from "react";
import { useGridCols } from "@/hooks/useGridCols";

const ROWS = 7; // filas visibles por página
const TABLE_PAGE_SIZE = 30;

type ViewMode = "grid" | "table";

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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const cols = useGridCols();
  const pageSize = viewMode === "grid" ? ROWS * cols : TABLE_PAGE_SIZE;

  const myQuantityMap: Record<string, number> = {};
  for (const item of myItems) {
    myQuantityMap[item.productId] = item.quantity;
  }

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const effectivePage = totalPages > 0 ? Math.min(page, totalPages - 1) : 0;
  const paginated = filtered.slice(
    effectivePage * pageSize,
    (effectivePage + 1) * pageSize
  );

  function handleSearch(value: string) {
    setSearch(value);
    setPage(0);
  }

  return (
    <section>
      <h2 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        Productos disponibles
      </h2>

      {/* Search + view toggle */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shrink-0">
          <button
            type="button"
            onClick={() => { setViewMode("grid"); setPage(0); }}
            aria-label="Vista grilla"
            className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-700"}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <rect x="1" y="1" width="6" height="6" rx="1" />
              <rect x="9" y="1" width="6" height="6" rx="1" />
              <rect x="1" y="9" width="6" height="6" rx="1" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => { setViewMode("table"); setPage(0); }}
            aria-label="Vista tabla"
            className={`p-2.5 transition-colors ${viewMode === "table" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-700"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {paginated.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm">Sin resultados para &ldquo;{search}&rdquo;</p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid — 1 col mobile, 2 col sm+, 3 col lg+ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {paginated.map((product) => {
            const qty = myQuantityMap[product.id] ?? 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-200 px-4 py-3 flex flex-col gap-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm leading-tight">
                    {product.title}
                  </p>
                  {product.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {formatCurrency(product.price)}{" "}
                    {product.unit && (
                      <span className="text-gray-400">/ {product.unit}</span>
                    )}
                  </p>
                </div>

                {orderStatus === "open" && (
                  <div className="flex items-center justify-between gap-2">
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
                  <span className="self-start text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    x{qty}
                  </span>
                )}

                {orderStatus === "closed" && qty === 0 && (
                  <span className="self-start text-xs text-gray-300">—</span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Table view */
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="text-left px-4 py-2.5">Producto</th>
                <th className="text-right px-4 py-2.5 whitespace-nowrap">Precio</th>
                <th className="text-center px-4 py-2.5">Cantidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((product) => {
                const qty = myQuantityMap[product.id] ?? 0;

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 leading-tight">{product.title}</p>
                      {product.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-gray-600">
                      {formatCurrency(product.price)}
                      {product.unit && (
                        <span className="text-gray-400 text-xs ml-1">/ {product.unit}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {orderStatus === "open" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => onQuantityChange(product.id, Math.max(0, qty - 1))}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-600 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform"
                            aria-label="Restar uno"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-semibold text-gray-900">{qty}</span>
                          <button
                            type="button"
                            onClick={() => onQuantityChange(product.id, qty + 1)}
                            className="w-8 h-8 rounded-full bg-blue-600 text-white text-lg font-bold flex items-center justify-center active:scale-90 transition-transform"
                            aria-label="Sumar uno"
                          >
                            +
                          </button>
                        </div>
                      ) : qty > 0 ? (
                        <span className="flex justify-center">
                          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-0.5 rounded-full">x{qty}</span>
                        </span>
                      ) : (
                        <span className="flex justify-center text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={effectivePage === 0}
            className="flex items-center gap-1 text-sm text-gray-500 disabled:opacity-30 hover:text-gray-800 transition-colors min-h-[44px] px-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Anterior
          </button>

          <span className="text-xs text-gray-400">
            {effectivePage + 1} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={effectivePage === totalPages - 1}
            className="flex items-center gap-1 text-sm text-gray-500 disabled:opacity-30 hover:text-gray-800 transition-colors min-h-[44px] px-2"
          >
            Siguiente
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
