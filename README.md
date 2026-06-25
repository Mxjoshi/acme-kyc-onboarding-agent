# KYC Onboarding Agent (Acme Bank UAE)

An agentic KYC/AML onboarding assistant for UAE banking. It checks a newcomer against the bank's
policy and returns a decision an officer can defend: **proceed, request documents, or escalate** —
every claim cited to the exact policy section, with a visible trust layer that grades each answer and
proves it can catch a bad one. The onboarding companion to the
[Newcomer Credit Decisioning Copilot](https://github.com/Mxjoshi) capstone: same persona, same
regulator, two stages of one journey — this onboards the customer, the capstone decides their credit.

> **The gap we fill:** the UAE is about 88% expat, and a new arrival has no local credit history and
> a thin document file. Onboarding them is high-stakes and mostly manual, and a wrong call is a
> compliance risk. This agent makes each decision **grounded, cited, and auditable**, in line with the
> CBUAE's expectations for trustworthy AI in finance — so an officer gets a fast, consistent,
> defensible call instead of a slow manual review.

> Synthetic data only. "Acme Bank UAE" is fictional. No real customers or company documents.

## How the product works
The agent retrieves the few relevant policy sections for a case (RAG), then asks Claude to decide
using **only** those sections, citing each claim. When the policy does not cover a case it **refuses
and escalates** instead of guessing, and any sanctions/PEP/uncovered case is **routed to a human**,
never auto-approved. Around the decision sits the trust layer: a second, independent Claude call
**grades every answer** against a rubric, scores it, and tags the cause of any failure — and a
built-in **discrimination test** feeds the judge deliberately broken answers to prove it catches them.
Every decision lands in an audit log mapped to the CBUAE Feb 2026 Guidance Note.

**The working app lives in [`03-build/app/`](03-build/app/)** — a Next.js console with seven screens
(Dashboard, Onboarding, Review queue, Policy search, Trust layer, Audit log, Report). See its
[README](03-build/app/README.md) to run or deploy it.

## Where the project stands
The agent, the trust layer, and the full console are **built, type-clean, and tested** (`npm test` in
the app). Deployment is the final step.

| Phase | Folder | Deliverable | Status |
|---|---|---|---|
| 1. Scope & Research | [`01-scope-and-research/`](01-scope-and-research/) | UAE direction research, the one problem, the core idea | **Complete** |
| 2. Design | [`02-design/`](02-design/) | PRD, data schema, AI-feature + retrieval design | **Complete** |
| 3. Build & AI Integration | [`03-build/`](03-build/) | The grounded agent + trust layer + seven-screen console | **Complete** |
| 4. Evaluate & Ship | [`04-evaluate-and-ship/`](04-evaluate-and-ship/) | Eval harness, discrimination test, RCA, demo guide | **Evals complete; live deploy pending** |

## Repository map
- **`01` to `04`:** the work, one folder per phase. Each phase folder has a `README.md`, a
  `deliverables/` folder (the graded outputs), and `working/` (the reasoning behind them).
- **`03-build/app/`:** the runnable Next.js application (its own deploy config, tests, and README).
- **`SPEC.md`:** the locked thesis, rules, and plan.
- **`render.yaml`:** one-click Render blueprint (points at `03-build/app` via `rootDir`).

## How this is built
Product decisions, scope, and sign-offs are Monika's. The engineering pair is Claude Code.
