# 02 — Data Loading drill · Attempt 1 (valid)

**Score: 70% (14/20) — below the 80% clear rule → NEEDS RE-DRILL.**
*(This is the first valid attempt. The earlier slot-A-bug build was voided — see `02-data-loading-drill-v1-voided.md`.)*

## Per-question
```
[Data Loading] Q1  ✗ — Stages
[Data Loading] Q2  ✗ — PUT/GET
[Data Loading] Q3  ✗ — Stages
[Data Loading] Q4  ✓ — COPY options
[Data Loading] Q5  ✓ — COPY options
[Data Loading] Q6  ✓ — COPY options
[Data Loading] Q7  ✗ — COPY options
[Data Loading] Q8  ✓ — COPY options
[Data Loading] Q9  ✗ — Unload
[Data Loading] Q10 ✗ — Unload
[Data Loading] Q11 ✓ — PUT/GET
[Data Loading] Q12 ✓ — PUT/GET
[Data Loading] Q13 ✓ — Snowpipe
[Data Loading] Q14 ✓ — Snowpipe
[Data Loading] Q15 ✓ — Snowpipe
[Data Loading] Q16 ✓ — Warehouses
[Data Loading] Q17 ✓ — Load history
[Data Loading] Q18 ✓ — File formats
[Data Loading] Q19 ✓ — External tables
[Data Loading] Q20 ✓ — Object model
```

## Sub-topic tally
Stages **0/2** · Unload **0/2** · PUT/GET 2/3 · COPY options 4/5 · Snowpipe 3/3 · Warehouses 1/1 · Load history 1/1 · File formats 1/1 · External tables 1/1 · Object model 1/1

## Diagnosis
- **Stages (0/2)** — shaky on what a stage *is* and which stage type fits which job. Addressed with a concept-first prose explainer + 4 stage questions in the re-drill.
- **Unload (0/2)** — didn't have `COPY INTO @stage FROM (SELECT …)`, default multi-file + gzip, `SINGLE=TRUE`. 3 unload questions in the re-drill.
- **PUT/GET (2/3)** — mostly there; reinforced GET direction, internal-only, AUTO_COMPRESS.
- Solid: Snowpipe, COPY options (bar one), load history, formats, external tables, object model.

## Concept questions the user raised (answered in chat)
- What a stage is (file location / loading dock, not a table/compute).
- Snowpipe vs COPY INTO (Snowpipe = serverless automated wrapper around COPY).
- DDL (Data Definition Language: CREATE/ALTER/DROP).

## Next
**Re-drill:** `03-data-loading-drill-v2.html` (fresh IDs dl301–dl320), weighted to Stages/Unload/PUT/GET. Clear at ≥80% to move on to Monitoring.

Readiness after this attempt: **44%** (mean domain mastery with Data Loading now at 70%, others at the 40% diagnostic baseline).
