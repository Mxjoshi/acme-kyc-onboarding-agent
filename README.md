# KYC Onboarding Agent — Acme Bank UAE

A trustworthy KYC/AML customer-onboarding agent for UAE banking. It reviews a new customer
against the bank's policy and returns a **cited decision** — *proceed, request documents, or
escalate* — that an officer can defend. It **refuses when the policy is silent**, **escalates risk
to a human**, and ships with a **visible trust layer** that grades every answer.

> **Live demo:** https://kyc-onboarding-agent.onrender.com  ·  *(free host — first load may take ~50s to wake)*
>
> Synthetic data only. "Acme Bank UAE" is fictional. No real customers or company documents.

---

## Why this exists

New expats in the UAE arrive with no local credit history, so onboarding decisions are hard and
high-stakes. This agent makes each decision **grounded, cited, and auditable** — aligned with the
CBUAE's expectations for trustworthy AI in finance. It is the onboarding companion to a separate
credit-decisioning capstone: a verified customer here flows on to the credit copilot there.

## What it does

- **Grounded decisions (RAG).** Retrieves only the relevant policy sections for each case and
  decides using *those sections only* — never from memory.
- **Every claim cited.** Each statement links to the exact policy section; one click shows the rule.
- **Honest refusal.** When the policy doesn't cover a case, it says so and escalates instead of guessing.
- **Human-in-the-loop.** Sanctions / PEP / uncovered cases are escalated to an officer, never auto-approved.
- **Visible trust layer.** A second LLM judge grades every answer against a 4-point rubric, scores it,
  and tags the root cause of any failure (bad retrieval vs bad generation).
- **Proven, not claimed.** A built-in *discrimination test* feeds the judge deliberately broken answers
  and shows it catches them — the proof the grader can be trusted.
- **Full bank console.** Dashboard, Onboarding, Review queue, RAG search (retrieval visualised),
  Evals, Audit log, and a CBUAE-aligned Report.

## Tech stack

| Layer | Tool |
|---|---|
| UI | React |
| Framework | Next.js (App Router) + TypeScript |
| AI (decision + judge) | Claude — Anthropic API (`claude-opus-4-8`) |
| Retrieval (RAG) | local embeddings via `transformers.js` (`all-MiniLM-L6-v2`) + cosine similarity |
| Hosting | Render (persistent Node server) |

## Run locally

> Requires Node.js 20+ and an Anthropic API key.

```bash
npm install                       # install dependencies
cp .env.example .env.local        # then put your key in .env.local: ANTHROPIC_API_KEY=sk-ant-...
node scripts/build-index.mjs      # build the policy search index (once)
npm run dev                       # start at http://localhost:3000
```

Production build (what the host runs): `npm run build && npm run start`.

Optional command-line checks:

```bash
node scripts/test-retrieval.mjs "do tourists need to visit a branch"   # test search
node scripts/test-agent.mjs                                            # run the agent on sample customers
node scripts/test-evals.mjs                                            # run the trust layer
```

See **[START-HERE.md](START-HERE.md)** for a full from-scratch setup and **[DEPLOY.md](DEPLOY.md)**
for how the live app is hosted.

## How it works

```
Documents + policy  →  RAG search (transformers.js)  →  Agent decides, cited (Claude)
                    →  Trust judge grades it (Claude)  →  Audit log  →  handoff to credit copilot
```

The agent (`src/lib/onboarding.mjs`) retrieves the relevant policy sections and asks Claude to decide
using only those, citing each claim. The trust layer (`src/lib/judge.mjs`) independently grades the
result. Decisions are recorded in an in-memory store (`src/lib/store.mjs`) that powers the dashboard,
review queue, audit log, and report.

## Security

The Anthropic API key lives only in `.env.local` (gitignored) locally, and as a secret environment
variable in the host. It is never committed to the repository.
