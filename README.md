# KYC Onboarding Agent (Acme Bank UAE)

A trustworthy KYC/AML customer-onboarding agent for UAE banking. It reviews a new customer
against the bank's policy and returns a decision an officer can defend: **proceed, request
documents, or escalate**. Every claim is **cited to the exact policy section**, it **refuses when
the policy is silent** instead of guessing, it **escalates risky cases to a human**, and a built-in
**trust layer grades every answer**.

> Synthetic data only. "Acme Bank UAE" is fictional. No real customers or company documents.

**Live demo:** will be added here after deployment (host: Render). See [DEPLOY.md](DEPLOY.md).

## Why this exists

New expats in the UAE arrive with no local credit history, so onboarding decisions are hard and
high-stakes. This agent makes each decision grounded, cited, and auditable, in line with the
CBUAE's expectations for trustworthy AI in finance. It is the onboarding companion to a separate
credit-decisioning capstone: a customer verified here flows on to the credit copilot there.

## What it does

- **Grounded decisions (RAG).** It first retrieves the few relevant policy sections for the case,
  then decides using only those sections, never from memory.
- **Every claim cited.** Each statement links to the exact policy section, and one click shows the rule.
- **Honest refusal.** When the policy does not cover a case, it says so and escalates instead of guessing.
- **Human in the loop.** Sanctions, PEP, or uncovered cases are escalated to an officer, never auto-approved.
- **Visible trust layer.** A second AI call (the judge) grades every answer against a 4-point rubric,
  scores it, and tags the cause of any failure (bad retrieval vs bad generation).
- **Proven, not just claimed.** A built-in discrimination test feeds the judge deliberately broken
  answers and shows it catches them, which is the proof the grader can be trusted.
- **Full bank console.** Dashboard, Onboarding, Review queue, RAG search, Evals, Audit log, and a
  CBUAE-aligned Report.

## Tech stack

| Layer | Tool |
|-------|------|
| UI | React |
| Framework | Next.js (App Router) + TypeScript |
| AI (decision + judge) | Claude, via the Anthropic API (`claude-opus-4-8`) |
| Retrieval (RAG) | local embeddings with `transformers.js` (`all-MiniLM-L6-v2`) + cosine similarity |
| Hosting | Render (a persistent Node server) |

## How it works

```
Documents + policy  ->  RAG search (transformers.js)  ->  Agent decides, cited (Claude)
                    ->  Trust judge grades it (Claude)  ->  Audit log  ->  handoff to credit copilot
```

The agent (`src/lib/onboarding.mjs`) retrieves the relevant policy sections and asks Claude to decide
using only those, citing each claim. The trust layer (`src/lib/judge.mjs`) independently grades the
result. Decisions are kept in an in-memory store (`src/lib/store.mjs`) that powers the dashboard,
review queue, audit log, and report.

## Run locally

Requires Node.js 20+ and an Anthropic API key.

```bash
npm install                      # install dependencies
cp .env.example .env.local       # then add your key: ANTHROPIC_API_KEY=sk-ant-...
node scripts/build-index.mjs     # build the policy search index (run once)
npm run dev                      # open http://localhost:3000
```

Production build (what the host runs): `npm run build && npm run start`.

A full from-scratch guide is in [START-HERE.md](START-HERE.md).

## Security

The Anthropic API key lives only in `.env.local` (gitignored) on your machine, and as a secret
environment variable on the host. It is never committed to the repository.
