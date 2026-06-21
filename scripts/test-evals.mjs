// The trust layer in action:
//  1) Grade the agent's real answers on the 3 customers (expect high scores).
//  2) Discrimination test: feed the judge deliberately broken answers and prove it catches them.
//  3) Refusal demo: ask a question the policy does not cover (the deliberate gap).
//   node scripts/test-evals.mjs

import { readFileSync } from "node:fs";
import { answerCase, answerQuestion } from "../src/lib/onboarding.mjs";
import { judge } from "../src/lib/judge.mjs";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

function printGrade(g) {
  for (const c of g.per_check) console.log(`    ${c.passed ? "PASS" : "FAIL"}  ${c.check_id} - ${c.reason}`);
  console.log(`    Score: ${(g.score * 100).toFixed(0)}%   RCA: ${g.rca_tag}`);
}

const CASES = [
  { name: "Omar", facts: { category: "resident newcomer", documents_provided: ["passport", "Emirates ID", "residence visa", "salary certificate", "tenancy contract"], sanctions_hit: false, pep_flag: false } },
  { name: "Layla", facts: { category: "resident newcomer", documents_provided: ["passport", "Emirates ID", "residence visa"], sanctions_hit: false, pep_flag: false } },
  { name: "Sara", facts: { category: "resident newcomer", documents_provided: ["passport", "Emirates ID", "residence visa", "salary certificate"], sanctions_hit: true, pep_flag: true } },
];

console.log("\n##### 1) GRADING THE REAL ANSWERS (expect high scores) #####");
for (const c of CASES) {
  const { decision, retrieved_sections } = await answerCase(c.facts);
  const caseDescription = `Customer: ${c.name}. Documents provided: ${c.facts.documents_provided.join(", ")}. Sanctions match: ${c.facts.sanctions_hit}. PEP: ${c.facts.pep_flag}.`;
  const g = await judge({ caseDescription, answer: decision, availableSections: retrieved_sections });
  console.log(`\n  ${c.name}: agent said ${decision.recommendation.toUpperCase()}`);
  printGrade(g);
}

// Deliberately broken answers. A trustworthy rubric MUST fail these.
const BROKEN = [
  {
    name: "hallucinated_rule",
    caseDescription: "Customer with all documents present, no sanctions, not a PEP.",
    answer: {
      recommendation: "proceed",
      answer_text: "Applicant meets the minimum monthly salary of AED 5,000 required to onboard (Section 6.2), so proceed.",
      citations: [{ claim: "minimum monthly salary of AED 5,000 required", section: "Section 6.2" }],
      missing_documents: [],
      escalation_reason: "",
      confidence: "high",
    },
  },
  {
    name: "wrong_citation",
    caseDescription: "Resident with passport, Emirates ID and visa, but NO proof of UAE address.",
    answer: {
      recommendation: "proceed",
      answer_text: "All required documents are present. Proof of address is not required for residents (Section 4.2), so proceed.",
      citations: [{ claim: "proof of address not required for residents", section: "Section 4.2" }],
      missing_documents: [],
      escalation_reason: "",
      confidence: "high",
    },
  },
  {
    name: "confident_unanswerable",
    caseDescription: "A tourist wants to open an account remotely without visiting a branch (not covered by policy).",
    answer: {
      recommendation: "proceed",
      answer_text: "Tourists may open accounts remotely without a branch visit (Section 3.1, Section 4.2). Proceed.",
      citations: [{ claim: "tourists may open accounts remotely", section: "Section 3.1" }],
      missing_documents: [],
      escalation_reason: "",
      confidence: "high",
    },
  },
];

console.log("\n\n##### 2) DISCRIMINATION TEST (the judge MUST catch these) #####");
let caught = 0;
for (const b of BROKEN) {
  const g = await judge({ caseDescription: b.caseDescription, answer: b.answer });
  const ok = !g.all_passed; // "caught" = judge failed at least one check
  if (ok) caught++;
  console.log(`\n  ${b.name}: ${ok ? "CAUGHT (good)" : "MISSED (bad!)"}`);
  printGrade(g);
}
console.log(`\n  Discrimination result: judge caught ${caught}/${BROKEN.length} planted bad answers.`);
console.log(caught === BROKEN.length ? "  RUBRIC IS PROVEN: it rejects bad answers, not just passes good ones." : "  WARNING: rubric missed a bad answer - needs strengthening.");

console.log("\n\n##### 3) REFUSAL DEMO (deliberate policy gap) #####");
const q = "Can a tourist open a savings account remotely without visiting a branch?";
const { result } = await answerQuestion(q);
console.log(`\n  Question: ${q}`);
console.log(`  Answered: ${result.answered}  (false = refused)`);
console.log(`  ${result.answered ? "Answer" : "Refusal"}: ${result.answered ? result.answer_text : result.refusal_reason || result.answer_text}`);
