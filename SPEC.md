# Our Plan (outcome-first)

## The outcome we are aiming at
A project so credible a Dubai fintech/banking hiring manager cannot ignore it, plus a one minute
story that proves the candidate can build trustworthy, explainable AI for regulated finance.

## The project
An AGENTIC KYC / onboarding assistant for the UAE expat newcomer. It checks identity, AML, and
document requirements against policy using RAG, explains each step with citations, refuses to
approve incomplete files, and escalates risky profiles to a human. A visible trust layer proves
the answers are honest. Companion to the capstone (credit decisioning); same newcomer, earlier
stage of the journey. Adds the skills the capstone lacks: RAG, agentic behavior, MCP.

## What "done and undeniable" looks like (work backward from here)
1. A live demo: enter an application, get a cited recommendation, watch it refuse + escalate.
2. A "break it" moment: inject a bad input, the scoreboard catches the hallucination on screen.
3. A one-page audit/eval report mapped clause by clause to the CBUAE Feb 2026 Guidance Note.
4. A short written case study + the live link + the repo, ready to send to a recruiter.

## Build order (our phases, approve each before moving on)
- P0  Problem + idea (half page)            -> 01-problem-idea
- P1  PRD: 3 capabilities, yes/no success    -> 02-prd
- P2  Synthetic data + policy docs + schema  -> 03-data-schema, sample-documents
- P3  Retrieval working on a test query      -> 05-build
- P4  Grounded recommendation + citations + refuse/escalate -> 05-build
- P5  Trust layer: rubric + LLM judge + discrimination test -> 07-evals  (NEVER cut this)
- P6  RCA: tag why a check failed            -> 08-rca
- P7  UI: application input, recommendation, citations, confidence, live scoreboard, break-it toggle -> 05-build
- P8  CBUAE one-page audit report            -> 09-demo
- P9  Push to Git + make it live             -> 06-deploy
- P10 Demo script + recruiter case study     -> 09-demo

## Rules
- Synthetic / public documents only. Never real company documents.
- Stop for approval after each phase.
- Explain each design decision in one line before writing its code.
- If time runs low, cut UI polish, never the eval harness.
- No em dashes in code comments or output copy.
- Avoid the refuted claims (no SHAP-named-by-CBUAE, no specific hiring %s, no Kiteworks stats).

## Stack (proposed)
Python backend, simple web UI, local vector store (Chroma or FAISS), local embeddings
(sentence-transformers), Anthropic API (Claude) for generation and the LLM judge. One repo, one command.

## Open choices to confirm
- Target: CBUAE-regulated bank framing (default) vs DIFC/ADGM fintech framing.
- Stack: accept the proposed stack above, or adjust.
