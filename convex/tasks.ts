import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const getTasks = query({
  args: {
    searchQuery: v.optional(v.string()), 
    filter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    
    if (args.searchQuery) {
      return await ctx.db
        .query("tasks")
        .withSearchIndex("by_title", (q) => q.search("title", args.searchQuery!))
        .collect();
    }

    let q = ctx.db.query("tasks");

    if (args.filter === "active") {
      q = q.filter((q) => q.eq(q.field("completed"), false));
    } else if (args.filter === "completed") {
      q = q.filter((q) => q.eq(q.field("completed"), true));
    }

    try {
      return await q.withIndex("by_order").order("asc").collect();
    } catch (err) {
      console.warn("⚠️ Index 'by_order' not available, falling back:", err);
      return await q.order("asc").collect(); 
    }
  },
});

export const getById = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    // Add these back
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const lastTask = await ctx.db
      .query("tasks")
      .withIndex("by_order")
      .order("desc")
      .first();

    const nextOrder = (lastTask?.order ?? 0) + 1;

    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      dueDate: args.dueDate,
      completed: false,
      order: nextOrder,
    });
  },
});

export const updateCompletion = mutation({
  args: {
    id: v.id("tasks"),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { completed: args.completed });
  },
});

export const updateDetails = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});


export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateOrder = mutation({
  args: {
    tasks: v.array(
      v.object({
        id: v.id("tasks"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await Promise.all(
      args.tasks.map((task) => ctx.db.patch(task.id, { order: task.order }))
    );
  },
});

export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const completedTasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();

    if (completedTasks.length === 0) {
      return "No completed tasks to clear.";
    }

    await Promise.all(
      completedTasks.map((task) => ctx.db.delete(task._id))
    );

    return `Cleared ${completedTasks.length} task(s).`;
  },
});