import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    completed: v.boolean(),
    order: v.optional(v.number()),
  })
    .searchIndex("by_title", { searchField: "title" })
    .index("by_order", ["order"]),
});