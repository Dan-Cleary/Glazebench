import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function clearData() {
  const convexUrl = process.env.VITE_CONVEX_URL;
  const benchmarkSecret = process.env.BENCHMARK_SECRET;

  if (!convexUrl) {
    throw new Error("VITE_CONVEX_URL not set in .env.local");
  }
  if (!benchmarkSecret) {
    throw new Error("BENCHMARK_SECRET not set in .env.local");
  }

  const convex = new ConvexHttpClient(convexUrl);

  console.log("\n🗑️  Clearing all benchmark data...\n");

  await convex.mutation(api.runs.clearAllData, {
    secret: benchmarkSecret,
  });

  console.log("✅ All data cleared\n");
}

clearData().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
