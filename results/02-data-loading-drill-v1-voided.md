# 02 — Data Loading drill · v1 attempt · VOIDED

**Score: 59% (13/22) — does NOT count toward clearing the domain.**

## Why it was voided
The v1 quiz had three build defects that made the result unreliable:
1. **Answer position was fixed** — every correct answer was the first option (slot A).
   The user noticed partway through and could pattern-match the rest, so the later
   "correct" answers reflect the bug, not knowledge.
2. **A diagram revealed the answer** before the user clicked (the COPY-vs-Snowpipe SVG
   rendered in the question stage with answer-giving labels).
3. **Explanations were too shallow** — they justified the key without teaching the
   whole question.

## What changed
- New `build-quiz` skill codifies the quality bar (shuffle answers every render,
  no spoiler visuals pre-validation, deep teaching on every question).
- CLAUDE.md §6 gained a "Quiz integrity — NON-NEGOTIABLE" block.
- The drill was rebuilt (`02-data-loading-drill.html`) with 20 fresh questions,
  Fisher–Yates option shuffling (verified ~25% per slot), feedback-only diagrams,
  and 3-part explanations (concept / why-others-wrong / trap).

## Signal worth keeping (directional only, not scored)
Genuine early misses before the pattern was spotted point to real weak spots:
**Stages, COPY options, Unload, PUT/GET.** The rebuilt drill weights toward these.

Readiness stays **40%** (no valid domain score recorded).
