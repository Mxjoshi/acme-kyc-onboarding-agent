# START HERE - run this app locally from scratch

You only need this if you closed the terminal / restarted the laptop and want the app
running on your own machine again. The LIVE deployed link does not need any of this - it
runs on the host 24/7 (see DEPLOY.md).

## What this is
Acme Bank UAE - a trustworthy KYC/AML onboarding agent. It reads a new customer's case
against bank policy and returns a cited decision (proceed / request documents / escalate),
refuses when the policy is silent, escalates risk to a human, and shows a visible trust layer
(rubric + LLM judge + discrimination test + root cause analysis).

## One-time setup (only the first time on a new machine)
1. Install Node.js 20 or newer (check with: `node -v`).
2. Open a terminal in this folder (`05-build/app`).
3. Install the libraries:
   ```
   npm install
   ```
4. Add your Claude API key. Copy the example file and paste your key into it:
   ```
   cp .env.example .env.local
   ```
   Then open `.env.local` and set:
   ```
   ANTHROPIC_API_KEY=sk-ant-...your key...
   ```
   This file is private and is never committed to git (it is in .gitignore).
5. Build the policy search index (only needed once, or whenever the policy changes):
   ```
   node scripts/build-index.mjs
   ```

## Run it (every time)
```
npm run dev
```
Then open http://localhost:3000 in your browser. Closing the terminal stops it - that is
normal. Re-run `npm run dev` to start again.

## Run the production version locally (what the host runs)
```
npm run build
npm run start
```

## The optional command-line checks (prove each part works)
- `node scripts/test-retrieval.mjs "do tourists need to visit a branch"`  - test search
- `node scripts/test-agent.mjs`     - run the agent on the sample customers
- `node scripts/test-evals.mjs`     - run the trust layer (judge + discrimination + refusal)

## Where things live
- `src/app/page.tsx`        the whole bank console UI (Dashboard / Onboarding / Review / Audit / Report)
- `src/app/api/`            the server routes (onboard, customers, log, review-action, discrimination)
- `src/lib/onboarding.mjs`  the agent (retrieve -> decide -> cite -> refuse)
- `src/lib/judge.mjs`       the trust layer (rubric + LLM judge + RCA)
- `src/lib/store.mjs`       the in-memory decisions log (powers Dashboard / Review / Audit / Report)
- `data/policy/`            the synthetic bank policy (the only source of truth)
- `src/data/`               the customers and the built policy index
- `DEPLOY.md`               how the live public link is hosted
