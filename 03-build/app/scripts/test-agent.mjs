// Runs the grounded onboarding agent on the three sample customers and prints
// the cited decision for each. Expects ANTHROPIC_API_KEY in .env.local.
//   node scripts/test-agent.mjs

import { readFileSync } from "node:fs";
import { answerCase } from "../src/lib/onboarding.mjs";

// Load .env.local (scripts run outside Next.js, which would load it automatically).
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

// The case facts the agent reasons over (derived from each customer's situation).
const CASES = [
  {
    name: "Omar (expected: proceed)",
    facts: {
      category: "resident newcomer",
      documents_provided: ["passport", "Emirates ID", "residence visa", "salary certificate", "tenancy contract"],
      sanctions_hit: false,
      pep_flag: false,
    },
  },
  {
    name: "Layla (expected: request_documents)",
    facts: {
      category: "resident newcomer",
      documents_provided: ["passport", "Emirates ID", "residence visa"],
      sanctions_hit: false,
      pep_flag: false,
    },
  },
  {
    name: "Sara (expected: escalate)",
    facts: {
      category: "resident newcomer",
      documents_provided: ["passport", "Emirates ID", "residence visa", "salary certificate"],
      sanctions_hit: true,
      pep_flag: true,
    },
  },
];

for (const c of CASES) {
  console.log("\n============================================================");
  console.log(c.name);
  console.log("============================================================");
  const { decision, retrieved_sections } = await answerCase(c.facts);
  console.log(`Recommendation: ${decision.recommendation.toUpperCase()}  (confidence: ${decision.confidence})`);
  console.log(`\nAnswer: ${decision.answer_text}`);
  if (decision.missing_documents.length)
    console.log(`\nMissing documents: ${decision.missing_documents.join(", ")}`);
  if (decision.escalation_reason)
    console.log(`\nEscalation reason: ${decision.escalation_reason}`);
  console.log(`\nCitations:`);
  for (const cit of decision.citations) console.log(`  - [${cit.section}] ${cit.claim}`);
  console.log(`\n(retrieved sections: ${retrieved_sections.join(", ")})`);
}
