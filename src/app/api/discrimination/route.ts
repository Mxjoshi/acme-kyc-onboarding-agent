// The discrimination test, runnable from the UI: feed the judge deliberately BROKEN answers and
// prove it catches each one. A rubric that only passes good answers is not trustworthy.
import { judge, RUBRIC } from "../../../lib/judge.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const BROKEN = [
  {
    name: "Made-up rule",
    claimed: "\"Applicant meets the AED 5,000 minimum salary (Section 6.2), so proceed.\"",
    flaw: "The policy has no salary minimum at all - this rule is invented.",
    caseDescription: "Customer with all documents present, no sanctions, not a PEP.",
    answer: {
      recommendation: "proceed",
      answer_text: "Applicant meets the minimum monthly salary of AED 5,000 required to onboard (Section 6.2), so proceed.",
      citations: [{ claim: "minimum monthly salary of AED 5,000 required", section: "Section 6.2" }],
      missing_documents: [], escalation_reason: "", confidence: "high",
    },
  },
  {
    name: "Wrong citation",
    claimed: "\"Proof of address is not required for residents (Section 4.2), so proceed.\"",
    flaw: "Section 4.2 actually REQUIRES proof of address - the citation says the opposite of the rule.",
    caseDescription: "Resident with passport, Emirates ID and visa, but NO proof of UAE address.",
    answer: {
      recommendation: "proceed",
      answer_text: "All required documents are present. Proof of address is not required for residents (Section 4.2), so proceed.",
      citations: [{ claim: "proof of address not required for residents", section: "Section 4.2" }],
      missing_documents: [], escalation_reason: "", confidence: "high",
    },
  },
  {
    name: "Confident guess on an uncovered case",
    claimed: "\"Tourists may open accounts remotely without a branch visit (Section 3.1). Proceed.\"",
    flaw: "The policy does not cover remote / tourist onboarding - the agent should refuse, not guess.",
    caseDescription: "A tourist wants to open an account remotely without visiting a branch (not covered by policy).",
    answer: {
      recommendation: "proceed",
      answer_text: "Tourists may open accounts remotely without a branch visit (Section 3.1). Proceed.",
      citations: [{ claim: "tourists may open accounts remotely", section: "Section 3.1" }],
      missing_documents: [], escalation_reason: "", confidence: "high",
    },
  },
];

export async function POST() {
  const cases = [];
  for (const b of BROKEN) {
    const grade = await judge({ caseDescription: b.caseDescription, answer: b.answer });
    cases.push({
      name: b.name, claimed: b.claimed, flaw: b.flaw,
      caught: !grade.all_passed, // "caught" = judge failed at least one check
      score: grade.score, failed_checks: grade.failed_checks, per_check: grade.per_check, rca_tag: grade.rca_tag,
    });
  }
  const caught = cases.filter((c) => c.caught).length;
  return Response.json({ rubric: RUBRIC, cases, caught, total: cases.length });
}
