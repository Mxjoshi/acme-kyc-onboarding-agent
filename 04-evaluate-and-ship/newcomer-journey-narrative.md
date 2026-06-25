# The Newcomer Journey: how the two tools connect

The connective story for the portfolio and the demo. Persona: Omar, a newcomer to the UAE.

## The person
Omar just moved to Dubai for a job. He has a passport, an Emirates ID application, a salary
certificate, and no UAE credit history (a blank AECB file). He needs to open an account, then
later get a credit card or loan. Two problems, two moments.

## Problem 1 (BUILDATHON tool): getting in the door
The bank must onboard him: verify identity, run KYC/AML, confirm documents meet policy. Today this
is slow, manual, and error prone, and every step must be explainable to a regulator.

What the onboarding agent does:
1. Officer enters Omar's details and documents.
2. Agent retrieves the relevant KYC/AML policy and checks the file step by step.
3. Returns a grounded recommendation: proceed, request more documents, or escalate, with every
   statement citing the exact policy clause.
4. If policy does not cover the case, it refuses to guess.
5. If Omar is high risk or borderline, it escalates to a human. It never auto-approves.

Outcome: Omar is safely, defensibly onboarded, with an audit trail.

## The transition (the handoff)
Onboarding answers: "Can this person become a customer?" Once yes and Omar has an account, a new
question appears when he asks for credit: "Can we safely lend to this person?" The onboarding agent
produces a verified profile (identity confirmed, risk rating, documents on file). That verified
profile is the input the credit tool needs. Omar moves from being onboarded to being assessed for credit.

## Problem 2 (CAPSTONE, already built): getting credit
Omar's AECB file is blank, so a normal scorecard says no. The Newcomer Credit Decisioning Copilot
takes his verified profile plus alternative data (salary, tenure, rent history) and produces a
defensible approve / decline / refer decision with a plain-language explanation. A human decides.

## One-line portfolio story
"I built the trustworthy newcomer banking journey: one agent gets the expat safely in the door
(onboarding, the buildathon), and one copilot decides if they can borrow (credit, the capstone).
Both explain themselves, both refuse when unsure, both escalate to a human, and both are proven
with an eval harness."
