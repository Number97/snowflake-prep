# 03 — Data Loading re-drill v2 · Attempt 2 (valid)

**Score: 75% (15/20) — below the 80% clear rule → NEEDS another re-drill.**
Trend: attempt 1 = 70% → attempt 2 = 75%. Moving up, one notch short.

## Per-question
```
[Data Loading] Q1  ✓ — Stages
[Data Loading] Q2  ✓ — Stages
[Data Loading] Q3  ✗ — Stages          (named stage: stored file format + grantable)
[Data Loading] Q4  ✓ — Stages
[Data Loading] Q5  ✗ — Unload          (COPY INTO @stage FROM (SELECT …))
[Data Loading] Q6  ✗ — Unload          (SINGLE = TRUE for one file)
[Data Loading] Q7  ✓ — Unload
[Data Loading] Q8  ✓ — PUT/GET
[Data Loading] Q9  ✓ — PUT/GET
[Data Loading] Q10 ✓ — PUT/GET
[Data Loading] Q11 ✓ — COPY options
[Data Loading] Q12 ✓ — COPY options
[Data Loading] Q13 ✗ — COPY options    (SIZE_LIMIT)
[Data Loading] Q14 ✓ — COPY options
[Data Loading] Q15 ✓ — Snowpipe
[Data Loading] Q16 ✓ — Snowpipe
[Data Loading] Q17 ✓ — Load history
[Data Loading] Q18 ✓ — File formats
[Data Loading] Q19 ✓ — External tables
[Data Loading] Q20 ✗ — Object model    (file format is schema-level)
```

## Sub-topic tally
Unload **1/3** · Object model **0/1** · Stages 3/4 · COPY options 3/4 · PUT/GET 3/3 · Snowpipe 2/2 · Load history 1/1 · File formats 1/1 · External tables 1/1

## Diagnosis — two clear gaps left
- **Unload (1/3)** — the mechanics still slip: the `FROM (SELECT …)` query source, and `SINGLE=TRUE` vs the default multi-file/gzip behavior. v3 has 5 unload questions.
- **Object model (0/1)** — schema-level vs account-level confusion (file format is schema-level). v3 has 3 hierarchy questions.
- Single misses: named-stage capabilities (Q3), `SIZE_LIMIT` (Q13) — both reinforced in v3.

## Concept questions the user raised (answered in chat)
- Bulk `COPY INTO` vs `COPY INTO`: same command; "bulk" = the manual/batch/warehouse *mode*, vs Snowpipe's continuous serverless mode. Direction (load vs unload) is a separate axis.
- Zero-copy cloning: immutable micro-partitions let a clone share the same partitions (0 bytes copied); copy-on-write means you only pay storage for changes.

## Next
**Re-drill v3:** `04-data-loading-drill-v3.html` (fresh IDs dl401–dl420), weighted to Unload + Object model. Clear at ≥80% to unlock Monitoring.

Readiness after this attempt: **44%** (Data Loading mastery 75%, other 7 domains at the 40% baseline).
