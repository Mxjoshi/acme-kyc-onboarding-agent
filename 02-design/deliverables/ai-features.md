# AI features (column F) - what we built and how

All code lives in 05-build/app. Synthetic data only. Model: claude-opus-4-8. Embeddings: local
(transformers.js, Xenova/all-MiniLM-L6-v2). One API key in 05-build/app/.env.local (kept out of Git).

## 1. Ingestion (build the searchable index)
- scripts/build-index.mjs splits the KYC/AML policy into 9 sections (one chunk each), embeds each
  locally, and saves src/data/policy-index.json. Run once when the policy changes.

## 2. Retrieval (find the right policy by meaning)
- src/lib/onboarding.mjs -> retrieve(query, k). Embeds the query, ranks chunks by cosine similarity,
  returns the top k. Proven by scripts/test-retrieval.mjs.

## 3. Grounded answer agent (the decision)
- src/lib/onboarding.mjs -> answerCase(caseFacts). Retrieves the relevant sections, then asks Claude
  to decide proceed / request_documents / escalate using ONLY those sections, citing each claim, and
  refusing to guess. Output is structured JSON (structured outputs / json_schema).
- Tested by scripts/test-agent.mjs on Omar (proceed), Layla (request documents), Sara (escalate).
  All three correct and cited.

## 4. Refusal path (honest "I don't know")
- src/lib/onboarding.mjs -> answerQuestion(question). Answers a free-text policy question or refuses
  when the policy does not cover it. Used for the deliberate policy gap (tourist/remote/crypto).

## Status
Done. Retrieval, grounded cited answers, refusal, and escalation all work and are tested.
Credentials (API key) added and verified. Sheet column F = Done.
