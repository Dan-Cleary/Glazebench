import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Auth helper
function checkAuth(secret: string) {
  const expectedSecret = process.env.BENCHMARK_SECRET;
  if (!expectedSecret) {
    throw new Error("BENCHMARK_SECRET not set in Convex environment");
  }
  if (secret !== expectedSecret) {
    throw new Error("Invalid BENCHMARK_SECRET");
  }
}

// Mutations

export const createRun = mutation({
  args: {
    model: v.string(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    checkAuth(args.secret);

    const runId = await ctx.db.insert("runs", {
      model: args.model,
      run_date: Date.now(),
      status: "pending",
    });

    return runId;
  },
});

export const updateRunStatus = mutation({
  args: {
    runId: v.id("runs"),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("complete"),
      v.literal("failed")
    ),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    checkAuth(args.secret);

    await ctx.db.patch(args.runId, {
      status: args.status,
    });
  },
});

export const saveResponse = mutation({
  args: {
    runId: v.id("runs"),
    promptId: v.string(),
    prompt: v.string(),
    response: v.string(),
    finalAnswer: v.union(v.literal("yes"), v.literal("no"), v.literal("unclear")),
    glazed: v.boolean(),
    costUsd: v.optional(v.number()),
    latencyMs: v.number(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    checkAuth(args.secret);

    await ctx.db.insert("responses", {
      run_id: args.runId,
      prompt_id: args.promptId,
      prompt: args.prompt,
      response: args.response,
      final_answer: args.finalAnswer,
      glazed: args.glazed,
      cost_usd: args.costUsd,
      latency_ms: args.latencyMs,
    });
  },
});

export const finalizeRun = mutation({
  args: {
    runId: v.id("runs"),
    glazeRate: v.number(),
    totalPrompts: v.number(),
    validResponses: v.number(),
    glazedCount: v.number(),
    totalCostUsd: v.number(),
    avgLatencyMs: v.number(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    checkAuth(args.secret);

    await ctx.db.patch(args.runId, {
      status: "complete",
      glaze_rate: args.glazeRate,
      total_prompts: args.totalPrompts,
      valid_responses: args.validResponses,
      glazed_count: args.glazedCount,
      total_cost_usd: args.totalCostUsd,
      avg_latency_ms: args.avgLatencyMs,
    });
  },
});

export const clearAllData = mutation({
  args: {
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    checkAuth(args.secret);

    // Delete all responses
    const responses = await ctx.db.query("responses").collect();
    for (const response of responses) {
      await ctx.db.delete(response._id);
    }

    // Delete all runs
    const runs = await ctx.db.query("runs").collect();
    for (const run of runs) {
      await ctx.db.delete(run._id);
    }
  },
});

// Queries

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    // Get all completed runs
    const allRuns = await ctx.db
      .query("runs")
      .filter((q) => q.eq(q.field("status"), "complete"))
      .collect();

    // Group by model and get the latest run for each
    const modelToRun = new Map<string, Doc<"runs">>();
    for (const run of allRuns) {
      const existing = modelToRun.get(run.model);
      if (!existing || run.run_date > existing.run_date) {
        modelToRun.set(run.model, run);
      }
    }

    // Convert to array and sort by glaze_rate (lower is better)
    const leaderboard = Array.from(modelToRun.values()).sort((a, b) => {
      const aRate = a.glaze_rate ?? 100;
      const bRate = b.glaze_rate ?? 100;
      return aRate - bRate;
    });

    return leaderboard;
  },
});

export const getResponsesByRunId = query({
  args: {
    runId: v.id("runs"),
  },
  handler: async (ctx, args) => {
    const responses = await ctx.db
      .query("responses")
      .withIndex("by_run_id", (q) => q.eq("run_id", args.runId))
      .collect();

    return responses;
  },
});

export const getRunById = query({
  args: {
    runId: v.id("runs"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.runId);
  },
});
