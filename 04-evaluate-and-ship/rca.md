# RCA - root cause analysis of failures

When a rubric check fails, the LLM judge (src/lib/judge.mjs) assigns a root cause tag so a failure
points to the real problem, not just "it was wrong".

## The tags
- bad_retrieval   - the policy section needed to answer correctly was NOT among the sections the
                    agent was given, so it could not have used it. Fix: improve retrieval.
- bad_generation  - the needed section WAS available but the agent misused, contradicted, ignored
                    it, or invented content. Fix: improve the prompt / model behavior.
- ambiguous_input - the case itself was unclear, so the answer could not be graded fairly.
- none            - every check passed.

To tell bad_retrieval from bad_generation, the judge is told which sections the agent actually had
(availableSections), not just the full policy.

## Worked example (the find-diagnose-fix-verify loop) - the demo highlight
1. First run: Omar wrongly ESCALATED (score 0%).
2. The eval flagged it. Root cause: retrieval pulled only 5 of 9 sections and missed Section 6
   (AML risk), so the agent escalated for missing AML info -> tag bad_retrieval.
3. Fix: retrieve 7 sections, and pass the agent's available sections to the judge.
4. Re-run: Omar PROCEED, score 100%. The same eval verified the fix.

This is the story that shows the trust layer is real: it found a regression a human would miss,
named the cause, and confirmed the fix.

## Status
Done. RCA tags are produced on every graded answer and proven by the Omar loop above.
