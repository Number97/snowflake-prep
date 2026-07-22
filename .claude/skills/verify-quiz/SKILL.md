---
name: verify-quiz
description: Post-creation correctness gate for a SnowPro quiz. Runs after ANY quiz is authored/edited, before commit. Two passes — deterministic structural check (scripts/verify_quiz.js) + an independent fact-check of every question against verified Snowflake behavior. Fixes anything wrong, then re-verifies. Also runs when the user says /verify-quiz.
---

# verify-quiz — does the quiz tell the TRUTH? (run after every build)

`build-quiz` sets the standard while authoring. **verify-quiz is the independent
audit that runs after the file exists** and must pass before the quiz is
committed. It answers two questions: (1) is the quiz structurally sound, and
(2) is every fact actually TRUE. If either fails, fix and re-run.

## Pass 1 — Structural / integrity gate (deterministic, always first)
Run:
```
node scripts/verify_quiz.js quizzes/<file>.html
```
It parses the `Q` array and flags (exit 1 on any ERROR):
- missing/empty required fields (`id`, `sub`, `q`, `opts`, `a`, `why`, `concept`, `trap`)
- invalid answer key (out-of-range/duplicate indices, empty, or all options correct)
- duplicate question IDs or duplicate option text
- **explanations that reference an option by letter/position** ("option C", "the
  first option", "slot A") — this breaks answer-shuffling (R1) and is an ERROR
- opts count outside 2–5
- WARN: `why` item count ≠ number of distractors (each wrong option should be explained)

Fix every ERROR and re-run until exit 0. Address WARNINGs unless clearly intended.

## Pass 2 — Fact-check every question (the "trueness" audit)
Verify, for EACH question: the stem, the marked-correct option(s), every
distractor, and the explanation — against authoritative Snowflake behavior.
- Spawn an **independent subagent** (general-purpose, with web search) so the
  check isn't just the author re-reading their own work. Give it each question's
  stem + the option marked correct + the key claim, and ask it to return a
  structured list of anything factually wrong, with the correction and a source.
  Prefer official Snowflake docs. Run it **synchronously** so you can act on it.
- For **volatile** values (retention limits, edition boundaries, credit rates,
  GA status, cluster/size caps) require a doc-backed confirmation; if it can't be
  confirmed, change the question to a stable fact or remove it (P1: never ship an
  uncertain claim).
- Cross-check against CLAUDE.md §7 and its known corrections (e.g. external
  tables cannot be cloned; DB clone skips external tables + internal named stages).

## Fix + re-verify loop
For every confirmed problem: correct the stem/options/answer key/explanation in
the HTML (keep answers shuffled — never reorder to a fixed slot as a "fix"). Then
**re-run Pass 1 and re-check the fixed items**. Repeat until both passes are
clean. Report a short summary: questions checked, issues found, what was changed.

## When to run (auto)
- **Automatically after `build-quiz`** authoring, before `commit-progress`
  (wired into build-quiz R8 and CLAUDE.md). A quiz is not "done" until
  verify-quiz is clean.
- Manually via `/verify-quiz <file>`.

Only after verify-quiz passes do you run `commit-progress` (P7).
