# Case-study landing page (GitHub Pages)

This folder is the published site at **https://mxjoshi.github.io/kyc-onboarding-agent/**.
GitHub Pages serves it from `main` / `docs`. `.nojekyll` keeps Pages from processing the files.

## Files
- `index.html` — the case-study landing page (single file, inline CSS, tiny vanilla JS, no build step).
- `kyc-onboarding-agent-pitch-film.mp4` — the 90-second pitch film shown in the hero.
- `poster.jpg` — the video poster frame (shown before the film plays).
- `pitch-film.html` — the original self-contained animated film, kept as a standalone page.

## Editing
- **Swap the screenshot:** in `index.html`, find the `<!-- SWAP ME -->` comment and replace the
  `.shot` placeholder with a real `<img class="shot" src="screenshot.png" ...>`.
- **Live demo link:** the "Live demo" button points at `https://kyc-onboarding-agent.onrender.com`
  (the Render service name from `render.yaml`). If Render assigned a different host, update that one
  `href` in `index.html`.
- Design tokens (fonts, colors, spacing) live in the `:root` block at the top of `index.html`.
