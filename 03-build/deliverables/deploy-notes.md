# Deploy (column I)

Status: CODE LIVE ON GITHUB + HOSTING READY. One browser click in Render remains for the public URL.

## What is done
1. Production build verified locally - `npm run build` type-checks the whole app and the full
   pipeline (embeddings -> Claude -> judge) runs on the production server. Two type errors that the
   dev server had ignored were found and fixed:
   - judge.mjs: `availableSections` made optional (default null).
   - page.tsx: cast SourcedCitation when reading source_text.
2. Git committed (the secret .env.local stays gitignored - the API key never leaves the machine).
3. Pushed to a NEW PUBLIC GitHub repo:
   https://github.com/Mxjoshi/kyc-onboarding-agent
4. Hosting configured for Render (a persistent Node host) via `render.yaml` in the app:
   - Why Render, not plain Vercel: this app needs ONE always-on server because the audit log lives
     in memory (store.mjs) and the local search model (transformers.js) loads into that server.
     Serverless would reset the log between clicks and re-download the model on cold starts.
   - render.yaml: web service, region frankfurt (closest to UAE), build `npm install && npm run build`,
     start `npm run start`, env var ANTHROPIC_API_KEY marked secret (sync:false), Node pinned >=20.
5. Docs added inside the app so it is self-restarting:
   - 05-build/app/START-HERE.md - run locally from scratch after the terminal/laptop is closed.
   - 05-build/app/DEPLOY.md - the full Render deploy steps + free-tier notes.

## The one remaining step (browser, ~5 min, user does it)
Render needs a one-time sign-in and "Apply" that cannot be done from the terminal:
1. render.com -> sign in with GitHub.
2. New + -> Blueprint -> pick repo `kyc-onboarding-agent` (it reads render.yaml).
3. Paste the Claude API key when asked (this is the only manual field; never in Git).
4. Apply -> wait for build -> get the public URL `https://kyc-onboarding-agent.onrender.com`.

## To record here once live
- Live app URL: __________ (paste after Render finishes)
- Repo URL: https://github.com/Mxjoshi/kyc-onboarding-agent
- Redeploys happen automatically on every `git push` to main.
