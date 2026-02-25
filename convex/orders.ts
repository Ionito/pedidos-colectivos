import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const productValidator = v.object({
  id: v.string(),
  title: v.string(),
  description: v.optional(v.string()),
  price: v.number(),
  unit: v.string(),
});

// PUBLIC: Landing page can show open orders without auth
export const listOpen = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .order("desc")
      .collect();
  },
});

// AUTHENTICATED: Full list for logged-in users
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("open"), v.literal("closed"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    if (args.status) {
      return ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }

    return ctx.db.query("orders").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    deadline: v.number(),
    products: v.array(productValidator),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("Usuario no encontrado");

    return ctx.db.insert("orders", {
      ...args,
      createdBy: user._id,
      status: "open",
    });
  },
});

// Only the creator can update title, description, deadline and products
export const update = mutation({
  args: {
    id: v.id("orders"),
    title: v.string(),
    description: v.string(),
    deadline: v.number(),
    products: v.array(productValidator),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Pedido no encontrado");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user || order.createdBy !== user._id) throw new Error("Sin permiso");

    const { id, ...fields } = args;
    return ctx.db.patch(id, fields);
  },
});

export const close = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No autenticado");

    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Pedido no encontrado");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user || order.createdBy !== user._id) throw new Error("Sin permiso");

    return ctx.db.patch(args.id, { status: "closed" });
  },
});
