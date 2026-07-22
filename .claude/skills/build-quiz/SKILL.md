---
name: build-quiz
description: Authoritative quality standard + engine for building any SnowPro Core quiz (drill or mock). Invoke BEFORE authoring or editing any quiz HTML. Encodes the hard rules that prevent gameable/spoiler/shallow quizzes, plus the fact-check, freshness, design, and delivery procedures. Also used when the user says /build-quiz.
---

# build-quiz — the quiz quality bar (READ BEFORE BUILDING ANY QUIZ)

Every drill/mock MUST satisfy every rule below before it is delivered. These
exist because real defects shipped once (answers all in slot A, an SVG that
revealed the answer, shallow explanations). Never again.

## R1 — Randomize answer position (CRITICAL)
The correct option must **never** sit at a fixed position. Do not rely on
authoring order. The engine MUST shuffle each question's options **on every
render** (Fisher–Yates), so:
- The correct answer lands in a different slot each attempt.
- Retaking reshuffles — the user cannot memorize "it was B".
- Distribution is unpredictable even across one sitting.

Because positions move, **explanations must reference option _content_, never
letters** ("the storage-integration choice", not "option C").

Canonical engine pattern (keep this shape):
```js
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
// per render:
const disp = q.opts.map((t,i)=>({t, correct:q.a.includes(i)}));
shuffle(disp); q._disp = disp; q._need = q.a.length;
// validate:
const correctIdx = disp.map((o,i)=>o.correct?i:-1).filter(i=>i>=0);
const isCorrect = arrEq(picks, correctIdx);
```

## R2 — No answer-revealing content before the user commits
The question stage shows ONLY the stem, an optional neutral SQL block, and the
options. **Anything that encodes or hints at the answer — a labelled diagram, a
give-away caption, a leading hint — renders in the FEEDBACK stage only**, after
the user validates. A diagram whose text states the answer is a spoiler; move
it, or make the question-stage version neutral (no labels that decide it).

## R3 — Deep teaching on EVERY question (right OR wrong)
After validating, the explanation must let the user "verify they understand
everything", not just see the key. Every `exp` has three parts:
1. **Concept** — the full rule/mechanic behind the question (2–4 sentences).
2. **Why the others are wrong** — one line per distractor, by content.
3. **Exam trap / remember** — the memorable gotcha or contrast.
Show this identically whether they got it right or wrong. Diagrams (R2) attach
here.

## R4 — Fact-check (CLAUDE.md P1)
Verify every stem, option, and explanation against §7 of CLAUDE.md and known
Snowflake behavior. If a value is volatile (prices, GA status, edition limits,
retention) verify with web search when available, else omit. Never ship an
uncertain claim. Known trap corrections live in §7 — honor them (e.g. external
tables cannot be cloned).

## R5 — Fresh questions (P6)
New question IDs every drill. Check the domain's `seenQuestionIds` in
`progress.json` and do not reuse stems the user has seen. A re-drill after a
miss must be genuinely new questions, not reshuffled old ones.

## R6 — Design system + technical constraints (§6)
- Single self-contained `.html`: inline CSS/JS, Google-fonts via `<link>`,
  inline `<svg>`. **No localStorage/sessionStorage.** Mobile-first (~380px).
  Reduced-motion + visible focus.
- Snowflake-console identity, color tokens, Space Grotesk / Inter / IBM Plex
  Mono, and the **micro-partition progress bar** motif.
- Structure: start screen → question screen (domain badge, stem, optional SQL,
  A–E option chips, disabled Validate until a pick) → instant colored feedback
  + deep explanation card → results screen.
- Support single- AND multi-select ("select TWO/THREE"); enable Validate only
  when exactly the required number is picked.

## R7 — Results + persistence (P2/P4/P5)
- Results screen shows big %, ~75% pass reminder, per-sub-topic bars, a focus
  box, and the **copy-paste summary** in a `<textarea>` with a copy button.
- Save the file under `quizzes/NN-<slug>-drill[-vN].html` (P5).
- After the user pastes `RESULTS:`, update `progress.json` (status,
  latestScore, attempts, seenQuestionIds, nextSession) and write
  `results/<session-id>-results.md`.

## R8 — Verify, then commit (P7)
After writing/editing any quiz, run the **verify-quiz** skill FIRST — it runs the
structural gate (`node scripts/verify_quiz.js`) plus an independent fact-check,
and fixes anything wrong. A quiz is not "done" until verify-quiz is clean. ONLY
THEN run **commit-progress** (readiness-% message, auto-push).

## Pre-delivery checklist (run through it, every time)
- [ ] Options shuffle on every render; correct answer not positionally fixed.
- [ ] Explanations reference content, not letters.
- [ ] No diagram/hint reveals the answer before validation.
- [ ] Every question has Concept + Why-others-wrong + Trap.
- [ ] Facts checked vs §7; volatile items verified or omitted.
- [ ] New question IDs; nothing from `seenQuestionIds`.
- [ ] Single file, no web storage, mobile-first, design tokens used.
- [ ] Copy-paste summary + focus box present.
- [ ] Saved to `quizzes/`, then **verify-quiz** run clean (structural + fact-check), then commit-progress.
