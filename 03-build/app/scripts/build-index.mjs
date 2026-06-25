// Builds the searchable policy index (the "vector store").
// Reads the KYC/AML policy, splits it into sections (chunks), turns each into an
// embedding (meaning-numbers) locally with transformers.js, and saves the result
// to src/data/policy-index.json. Run once whenever the policy changes:
//   node scripts/build-index.mjs
// No API key needed: embeddings run locally and offline.

import { pipeline, env } from "@xenova/transformers";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..");

const POLICY_PATH = join(appRoot, "data", "policy", "acme-bank-kyc-aml-policy.md");
const OUT_PATH = join(appRoot, "src", "data", "policy-index.json");
const DOC_TITLE = "Acme Bank UAE KYC and AML Policy (v1.0)";

// Allow the model files to download and cache locally on first run.
env.allowLocalModels = false;

// Split the policy into one chunk per "## Section ..." heading, keeping the
// section label so every answer can cite the exact section.
function chunkPolicy(text) {
  const lines = text.split("\n");
  const chunks = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^##\s+(Section\s+\d+\.[^\n]*)/);
    if (heading) {
      if (current) chunks.push(current);
      current = { section: heading[1].trim(), text: line + "\n" };
    } else if (current) {
      current.text += line + "\n";
    }
  }
  if (current) chunks.push(current);
  return chunks.map((c, i) => ({
    chunk_id: `chunk_${String(i + 1).padStart(2, "0")}`,
    doc_title: DOC_TITLE,
    section: c.section,
    text: c.text.trim(),
  }));
}

async function main() {
  console.log("Reading policy ...");
  const policy = readFileSync(POLICY_PATH, "utf8");

  const chunks = chunkPolicy(policy);
  console.log(`Split into ${chunks.length} chunks (sections).`);

  console.log("Loading the local embedding model (first run downloads it) ...");
  const embed = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  console.log("Embedding each chunk ...");
  for (const chunk of chunks) {
    const out = await embed(chunk.text, { pooling: "mean", normalize: true });
    chunk.embedding = Array.from(out.data);
  }

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(chunks, null, 2));
  console.log(`Saved index with ${chunks.length} chunks to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
