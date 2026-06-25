# Demo guide - KYC Onboarding Agent

A self-contained guide for running and presenting the app.

## What it is (one line)
A trustworthy KYC/AML onboarding console for a UAE bank: it reviews a new customer against policy,
gives a cited decision (proceed / request documents / escalate), refuses when unsure, escalates risk to
a human, and a built-in trust layer grades every answer. Companion to the Newcomer Credit Decisioning
Copilot (capstone): onboarding here, lending there.

## How to run
1. Open a terminal in `05-build/app`.
2. Ensure your Anthropic key is in `.env.local` (ANTHROPIC_API_KEY=...). It is gitignored.
3. First time only: `node scripts/build-index.mjs` (builds the policy search index).
4. `npm run dev`  ->  open http://localhost:3000 (or 3001 if 3000 is busy).

## The app has 5 views (top navigation)
- Dashboard - home: what it does, how to use it, and live stats.
- Onboarding - the case console: pick an applicant, review documents, run the check, see the verdict.
- Review queue - every case the agent escalated or paused (human-in-the-loop).
- Audit log - a record of every decision (outcome, trust score, root cause, time).
- Report - alignment with CBUAE expectations, with live metrics.

## 60-second demo script
1. Start on the Dashboard. Read the one-line "how to use". Say: "Every decision is grounded, cited,
   and graded; risk goes to a human."
2. Go to Onboarding. Pick OMAR. Show his profile and documents (passport, Emirates ID, visa, salary,
   tenancy, AML screening). Click "Run KYC / AML check". Watch the live steps (retrieve -> decide -> grade).
   Result: PROCEED, every claim cited, trust score 100%. Click a citation to show the actual rule.
3. Pick LAYLA. Run. Result: REQUEST DOCUMENTS - missing proof of address, with the cited rule.
4. Pick SARA. Run. Result: ESCALATE - sanctions match + PEP. "The AI refused to auto-decide and sent it
   to a human."
5. The headline: pick OMAR again, tick "Break it", Run. The trust scoreboard turns RED, score drops,
   RCA = bad_retrieval. Say: "The trust layer caught a bad answer in real time - this is the point."
6. Open Review queue (Layla + Sara are waiting for a human). Open Audit log (every decision recorded).
   Open Report (alignment with the CBUAE Feb 2026 Guidance Note).

## The one-line pitch
"I built a trustworthy onboarding agent for UAE banking: it cites every decision, refuses when unsure,
escalates risk to a human, and proves its own answers with an evaluation layer - then I try to break it
on screen and watch the trust scoreboard catch it."

## Notes for judges
- All data is synthetic. Acme Bank UAE is fictional. No real customer data.
- The trust layer is proven by a discrimination test (scripts/test-evals.mjs): it is fed deliberately
  bad answers and catches 3/3.
- Built on Next.js + Claude (claude-opus-4-8) + local embeddings (transformers.js).
