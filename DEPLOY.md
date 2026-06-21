# DEPLOY - the live public link

The app is hosted on **Render** (a host that runs a real, always-on Node server).
We use Render because this app needs ONE persistent server process:
- the audit log / dashboard / review queue live in memory (`src/lib/store.mjs`), and
- the policy search uses a local ML model (transformers.js) that loads into that server.

A pure serverless host (e.g. plain Vercel) would reset the audit log between clicks and
re-download the model on every cold start, so it is not used here.

## The pieces
- **Code:** GitHub repo `Mxjoshi/kyc-onboarding-agent` (public).
- **Host:** Render web service, configured by `render.yaml` in this repo.
- **Secret:** `ANTHROPIC_API_KEY` - set ONLY in the Render dashboard, never in git.

## First-time deploy (about 5 minutes, all in the browser)
1. Go to https://render.com and sign up / log in (use "Continue with GitHub").
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub and pick the repo **kyc-onboarding-agent**.
   Render reads `render.yaml` automatically and fills in the build/start commands.
4. It will ask for the value of **ANTHROPIC_API_KEY** (because it is marked secret).
   Paste your Claude API key here. This is the only manual field.
5. Click **Apply** / **Create**. Render runs `npm install && npm run build`, then `npm run start`.
   First build takes a few minutes.
6. When it finishes, Render gives you a public URL like
   `https://kyc-onboarding-agent.onrender.com`. That is your live link to submit.

## Updating the live app later
Any time you push new code to GitHub `main`, Render rebuilds and redeploys automatically.
```
git add -A
git commit -m "your change"
git push
```

## Good to know about the free tier
- The service **sleeps after ~15 minutes of no traffic**. The next visit wakes it
  (about 50 seconds for the first request, then it is fast).
- Before a demo: open the link once a minute ahead so it is awake when you present.
- The audit log is in memory, so it resets if the service restarts. That is fine for a
  demo - you generate fresh decisions live. (To make it permanent later, swap
  `src/lib/store.mjs` for a small database.)

## If a build fails
- Check the Render logs (Logs tab).
- Most common cause: a missing or wrong `ANTHROPIC_API_KEY`. Re-check it under
  the service's **Environment** tab.
