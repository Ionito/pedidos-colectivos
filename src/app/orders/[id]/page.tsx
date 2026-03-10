import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import OrderDetailClient from "./OrderDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const order = await fetchQuery(api.orders.getById, { id: id as Id<"orders"> });
    if (!order) return { title: "Pedido no encontrado | Pedidos Colectivos" };

    const productCount = order.products.length;
    const description =
      order.description?.trim() ||
      `${productCount} producto${productCount !== 1 ? "s" : ""} disponibles. ¡Sumate al pedido!`;

    return {
      title: `${order.title} | Pedidos Colectivos`,
      description,
      openGraph: {
        title: order.title,
        description,
        type: "website",
        siteName: "Pedidos Colectivos",
      },
      twitter: {
        card: "summary_large_image",
        title: order.title,
        description,
      },
    };
  } catch {
    return { title: "Pedidos Colectivos" };
  }
}

export default function Page() {
  return <OrderDetailClient />;
}
