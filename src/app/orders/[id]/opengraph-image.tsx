import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OGImage({ params }: Props) {
  const { id } = await params;

  let title = "Pedido Colectivo";
  let description = "Sumate al pedido";
  let productCount = 0;
  let isOpen = true;

  try {
    const order = await fetchQuery(api.orders.getById, { id: id as Id<"orders"> });
    if (order) {
      title = order.title;
      productCount = order.products.length;
      isOpen = order.status === "open";
      description =
        order.description?.trim() ||
        `${productCount} producto${productCount !== 1 ? "s" : ""} disponibles`;
    }
  } catch {
    // use defaults
  }

  const safeTitle = title.length > 52 ? title.slice(0, 49) + "..." : title;
  const safeDesc = description.length > 110 ? description.slice(0, 107) + "..." : description;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#EFF6FF",
          padding: "64px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: 40 }}>📦</span>
          <span style={{ fontSize: 26, fontWeight: 700, color: "#2563EB" }}>
            Pedidos Colectivos
          </span>
          <div
            style={{
              display: "flex",
              marginLeft: "16px",
              backgroundColor: isOpen ? "#DCFCE7" : "#F3F4F6",
              color: isOpen ? "#16A34A" : "#6B7280",
              padding: "6px 16px",
              borderRadius: "50px",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {isOpen ? "Abierto" : "Cerrado"}
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "52px",
            flex: 1,
          }}
        >
          <h1
            style={{
              fontSize: safeTitle.length > 32 ? 58 : 72,
              fontWeight: 800,
              color: "#111827",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {safeTitle}
          </h1>
          <p
            style={{
              fontSize: 30,
              color: "#6B7280",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {safeDesc}
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {productCount > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#DBEAFE",
                color: "#1D4ED8",
                padding: "12px 28px",
                borderRadius: "50px",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {productCount} producto{productCount !== 1 ? "s" : ""}
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#2563EB",
              color: "white",
              padding: "14px 36px",
              borderRadius: "50px",
              fontSize: 24,
              fontWeight: 700,
              marginLeft: "auto",
            }}
          >
            Sumate al pedido →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
