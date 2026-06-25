# Phase 3: Build & AI Integration. Complete

**Goal:** *a working build with the live LLM use cases — the grounded agent and the trust-layer judge.*

## The app
**[`app/`](app/)** — the runnable Next.js application (the seven-screen bank console). It is a
self-contained project with its own dependencies, tests, deploy config, and
[README](app/README.md). Run it with `cd app && npm install && npm run dev`.

The live LLM use cases: (1) the grounded onboarding decision — retrieve policy by meaning, then
decide using only those sections, citing each claim; (2) the independent trust-layer judge that grades
each answer against the rubric and tags the cause of any failure.

## Backing material
- [`deliverables/deploy-notes.md`](deliverables/deploy-notes.md): how the app deploys.
- [`working/build-notes.md`](working/build-notes.md): build decisions and the reasoning behind them.

## Outcome
The agent, trust layer, and full console are built, type-clean, and unit-tested. Cleared to evaluate
(Phase 4).
