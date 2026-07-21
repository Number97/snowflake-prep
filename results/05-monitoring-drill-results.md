# 05 — Monitoring drill · Attempt 1 (valid)

**Score: 70% (14/20) — below the 80% clear rule → NEEDS RE-DRILL.**

## Per-question
```
[Monitoring] Q1  ✓ — IS vs AU
[Monitoring] Q2  ✗ — IS vs AU            (real-time running queries → INFORMATION_SCHEMA)
[Monitoring] Q3  ✓ — IS vs AU
[Monitoring] Q4  ✗ — IS vs AU            (INFORMATION_SCHEMA is per-database scoped)
[Monitoring] Q5  ✗ — IS vs AU            (ACCOUNT_USAGE: longer retention + higher latency)
[Monitoring] Q6  ✓ — SNOWFLAKE db
[Monitoring] Q7  ✗ — Resource monitors   (only ACCOUNTADMIN creates them)
[Monitoring] Q8  ✓ — Resource monitors
[Monitoring] Q9  ✓ — Resource monitors
[Monitoring] Q10 ✓ — Resource monitors
[Monitoring] Q11 ✓ — Resource monitors
[Monitoring] Q12 ✗ — Query Profile       (purpose: visual execution plan + operator stats)
[Monitoring] Q13 ✓ — Query Profile
[Monitoring] Q14 ✓ — Query Profile
[Monitoring] Q15 ✓ — Views & functions
[Monitoring] Q16 ✓ — Views & functions
[Monitoring] Q17 ✓ — Views & functions
[Monitoring] Q18 ✓ — Views & functions
[Monitoring] Q19 ✓ — IS vs AU
[Monitoring] Q20 ✗ — Resource monitors   (NOTIFY only = keeps running, no enforcement)
```

## Sub-topic tally
IS vs AU **3/6** · Resource monitors **4/6** · Query Profile **2/3** · SNOWFLAKE db 1/1 · Views & functions 4/4

## Diagnosis
- **IS vs AU (3/6)** — the core, most-tested contrast is the main gap: which is real-time (INFORMATION_SCHEMA) vs delayed (ACCOUNT_USAGE), retention (short vs 365d), scope (per-database vs account-wide), dropped objects. Re-drill v2 has **7** IS-vs-AU questions.
- **Resource monitors (4/6)** — missed the creator role (ACCOUNTADMIN) and that NOTIFY alone doesn't stop a warehouse. 5 questions in v2.
- **Query Profile (2/3)** — shaky on the profile's basic purpose. 4 questions in v2.
- Solid: Views & functions (4/4), SNOWFLAKE db.

## Next
**Re-drill v2:** `06-monitoring-drill-v2.html` (fresh IDs mon101–mon120, dark theme), weighted to IS-vs-AU. Clear at ≥80% to unlock Warehouses & Performance.

Readiness after this attempt: **49%** (Data Loading 85% cleared, Monitoring now 70%, other 6 at the 40% baseline).
