import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  orders: defineTable({
    title: v.string(),
    description: v.string(),
    deadline: v.number(), // Unix timestamp ms
    createdBy: v.id("users"),
    status: v.union(v.literal("open"), v.literal("closed")),
    products: v.array(
      v.object({
        id: v.string(), // client UUID
        title: v.string(),
        description: v.optional(v.string()),
        price: v.number(),
        unit: v.string(),
      })
    ),
  })
    .index("by_status", ["status"])
    .index("by_created_by", ["createdBy"]),

  orderItems: defineTable({
    orderId: v.id("orders"),
    userId: v.id("users"),
    productId: v.string(), // matches product.id (UUID string)
    quantity: v.number(),
  })
    .index("by_order", ["orderId"])
    .index("by_user_and_order", ["userId", "orderId"]),
});
