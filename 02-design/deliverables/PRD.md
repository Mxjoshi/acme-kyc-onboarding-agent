# PRD: Trustworthy KYC Onboarding Agent for UAE Banking

Author: Monika. Date: 2026-06-21. Status: draft for approval.
Companion to the capstone (Newcomer Credit Decisioning Copilot). Buildathon project.

## 1. The one problem
Onboarding an expat newcomer to a UAE bank is slow, manual, and inconsistent. An officer checks
identity, AML risk, and document requirements by hand against scattered policy. A wrong approval is
an AML breach, a wrong rejection loses a good customer, and every decision must be explainable to a
regulator. A confident-but-wrong AI makes this worse, so the AI must prove it is trustworthy.

## 2. The user
Primary: the bank's onboarding / compliance officer.
Secondary: the risk and audit function, who must prove every decision was sound.

## 3. The three core capabilities
1. Grounded onboarding check. Take a newcomer's details and documents, retrieve the relevant
   KYC/AML policy, and return a recommendation: proceed, request more documents, or escalate.
   Every claim cites the exact policy section it used.
2. Honest refusal and escalation. If the policy does not cover the case, the agent says it does not
   know instead of guessing. Risky or borderline profiles are escalated to a human, never auto-approved.
3. A proven trust layer. An evaluation harness scores each answer against a rubric using an LLM judge,
   AND a discrimination test feeds deliberately broken outputs (a hallucination, a wrong citation, a
   confident answer to an unanswerable case) and proves the rubric catches each one. Failures get a
   root cause tag (bad retrieval, bad generation, or ambiguous input).

## 4. Success criteria (yes / no)
- [ ] Does every answer cite the exact policy section it used?
- [ ] When policy does not contain the answer, does the agent refuse instead of guessing?
- [ ] Does it escalate risky or borderline profiles to a human rather than auto-approving?
- [ ] Does the LLM judge return a per-answer score and list which checks failed?
- [ ] Does the discrimination test catch a planted hallucination, a wrong citation, and a confident
      answer to an unanswerable case?
- [ ] Does each failure get a root cause tag?
- [ ] Can it produce a one-page audit report mapped to the CBUAE Feb 2026 Guidance Note?
- [ ] Does it run end to end with one command, with a UI showing the answer, citations, a confidence
      signal, and a live rubric scoreboard, plus a "break it" toggle?

## 5. Out of scope (for the buildathon)
- Real customer or company documents (synthetic / public only).
- A broad banking assistant. One narrow task: KYC onboarding, done well.
- Connecting live to AECB, UAE Pass, or any real bank system.
- A trained ML model. Retrieval plus an LLM is enough for v1.

## 6. The demo (what "done and undeniable" looks like)
1. Enter a complete newcomer: agent returns "proceed" with cited policy clauses.
2. Enter an incomplete or out-of-policy case: agent refuses and explains why.
3. Enter a high-risk case: agent escalates to a human.
4. Hit "break it": bad retrieval is injected and the scoreboard catches the failure on screen, with
   a root cause tag.
5. Show the one-page CBUAE-mapped audit report.

## 7. Stack
Next.js / TypeScript, to MATCH the capstone (Newcomer Credit Decisioning Copilot) so the two apps
can connect or merge later with minimal friction. Local vector store and local embeddings via
transformers.js (avoids the no-Anthropic-embeddings problem, runs offline, one command). Anthropic
API (Claude) for generation and the LLM judge. Optional MCP wrapper exposing the same functions as
tools. One repo, one command.

Connection design (the real connector): the apps link via a shared data contract, the "verified
customer profile" that this onboarding agent OUTPUTS and the capstone credit copilot CONSUMES as input.
In P2 we read the capstone's data model first and shape the onboarding output to feed it directly.

## 8. Rules
Synthetic docs only. Approve each phase. Explain each design decision in one line before its code.
If time runs low, cut UI polish, never the eval harness. No em dashes in code or output copy.
