import Link from "next/link";
import { formatDeadline, formatCurrency } from "@/lib/formatters";

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

interface OrderCardProps {
  order: Order;
  showJoinButton?: boolean;
}

export function OrderCard({ order, showJoinButton = true }: OrderCardProps) {
  const isOpen = order.status === "open";
  const deadline = formatDeadline(order.deadline);

  return (
    <Link href={`/orders/${order._id}`}>
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm active:scale-[0.98] transition-transform">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-tight flex-1">
            {order.title}
          </h3>
          <span
            className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${
              isOpen
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isOpen ? "Abierto" : "Cerrado"}
          </span>
        </div>

        {order.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {order.description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <span>{order.products.length} productos</span>
          <span
            className={
              isOpen && order.deadline - Date.now() < 86400000
                ? "text-orange-500 font-medium"
                : ""
            }
          >
            {deadline}
          </span>
        </div>

        {showJoinButton && isOpen && (
          <div className="mt-3">
            <span className="inline-block w-full text-center bg-blue-600 text-white text-sm font-medium py-2 rounded-xl">
              Ver y sumarse
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
