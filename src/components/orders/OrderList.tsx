"use client";

import { OrderCard } from "./OrderCard";

interface Product {
  id: string;
  title: string;
  price: number;
  unit: string;
}

interface Order {
  _id: string;
  title: string;
  description: string;
  deadline: number;
  status: "open" | "closed";
  products: Product[];
}

interface OrderListProps {
  orders: Order[] | undefined;
  emptyMessage?: string;
}

export function OrderList({
  orders,
  emptyMessage = "No hay pedidos todavía",
}: OrderListProps) {
  if (orders === undefined) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📦</p>
        <p className="text-base">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}
