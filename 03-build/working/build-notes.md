# Build notes (the app)

Next.js / TypeScript app in 05-build/app (matches the capstone so the two can connect later).

## Key files
- data/policy/acme-bank-kyc-aml-policy.md   the synthetic policy (source for the index)
- src/data/policy-index.json                the built searchable index (9 chunks + embeddings)
- src/lib/onboarding.mjs                     retrieve(), answerCase(), answerQuestion() - the agent
- src/lib/judge.mjs                          RUBRIC + judge() - the trust layer
- scripts/build-index.mjs                    ingestion: policy -> index (run once)
- scripts/test-retrieval.mjs                 prove retrieval works
- scripts/test-agent.mjs                     run the agent on Omar / Layla / Sara
- scripts/test-evals.mjs                     run the trust layer (judge + discrimination + refusal)
- .env.local                                 the API key (private, gitignored)

## How to run (from 05-build/app)
- node scripts/build-index.mjs                 build the index (only when policy changes)
- node scripts/test-retrieval.mjs "question"   test search
- node scripts/test-agent.mjs                  test the agent decisions
- node scripts/test-evals.mjs                  test the trust layer
- npm run dev                                  (next) start the UI at localhost:3000

## Stack choices
- Local embeddings (transformers.js): free, offline, and Anthropic has no embeddings API.
- Claude (claude-opus-4-8): generation and the LLM judge.
- Structured outputs (json_schema): reliable JSON from the agent and judge.

## The UI (column G)
- src/app/api/onboard/route.ts  POST {customer, breakIt} -> runs answerCase + judge, returns
  decision + citations + per-check eval + RCA + rubric. Node runtime; transformers.js is marked
  serverExternalPackages in next.config.ts.
- src/app/page.tsx  the screen: pick Omar/Layla/Sara, "Break it" toggle, Run. Shows recommendation,
  confidence, answer, citations, and a live trust scoreboard (PASS/FAIL per check, score, RCA).
- Verified: Omar normal -> PROCEED 100%; Omar break-it -> ESCALATE 50%, RCA bad_retrieval (red).
- Run with: npm run dev  (opens at localhost:3000, or 3001 if 3000 is taken).
- Built on Next.js 16 (see AGENTS.md: read node_modules/next/dist/docs before changing Next code).

## Bank console redesign
Reworked the UI to look like a real bank onboarding console (not a single button):
- src/data/customers.json: all 3 customers with profile + full document sets (Omar 5 docs +
  screening; Layla missing tenancy; Sara with a positive sanctions/PEP screening) + masked IDs.
- src/app/api/customers/route.ts: serves the onboarding work queue with documents.
- src/app/api/onboard/route.ts: now builds case facts from the customer's real documents + screening.
- src/app/globals.css: a bank design system (navy/gold brand, cards, chips, tabular numerals).
- src/app/page.tsx: top bar + officer, left work queue, applicant profile, document-review cards
  with RECEIVED/CLEAR/REVIEW badges, Run check + Break-it, decision banner, citations, trust scoreboard.

## Applicant roster (8 cases, varied products + scenarios)
src/data/customers.json now has 8 applicants opening different accounts (current / savings / salary)
and each with an "intends to apply for" credit product (personal loan / credit card) that the capstone
copilot would decide next - making the onboarding -> credit handoff visible.
- omar (proceed), layla (request docs - missing address), sara (escalate - sanctions+PEP),
  daniel (non-resident, request docs - missing bank reference, tests Sec 4.3), mei (proceed),
  yusuf (escalate - PEP only), anna (escalate - sanctions only), ravi (self-employed -> proceed with
  enhanced monitoring, tests Sec 6.3).
- Agent facts extended with employment_status; the route passes category + employment_status.
- All 8 verified: correct outcome, every answer scores 100% on the trust scoreboard.

## Report with filters + rubric table + reopen
- Report view: filters (outcome, officer status, mode, search) with live metrics that recompute, a
  filtered decisions table, Download CSV and Print, and the CBUAE alignment mapping in its own panel.
- Evals: rubric shown as a 4-column table (Check / What it verifies / Why it matters / Failure looks like).
- Review queue: "Clear" on a resolved case reopens it (officer action removed, returns to queue) via
  /api/review-action status "Reopen" -> store.reopenRecord. Removed the unhelpful Clear on onboarding.

## Human-in-the-loop + Evals view + clear/reset
- Review queue: officer can Approve & onboard / Request documents / Decline, with an optional NOTE.
  The action + note + officer + time are recorded and shown in the Audit log (human-in-the-loop).
  /api/review-action updates the record; reviewed items leave the queue into "Recently actioned".
- Evals tab: runs the discrimination test live (/api/discrimination) - feeds the judge 3 deliberately
  broken answers and shows it catches 3/3, plus lists the rubric. This surfaces the proof in the app,
  not just the script. (Per-decision grading is the Trust scoreboard in Onboarding; Break-it forces a fail.)
- Clear: "Clear" resets the current decision so an application can be re-run; "Clear log (reset demo)"
  on the Audit view wipes the in-memory log for a fresh demo (DELETE /api/log).

## Multi-view app (Dashboard / Onboarding / Review / Audit / Report)
- Top navigation with 5 views. Dashboard opens first and is self-explanatory (what it does + how to use
  + live stats). Onboarding is the case console. Review queue shows cases escalated/paused for a human.
  Audit log records every decision. Report shows alignment with CBUAE expectations + live metrics.
- Decisions are logged server-side (src/lib/store.mjs, in-memory) and exposed at /api/log; the onboard
  route appends a record (case_id, outcome, trust score, RCA, time) on every run.
- The onboard route now STREAMS the real pipeline steps (retrieving -> deciding -> grading -> done) as
  newline JSON; the UI shows a live stepper instead of a generic "working" message.
- Demo guide: 09-demo/demo-guide.md (how to run + 60-second script + pitch).

## Glance-friendly decision + clickable citations
- Agent now returns summary (one causal sentence) + key_points (cited bullets) + full answer_text.
  UI shows summary + bullets up front; full reasoning is collapsed under "Full reasoning".
- Citations are clickable: the onboard route resolves each cited subsection (e.g. Section 4.2) to its
  full policy section text (from policy-index.json) and the UI reveals the rule on click. Makes the
  "grounded / auditable" claim tangible - you can verify every citation against the source.

## UI polish
Full-width 3-column console (queue | evidence | verdict) so results sit beside the documents (no
scroll-to-button); per-document icons; info tooltips for KYC/AML/PEP/sanctions/risk; Geist typography;
gold section accents; subtle hover/fade motion; initials avatars (no photos/gender - supports fairness).

## RAG search view + dashboard pipeline map
- New view "RAG search" (/api/retrieval): pick a customer, runs the SAME case query the real
  decision uses (buildCaseQuery, now exported from onboarding.mjs), scores all 9 policy sections
  by cosine similarity and shows them ranked with similarity bars - top 7 "used" (green) vs the
  rest "dropped". Makes retrieval visible, mirroring how the Evals tab makes the judge visible.
- Dashboard "pipeline map": interactive clickable steps (Documents -> Policy search -> Agent ->
  Trust judge -> Audit log -> Handoff), trust-layer steps in green, each with a detail line and a
  jump-to-tab button. Gives the app its own how-it-works map.

## Status
AI features, trust layer, and the bank-grade UI/MVP (8-applicant console) are complete and working end
to end. Sheet columns D, E, F, G, H = Done. Next: CBUAE audit report, then deploy (column I).
