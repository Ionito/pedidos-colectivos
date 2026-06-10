import { OrderForm } from "@/components/orders/OrderForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewOrderPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-4 flex items-center gap-3 sticky top-0 z-10" style={{ borderColor: 'var(--line)' }}>
        <Link
          href="/orders"
          className="text-gray-500 min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2"
          aria-label="Volver"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--ink)', fontFamily: 'var(--pc-font-display)' }}>Nuevo pedido</h1>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto">
        <OrderForm />
      </div>
    </main>
  );
}
