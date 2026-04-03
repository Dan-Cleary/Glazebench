import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  runs: defineTable({
    model: v.string(),
    run_date: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("complete"),
      v.literal("failed")
    ),
    glaze_rate: v.optional(v.number()),
    total_prompts: v.optional(v.number()),
    valid_responses: v.optional(v.number()),
    glazed_count: v.optional(v.number()),
    total_cost_usd: v.optional(v.number()),
    avg_latency_ms: v.optional(v.number()),
    error_message: v.optional(v.string()),
  }).index("by_status", ["status"]),

  responses: defineTable({
    run_id: v.id("runs"),
    prompt_id: v.string(),
    prompt: v.string(),
    response: v.string(),
    final_answer: v.union(
      v.literal("yes"),
      v.literal("no"),
      v.literal("unclear")
    ),
    glazed: v.boolean(),
    cost_usd: v.optional(v.number()),
    latency_ms: v.number(),
  }).index("by_run_id", ["run_id"]),
});
