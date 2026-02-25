"use client";

import { formatCurrency } from "@/lib/formatters";

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
}

export function ParticipantList({ items, products }: Props) {
  const productMap: Record<string, Product> = {};
  for (const p of products) {
    productMap[p.id] = p;
  }

  // Group items by userId
  const byUser: Record<string, { user: User | null; items: ItemWithUser[] }> =
    {};
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

  return (
    <section>
      <h2 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        Participantes ({participants.length})
      </h2>
      <div className="space-y-3">
        {participants.map(({ user, items: userItems }) => {
          const total = userItems.reduce((sum, item) => {
            const product = productMap[item.productId];
            return sum + (product ? product.price * item.quantity : 0);
          }, 0);

          return (
            <div
              key={user?._id ?? userItems[0].userId}
              className="bg-white rounded-2xl border border-gray-200 px-4 py-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {user?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {(user?.name ?? "?")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-gray-900 text-sm">
                    {user?.name ?? "Usuario"}
                  </span>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  {formatCurrency(total)}
                </span>
              </div>

              <div className="space-y-1 pl-10">
                {userItems.map((item) => {
                  const product = productMap[item.productId];
                  if (!product) return null;
                  return (
                    <div
                      key={item._id}
                      className="flex justify-between text-xs text-gray-500"
                    >
                      <span className="truncate flex-1 mr-2">
                        {product.title}
                      </span>
                      <span className="shrink-0">
                        x{item.quantity} ·{" "}
                        {formatCurrency(product.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
