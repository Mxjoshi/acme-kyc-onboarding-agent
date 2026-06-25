# P0: Problem and Idea

## The one problem
When an expat newcomer tries to open a UAE bank account, onboarding is slow and inconsistent.
A compliance officer must check identity, AML risk, and document requirements by hand against
scattered policy and regulation. Mistakes are costly: a wrong approval is an AML breach, a wrong
rejection loses a good customer, and every decision must be explainable to a regulator. Generic
AI chatbots make this worse, because they sound confident even when they are wrong, and a confident
wrong answer in KYC is a compliance failure.

## Who it is for
The bank's onboarding / compliance officer (primary user), and the bank's risk and audit function
(who must prove every decision was sound).

## The idea
An agentic KYC and onboarding assistant. The officer enters a new customer's details. The agent
retrieves the relevant policy and AML rules, checks the file step by step, and returns a grounded
recommendation: proceed, request more documents, or escalate. Every statement cites the exact policy
clause it used. If the policy does not cover the case, the agent says so and refuses to guess. Risky
or borderline profiles are escalated to a human, never auto-approved.

The point is not the chat. The point is the visible trust layer: citations on every claim, honest
refusal, an evaluation harness that is proven to catch bad answers (including a discrimination test
with planted hallucinations), root cause analysis when a check fails, and a one-page audit report
mapped to the CBUAE Feb 2026 Guidance Note.

## Why it matters here (UAE)
KYC and AML are heavily regulated and high stakes. UAE supervisory expectations require
explainability, human oversight, the ability to challenge an outcome, and audit trails. This assistant
is built around exactly those requirements, so it is regulation-aligned by design, not by accident.

## How it connects to the capstone
Same persona, the expat newcomer, one stage earlier. This assistant onboards the newcomer safely;
the capstone (Newcomer Credit Decisioning Copilot) then decides whether to lend to them. Together they
cover the trustworthy newcomer banking journey: get in the door, then get credit.

## Success criteria (yes / no checks, to expand in the PRD)
- [ ] Does every answer cite the exact policy section it used?
- [ ] When the policy does not contain the answer, does the agent refuse instead of guessing?
- [ ] Does it escalate risky or borderline profiles to a human rather than auto-approving?
- [ ] Does the eval harness catch a planted hallucination (the discrimination test)?
- [ ] Can it produce a one-page audit report mapped to the CBUAE Guidance Note?

## Scope guardrails
- Synthetic / public documents only. Never real customer or company documents.
- One narrow task (KYC onboarding), done well, not a broad banking assistant.
