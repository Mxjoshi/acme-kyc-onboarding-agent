# P2: Data Schema (tables and fields)

Project: Trustworthy KYC Onboarding Agent. Stack: Next.js / TypeScript.
Design goal: the SHARED customer profile this agent outputs must feed the capstone's credit copilot
directly. The capstone's core entity is `Applicant` (see AI-Capstone/src/lib/types.ts). Our onboarding
agent VERIFIES the same economic fields the capstone later SCORES, so the handoff is one object.

## A. The shared layer (both apps read this)

### CustomerProfile  (THE CONNECTOR, the verified output of onboarding, the input to credit)
A superset: identity + KYC/AML status (new, ours) PLUS the exact economic fields the capstone's
`Applicant` needs. The capstone consumes the economic subset unchanged.

| Field | Type | Source | Notes |
|---|---|---|---|
| customer_id | string | onboarding | shared key across both apps |
| full_name | string | passport | matches capstone Applicant.full_name |
| nationality | string | passport | KYC |
| date_of_birth | string (ISO) | passport | KYC |
| age_years | number | derived | matches capstone (policy input) |
| passport_number | string | passport | KYC, masked in UI |
| emirates_id | string | Emirates ID | KYC, masked in UI |
| kyc_status | "verified" \| "pending" \| "rejected" \| "escalated" | onboarding | our output |
| aml_risk_band | "low" \| "medium" \| "high" | onboarding | our output |
| pep_flag | boolean | screening | politically exposed person |
| sanctions_hit | boolean | screening | AML |
| months_in_uae | number | visa / Emirates ID | matches capstone |
| visa_type | "employment" \| "golden" \| "green" \| "other" | visa | matches capstone |
| visa_months_remaining | number | visa | matches capstone |
| employment_status | "employed" \| "self_employed" \| "unemployed" | salary certificate | matches capstone |
| job_tenure_months | number | salary certificate | matches capstone |
| employer_category | "government" \| "mainland_private" \| "free_zone" \| "sme" \| "other" | salary cert | matches capstone |
| monthly_salary_aed | number | salary certificate | matches capstone |
| rent_history | "on_time_6plus" \| "on_time_under_6" \| "late_payments" \| "none" | tenancy contract | matches capstone |
| field_provenance | FieldProvenance[] | onboarding | which document verified each field |

### FieldProvenance  (why we can trust each value, supports explainability + audit)
| Field | Type | Notes |
|---|---|---|
| field_name | string | e.g. "monthly_salary_aed" |
| source_document_id | string | which uploaded doc it came from |
| source_section | string | where in that doc |
| verified | boolean | did a check confirm it |

### CustomerDocument  (the customer's own uploaded files, shared)
| Field | Type | Notes |
|---|---|---|
| document_id | string | |
| customer_id | string | |
| doc_type | "passport" \| "emirates_id" \| "visa" \| "salary_certificate" \| "tenancy_contract" \| "other" | |
| file_name | string | synthetic only |
| extracted_text | string | what the agent reads |

## B. The onboarding RAG + agent layer (buildathon-specific)

### PolicyChunk  (KYC/AML policy, chunked and embedded for retrieval)
| Field | Type | Notes |
|---|---|---|
| chunk_id | string | |
| doc_title | string | e.g. "Acme Bank KYC and AML Policy" |
| section | string | the citable section label |
| text | string | the chunk |
| embedding | number[] | local embedding (transformers.js) |

### OnboardingCase  (one run of the agent on one customer)
| Field | Type | Notes |
|---|---|---|
| case_id | string | |
| customer_id | string | |
| created_at | string (ISO) | |
| query_context | string | what was checked |
| recommendation | "proceed" \| "request_documents" \| "escalate" | the agent's output |
| missing_documents | string[] | if request_documents |
| escalation_reason | string \| null | if escalate |
| answer_text | string | grounded explanation |
| citations | Citation[] | one per claim |
| confidence | "high" \| "medium" \| "low" | confidence signal |
| status | "awaiting_review" \| "closed" | mirrors capstone CaseRecord |

### Citation  (every claim traces to a policy section)
| Field | Type | Notes |
|---|---|---|
| claim | string | the sentence being supported |
| chunk_id | string | which PolicyChunk |
| doc_title | string | |
| section | string | the exact cited section |

## C. The trust layer (evals + RCA, the core, never cut)

### RubricCheck  (one yes/no grading question)
| Field | Type | Notes |
|---|---|---|
| check_id | string | |
| question | string | e.g. "Is every claim supported by a cited chunk" |

### EvalResult  (the LLM judge's verdict on one OnboardingCase)
| Field | Type | Notes |
|---|---|---|
| eval_id | string | |
| case_id | string | |
| per_check | { check_id: string; passed: boolean; reason: string }[] | per-rubric result |
| score | number | passed checks / total |
| failed_checks | string[] | which checks failed |
| rca_tag | "bad_retrieval" \| "bad_generation" \| "ambiguous_input" \| "none" | root cause |

### DiscriminationCase  (deliberately broken outputs to prove the rubric catches them)
| Field | Type | Notes |
|---|---|---|
| name | string | e.g. "hallucinated_answer", "wrong_citation", "confident_unanswerable" |
| broken_output | OnboardingCase | the planted bad case |
| expected_to_fail | string[] | which checks SHOULD fail |
| caught | boolean | did the rubric actually catch it |

## D. The handoff (how the two apps connect)
1. Onboarding agent runs, writes a CustomerProfile with kyc_status = "verified".
2. The capstone reads that CustomerProfile and maps its economic fields straight onto `Applicant`.
3. The capstone runs its scorecard + policy + explanation on the already-verified person.

One customer_id, one CustomerProfile, two agents. No re-entry of data.

## Notes
- Synthetic data only. customer_id, passport_number, emirates_id are fake.
- Field names for the economic fields are kept IDENTICAL to the capstone so mapping is a no-op.
- v1 storage can be in-memory / JSON files, shaped to become real tables later (same as the capstone).
