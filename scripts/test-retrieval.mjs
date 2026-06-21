// Proves retrieval works. Loads the policy index, embeds a test question, and
// prints the closest policy sections by meaning. No API key needed.
//   node scripts/test-retrieval.mjs "what documents does a resident need?"

import { pipeline, env } from "@xenova/transformers";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = join(here, "..", "src", "data", "policy-index.json");
env.allowLocalModels = false;

// Cosine similarity. Embeddings are normalized, so this is just a dot product.
function similarity(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

async function main() {
  const query = process.argv.slice(2).join(" ") ||
    "what documents does a resident need to open an account?";
  const index = JSON.parse(readFileSync(INDEX_PATH, "utf8"));

  const embed = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  const q = await embed(query, { pooling: "mean", normalize: true });
  const queryVec = Array.from(q.data);

  const ranked = index
    .map((chunk) => ({ chunk, score: similarity(queryVec, chunk.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  console.log(`\nQuery: ${query}\n`);
  console.log("Top matching policy sections:\n");
  for (const { chunk, score } of ranked) {
    const snippet = chunk.text.replace(/\s+/g, " ").slice(0, 160);
    console.log(`  [${score.toFixed(3)}] ${chunk.section}`);
    console.log(`         ${snippet}...\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
