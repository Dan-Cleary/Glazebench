import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const modelsPath = path.join(process.cwd(), "data/models.json");
const modelsData = JSON.parse(fs.readFileSync(modelsPath, "utf-8"));
const models: string[] = modelsData.models;

console.log(`\n🚀 Running GlazeBench on ${models.length} models\n`);

for (let i = 0; i < models.length; i++) {
  const model = models[i];
  console.log(`\n${"=".repeat(60)}`);
  console.log(`[${i + 1}/${models.length}] Starting: ${model}`);
  console.log(${"=".repeat(60)}\n`);

  try {
    execSync(`npm run bench ${model}`, { stdio: "inherit" });
  } catch (error) {
    console.error(`\n❌ Failed to run ${model}\n`);
  }
}

console.log(`\n✅ Completed all ${models.length} models\n`);
