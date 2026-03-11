import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all items for a given order with user info joined
export const listByOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();

    return Promise.all(
      items.map(async (item) => {
        const user = await ctx.db.get(item.userId);
        return { ...item, user };
      })
    );
  },
});

// Get current user's items for a specific order
export const myItemsForOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    return ctx.db
      .query("orderItems")
      .withIndex("by_user_and_order", (q) =>
        q.eq("userId", user._id).eq("orderId", args.orderId)
      )
      .collect();
  },
});

// Remove a single order item (owner of the order only)
export const removeItem = mutation({
  args: { itemId: v.id("orderItems") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item no encontrado");

    const order = await ctx.db.get(item.orderId);
    if (!order) throw new Error("Pedido no encontrado");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user || order.createdBy !== user._id) throw new Error("Sin permiso");

    return ctx.db.delete(args.itemId);
  },
});

// Remove all items for a user in an order (owner of the order only)
export const removeUserItems = mutation({
  args: { orderId: v.id("orders"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Pedido no encontrado");

    const me = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!me || order.createdBy !== me._id) throw new Error("Sin permiso");

    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_user_and_order", (q) =>
        q.eq("userId", args.userId).eq("orderId", args.orderId)
      )
      .collect();

    await Promise.all(items.map((item) => ctx.db.delete(item._id)));
  },
});

// Set quantity for a product in an order (0 = remove)
export const upsertItem = mutation({
  args: {
    orderId: v.id("orders"),
    productId: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("Usuario no encontrado");

    const allUserItems = await ctx.db
      .query("orderItems")
      .withIndex("by_user_and_order", (q) =>
        q.eq("userId", user._id).eq("orderId", args.orderId)
      )
      .collect();

    const existing = allUserItems.find((i) => i.productId === args.productId);

    if (args.quantity <= 0) {
      if (existing) await ctx.db.delete(existing._id);
      return;
    }

    if (existing) {
      return ctx.db.patch(existing._id, { quantity: args.quantity });
    }

    return ctx.db.insert("orderItems", {
      orderId: args.orderId,
      userId: user._id,
      productId: args.productId,
      quantity: args.quantity,
    });
  },
});
