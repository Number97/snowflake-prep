# CLAUDE.md — SnowPro Core Certification Prep (persistent tutor project)

> **How to use this file.**
> Drop it in the root of a folder (ideally a git repo or a synced/cloud folder such as Dropbox/iCloud/Drive) and open Claude Code there. Claude Code reads `CLAUDE.md` automatically at the start of every session, so **any Claude account launched from this folder inherits the full project state**. The folder — not the account — is the source of truth. You can also paste this whole file as a first message to a normal Claude chat if you're not in Claude Code.
>
> On every launch, before doing anything else, Claude MUST:
> 1. Read this file end to end.
> 2. Read `progress.json` (the live state). If it doesn't exist, create it from the seed at the bottom of this file.
> 3. Greet me with a one-line status (current %, next session) and wait for my instruction.

---

## 1. Who I am and what I want

I'm preparing for the **SnowPro Core certification (exam code COF-C02)** and I want to pass it soon. Colleagues have passed it; I have some Snowflake basics. **I don't want lectures or reading — I learn by doing exam-style questions.** My hard requirements:

- Questions must be delivered as **visually appealing, interactive HTML quizzes** (artifacts / standalone `.html` files), NOT plain text QCM.
- Use **diagrams / schemas** (inline SVG) whenever a concept lands better visually (architecture layers, Time Travel timeline, scaling, pruning, sharing, etc.).
- **Zero tolerance for hallucinated facts.** Snowflake details are trap-heavy and I'm memorizing them, so a wrong "fact" is actively harmful. See §4.
- I want to **track progress** across sessions and see how much is left.

Speak to me plainly, no fluff. I'm fine in English (I'm taking the exam in English).

---

## 2. The exam (verified reference — re-verify volatile items, see §4)

- Format: **100 multiple-choice questions**, **115 minutes**.
- Passing score: **≈ 750 / 1000 (scaled)**, i.e. roughly **75%**.
- Heavily Snowflake-specific; not generic SQL/architecture. Every topic can appear — nothing is safe to skip.
- Practical exam advice from a colleague who passed: take it **in English** (French translations are poor), and have a **clean, quiet room** for the online proctored version.

**Ready-to-book signal:** I score **≥ 80–85% on a fresh, timed mock I've never seen.** The margin above 75% absorbs exam-day nerves.

---

## 3. The plan — 11 sessions (this is the backbone)

**Phase 1 — Domain drills (weakest-first).** One focused drill per domain, 20–25 questions each. A domain is **CLEARED only at ≥ 80% on a FRESH drill** (never reuse questions I've already seen). Below 80% → I review, then a second drill on that domain with new questions. **Every domain must be drilled even if I got its diagnostic question right — one lucky answer is not mastery.**

Order (weakest first, from diagnostic):
1. **Data Loading** — stages, COPY INTO options, Snowpipe, PUT/GET, load history
2. **Monitoring** — INFORMATION_SCHEMA vs ACCOUNT_USAGE, resource monitors, Query Profile
3. **Warehouses & Performance** — sizing, credits/billing, MCW policies, serverless, caching
4. **Data Protection** — Time Travel, Fail-safe, cloning, table types, replication
5. **Architecture** — 3 layers, micro-partitions, pruning, object hierarchy, editions
6. **Semi-structured** — VARIANT, colon/bracket paths, FLATTEN, file formats
7. **Security & Access** — RBAC, system roles, masking & row-access policies, network policies
8. **Data Sharing** — shares, reader accounts, listings/Marketplace, exchanges

**Phase 2 — Full mocks.** After all 8 domains are cleared:
9. Mock #1 — 100 questions, untimed, all domains mixed
10. Mock #2 — 100 questions, **timed 115 min**, exam conditions
11. Mock #3 — 100 questions, timed; target **≥ 85%** → book the exam.

**Estimated effort from a 40% baseline:** ~3–4 weeks at 30–45 min/day, or ~2 weeks at a quiz/day + review. Mostly repetition on trap facts, not deep learning.

---

## 4. STANDING PROCEDURES (apply automatically, every time — do not wait to be asked)

**P1 — Fact-check before delivery (non-negotiable).**
Before showing me any quiz, review every question, every option, and every explanation against verified Snowflake behavior. Fix anything wrong. If a fact is genuinely uncertain or version-dependent (credit prices, feature GA status, edition boundaries, retention limits), either (a) verify it with a web search when tools are available, or (b) leave it out rather than guess. **Never ship a claim you're not sure is correct.** Iterate until nothing is wrong.
- Known correction already applied: **external tables CANNOT be cloned**, and external tables + internal named stages are **skipped** when a database/schema is cloned. (An earlier cheat sheet said external tables can be cloned — that is wrong.)

**P2 — Every quiz ends with a copy-pasteable results summary.**
The results screen of every quiz must render a **plain-text block I can copy** (inside a `<textarea>` or a copy-button box) containing a detailed per-question breakdown, so I can paste it back to you and you update my knowledge model. Format each line as:
```
[domain] Q#  ✓/✗  — concept tested  — (if wrong) what my mistake reveals
```
Then a summary line: overall %, per-domain tally, and a short "focus next" note. Also **write this same summary to `results/<session-id>-results.md`** on disk so it's tracked even if I forget to paste it.

**P3 — GIVE ME OVERVIEW → regenerate the dashboard.**
When I type `GIVE ME OVERVIEW`, regenerate `overview/overview.html` from the current `progress.json`: overall sessions cleared (X/11), Phase 1 domain rows with status + latest score, Phase 2 mock rows, and the clear-rule reminder. Then present it.

**P4 — Persist state after every session.**
After any quiz or mock, update `progress.json`: set the session's `status`, `latestScore`, `attempts`, `lastSeenQuestionIds` (so future drills use fresh questions), and recompute `nextSession`. Commit-friendly (pretty-printed JSON).

**P5 — Always save artifacts to disk, never ephemeral.**
Every HTML quiz, mock, or dashboard is written as a real file under the structure in §5 and then presented. Nothing important should live only in chat. Use clear, sortable filenames.

**P6 — Work all axes.** Never let a good diagnostic/quiz score exempt a domain from being drilled. Sample sizes are small; confirm mastery on a fresh full drill.

**P7 — Auto-commit + push after every update.** Whenever files change on disk in a session (a new/updated quiz, saved `results/*.md`, `progress.json`, or `overview.html`), run the **`commit-progress`** skill at the end of that turn. It stages everything, commits with a **computed** readiness-% message (`<pct>% ready — <what changed>`, where `<pct>` comes from `scripts/readiness.py`, never hand-typed), and pushes to `origin`. The readiness model is deterministic: mean domain mastery (untaken domains = diagnostic baseline), blended 50/50 with the latest mock once mocks begin — see `scripts/readiness.py --explain`. Never invent the number; if `progress.json` is missing, stop.

---

## 5. File & folder structure (Claude Code writes here)

```
snowpro-prep/
├── CLAUDE.md                      # this file — the spec (rarely changes)
├── progress.json                 # LIVE STATE — read first, write last, every session
├── quizzes/
│   ├── 01-diagnostic.html        # already done (score 40%)
│   ├── 02-data-loading-drill.html
│   ├── 03-monitoring-drill.html
│   └── ...                        # NN-<slug>-drill.html  or  NN-mock-<n>.html
├── overview/
│   └── overview.html             # regenerated on GIVE ME OVERVIEW
└── results/
    └── 01-diagnostic-results.md  # copy-paste summaries archived per session
```

**Naming:** two-digit ordinal prefix so files sort chronologically. Drills: `NN-<domain-slug>-drill[-vN].html` (`-v2` for a re-drill). Mocks: `NN-mock-1.html`, etc.

**Multi-account note:** because state lives in `progress.json` and the files on disk — not in any account's memory — you can launch Claude Code from this folder under **any account** and it continues seamlessly. Keep the folder in git or a synced drive so it travels with you.

---

## 6. Design system (keep every artifact visually consistent)

All quizzes share this identity — a **dark "Snowflake data console"** look (switched from light to dark on 2026-07-21 at the user's request; dark from now on). Do not drift to generic AI defaults (cream + terracotta, black + acid-green, newspaper columns). Keep the deep-navy background with cyan/blue Snowflake accents.

**Color tokens (CSS variables) — DARK theme:**
```
--bg:#0A1826    (page bg, deep navy) --card:#0F2233  (surface) --card2:#14293B (option/elevated)
--ink:#E6F0F8   (text)               --muted:#8AA6BD (secondary text) --line:#26425B (borders)
--accent:#2E8FE6 (primary blue)      --cyan:#29B5E8  (Snowflake accent)
--ok:#2FBE8D    (correct/green)      --amber:#E3A24C (partial/warn)  --bad:#E26B54 (wrong/red)
--codebg:#06121C --codetx:#CFE3F5    (SQL blocks)
```
Option/verdict tints on dark: selected/correct/wrong use translucent fills (e.g. `rgba(47,190,141,.16)` for correct) with the solid token as the border; key chips flip to the token color with dark (`#06121C`) glyph text. Buttons: `--accent` bg, white text. SVG diagrams use dark-friendly fills (translucent navy/cyan) with light text — never light-on-light.

**Typography (Google Fonts):**
- Display / headings: **Space Grotesk** (700/500)
- Body: **Inter** (400/500/600)
- Code & data & counters: **IBM Plex Mono** (400/500)

**Signature element:** the **micro-partition progress bar** — a row of thin blocks representing quiz questions (or sessions in the overview), filling cyan as you advance, current one in blue. It's the recurring visual motif; keep it.

**Quiz structure (mirror `01-diagnostic.html`):**
1. **Start screen** — eyebrow tag, big headline, one-paragraph intro, 3 stat chips (Q count / domain / no-timer note), Start button.
2. **Question screen** — domain eyebrow badge, question text, optional SQL block (`<pre class="sql">`), optional inline-SVG diagram on a faint grid background with a mono caption, A–E option buttons with mono key chips. Support single-select AND multi-select ("select TWO/THREE"). A "Validate" button that's disabled until something's picked.
3. **Instant feedback** — after validating: color the options (green=correct-picked, dashed-green=missed correct, red=wrong-picked), a ✓/✗ verdict line, and an **explanation card** (left cyan border) that teaches the trap, not just states the answer. Show the diagram here if the question has one. Then the button becomes "Next".
4. **Results screen** — big % + n/total, pass-mark reminder (~75%), per-domain horizontal bars (green ≥67% / amber / red), a priority-focus box, AND the **copy-paste summary block from P2**, plus a "Retake" button.

**Quiz integrity — NON-NEGOTIABLE (run the `build-quiz` skill before authoring any quiz).**
- **Randomize answer positions.** The correct option must never sit at a fixed slot. The engine shuffles each question's options (Fisher–Yates) on every render, so the answer moves every attempt and can't be pattern-matched. Because positions move, explanations reference option *content*, never letters. *(This was a real shipped bug — every answer was slot A. Never again.)*
- **No answer-revealing content before the user commits.** Any diagram/hint/caption that encodes the answer renders in the FEEDBACK stage only, after Validate. Question-stage visuals must be neutral.
- **Deep teaching on every question (right OR wrong).** Each feedback shows: (1) the concept/mechanic, (2) why *each* distractor is wrong, (3) the exam trap. The user must be able to fully verify understanding, not just see the key.
- **Verify after building.** Every quiz must pass the **`verify-quiz`** skill before it's committed — a deterministic structural gate (`scripts/verify_quiz.js`) plus an independent fact-check of every question against Snowflake docs, fixing anything wrong. This auto-runs after `build-quiz`, before `commit-progress`. A quiz is not done until verify-quiz is clean.
- Full standard + engine pattern + pre-delivery checklist live in the **`build-quiz`** skill; the correctness gate lives in **`verify-quiz`**.

**Technical constraints for artifacts:**
- Single self-contained `.html` file: inline CSS + JS, fonts via `<link>`, diagrams as inline `<svg>`.
- **No `localStorage`/`sessionStorage`** (blocked in the artifact renderer) — keep quiz state in JS variables only.
- Mobile-first: I often view on a phone (~380px wide). Everything must be readable and tappable at that width.
- Respect reduced-motion; visible focus states; keep it accessible.

---

## 7. Verified fact bank (source of truth for question-writing)

Use these when authoring questions/explanations. These are the high-frequency trap facts. Still apply P1 — if unsure or if a value may have changed, verify or omit.

**Architecture**
- Three layers: **Cloud Services** (auth, metadata, query parsing & optimization, security) → **Compute** (virtual warehouses execute queries) → **Storage** (micro-partitions, columnar, compressed, on S3/GCS/Azure). Storage and compute scale independently.
- **Micro-partitions:** 50–500 MB of *uncompressed* data each, stored compressed & columnar, **immutable** (any change writes new partitions — this underpins Time Travel & zero-copy cloning).
- **Pruning:** each micro-partition carries metadata (min/max per column, counts, null counts); the optimizer skips partitions that can't match a filter. **Snowflake has no traditional indexes** — clustering + pruning replace them.
- **Object levels:** *Account-level:* warehouse, database, role, user, share, integration, resource monitor. *Schema-level:* table, view, stage, pipe, task, stream, sequence, function, procedure, file format.
- **Editions:** Standard → Enterprise (MCW, up to 90-day Time Travel, masking & row-access policies) → Business Critical (Tri-Secret Secure, PrivateLink, failover/failback, HIPAA/PCI) → VPS (full isolated deployment).

**Warehouses & performance**
- Credits/hour double per size: XS=1, S=2, M=4, L=8, XL=16, 2XL=32, 3XL=64, 4XL=128, 5XL=256, 6XL=512.
- Billing is **per second with a 60-second minimum** on each start/resume.
- **Scale UP** (bigger size) = faster complex single queries / more memory. **Scale OUT** (more clusters via MCW) = more concurrency.
- **MCW:** Enterprise+, up to **10 clusters** per warehouse. **STANDARD** policy adds a cluster as soon as queries queue (favors performance). **ECONOMY** adds one only if there's ≥ ~6 min of estimated work (favors credit savings). *Maximized* = a mode where min=max clusters (not a policy).
- **Caches:** result cache (24h, in cloud services, exact-match query reuse), metadata cache, warehouse-local data cache (lost on suspend).

**Serverless (no user warehouse needed):** Snowpipe, automatic clustering, Search Optimization Service maintenance, materialized-view refresh, dynamic-table refresh, serverless tasks, replication. A **manual `COPY INTO` needs a running warehouse.**

**Data loading**
- `COPY INTO <table>` for load; `COPY INTO @stage FROM ...` for unload (there is **no `UNLOAD`** command — that's Redshift).
- `ON_ERROR`: `ABORT_STATEMENT` (default), `CONTINUE`, `SKIP_FILE`. `PURGE=TRUE` deletes staged files after a successful load. `FORCE=TRUE` reloads already-loaded files. `VALIDATION_MODE='RETURN_ERRORS'` dry-runs without loading.
- **Load history:** `COPY INTO` = **64 days** per table; **Snowpipe = 14 days**.
- **Snowpipe:** serverless, near-real-time. **Auto-ingest uses cloud notifications → external stages only** (S3+SQS / Azure Event Grid / GCS Pub/Sub). Internal named stages load via the Snowpipe **REST API** (`insertFiles`). Snowpipe wraps `COPY INTO` under the hood.

**Stages**
- Internal: **user** `@~` (one per user, private), **table** `@%tbl` (one per table, auto-created), **named** `@stage` (`CREATE STAGE`, shareable). PUT/GET work **only on internal stages**.
- External stages point to your own S3/GCS/Azure; auth via **storage integration** (preferred) or inline credentials.
- **External tables:** data stays in files; Snowflake stores only metadata. Read-only. No Time Travel/Fail-safe. Streams on them are **INSERT_ONLY**. System column `VALUE` (VARIANT); defined columns are expressions over `VALUE`.

**Semi-structured**
- `VARIANT` holds JSON/Avro/Parquet/XML/ORC; **max 16 MB** per value. First accessor after the column is a **colon**: `col:path.field` or `col['path']`; a missing path returns **NULL** (no error). Pure dot-on-column is invalid.
- `LATERAL FLATTEN(input => col:arr)` explodes arrays/objects into rows. `PARSE_JSON`, `TO_VARIANT`, `TYPEOF`, `IS_NULL_VALUE`, `INFER_SCHEMA` for auto-DDL from files.

**Data protection**
- **Time Travel:** Standard **1 day** max; Enterprise+ up to **90 days** (per-object `DATA_RETENTION_TIME_IN_DAYS`). Query with `AT`/`BEFORE`; recover with `UNDROP`.
- **Fail-safe:** fixed **7 days** *after* Time Travel expires, **permanent tables only**, recoverable **only by Snowflake Support** — never queryable. Not configurable.
- **Table types:** PERMANENT (TT + Fail-safe), TRANSIENT (TT ≤1d, **no Fail-safe**, persists across sessions), TEMPORARY (**session-scoped**, gone at disconnect, no Fail-safe), plus EXTERNAL, HYBRID (row-store OLTP, enforced PK/UNIQUE/NOT NULL), ICEBERG (open format, Spark/Flink interop), DYNAMIC (declarative incremental refresh, serverless).
- **Zero-copy cloning:** instant, copy-on-write, references same micro-partitions. **Cannot clone: warehouses, users, roles.** Cloning a DB/schema **skips external tables and internal named stages**. External tables cannot be cloned individually either.

**Security & access**
- Pure **RBAC**: privileges go to roles, roles to users (never privileges direct to a user). System roles: **ORGADMIN, ACCOUNTADMIN, SECURITYADMIN, USERADMIN, SYSADMIN, PUBLIC**. Best practice: **SYSADMIN owns/creates objects**; SECURITYADMIN/USERADMIN manage roles/users/grants; ACCOUNTADMIN only for rare account-level tasks.
- **Masking policy** = column-level, returns different values by role (dynamic data masking). **Row access policy** = row-level filtering by role. Both require **Enterprise+**.
- **Tri-Secret Secure (customer-managed key / BYOK)** → **Business Critical+**. **Network policies** restrict IPs; **PrivateLink** for private connectivity. **FUTURE GRANTS** auto-apply privileges to objects created later.

**Streams & tasks**
- Stream types: **STANDARD** (insert/update/delete on tables/views), **APPEND_ONLY** (inserts only, tables), **INSERT_ONLY** (external tables). Metadata cols: `METADATA$ACTION`, `METADATA$ISUPDATE`, `METADATA$ROW_ID`. A stream goes **stale** if source Time Travel lapses before consumption. No streams on materialized views.
- Tasks: cron or `AFTER` (DAG), **created SUSPENDED → must `RESUME`**, up to **1000 tasks per DAG**, serverless or warehouse-bound. Classic CDC combo: Stream → Task (increasingly replaced by Dynamic Tables).

**Monitoring**
- **INFORMATION_SCHEMA:** near-real-time, retention ~7–14 days (view-dependent), scoped to current DB, ANSI-style, **no dropped objects**. Real-time/active queries → here (`QUERY_HISTORY()` table function, filter `EXECUTION_STATUS IN ('RUNNING','QUEUED')`).
- **ACCOUNT_USAGE (SNOWFLAKE db):** **365-day** history, whole account, **includes dropped objects**, but **45 min–3 h latency**. Audit/long-term → here.
- **Resource monitors:** cap credit usage per-warehouse or account; actions NOTIFY / SUSPEND / SUSPEND_IMMEDIATE at % thresholds; created by ACCOUNTADMIN.

**Data sharing**
- **Secure Data Sharing:** no data copied; consumer reads provider's storage **live**. Consumer with their own account pays their own compute. **Reader account** = provider creates & pays compute for a partner that has no Snowflake account. **Listings / Marketplace** publish data products (free or paid); **Data Exchange** = private hub. A listing is a data product, not a user list.

**Billing gotcha:** a **credit is an abstract compute unit**, not a fixed dollar amount — value varies by edition, cloud, region, contract. "1 credit = 1 USD" is **false**.

---

## 8. Current progress state (seed for progress.json)

Diagnostic completed: **40% (8/20).** Per-domain diagnostic tally (small sample — all still to be drilled):
Architecture 1/3 · Warehouses & Perf 1/3 · Data Loading 1/4 · Semi-structured 1/2 · Data Protection 1/3 · Security & Access 2/3 · Data Sharing 1/1 · Monitoring 0/1.

**Next session:** Data Loading drill (session 2 overall / drill 1 of 8).

Seed `progress.json` (create if missing):
```json
{
  "exam": { "code": "COF-C02", "questions": 100, "minutes": 115, "passPct": 75 },
  "readyThresholdPct": 82,
  "clearRulePct": 80,
  "overall": { "sessionsCleared": 0, "sessionsTotal": 11 },
  "diagnostic": { "done": true, "scorePct": 40, "raw": "8/20" },
  "phase1_drills": [
    { "n": 1, "domain": "Data Loading",        "slug": "data-loading",   "status": "next",    "diag": "1/4", "attempts": 0, "latestScore": null, "seenQuestionIds": [] },
    { "n": 2, "domain": "Monitoring",          "slug": "monitoring",     "status": "todo",    "diag": "0/1", "attempts": 0, "latestScore": null, "seenQuestionIds": [] },
    { "n": 3, "domain": "Warehouses & Perf",   "slug": "warehouses-perf","status": "todo",    "diag": "1/3", "attempts": 0, "latestScore": null, "seenQuestionIds": [] },
    { "n": 4, "domain": "Data Protection",     "slug": "data-protection","status": "todo",    "diag": "1/3", "attempts": 0, "latestScore": null, "seenQuestionIds": [] },
    { "n": 5, "domain": "Architecture",        "slug": "architecture",   "status": "todo",    "diag": "1/3", "attempts": 0, "latestScore": null, "seenQuestionIds": [] },
    { "n": 6, "domain": "Semi-structured",     "slug": "semi-structured","status": "todo",    "diag": "1/2", "attempts": 0, "latestScore": null, "seenQuestionIds": [] },
    { "n": 7, "domain": "Security & Access",   "slug": "security-access","status": "todo",    "diag": "2/3", "attempts": 0, "latestScore": null, "seenQuestionIds": [] },
    { "n": 8, "domain": "Data Sharing",        "slug": "data-sharing",   "status": "todo",    "diag": "1/1", "attempts": 0, "latestScore": null, "seenQuestionIds": [] }
  ],
  "phase2_mocks": [
    { "n": 1, "type": "untimed", "status": "locked", "latestScore": null },
    { "n": 2, "type": "timed-115", "status": "locked", "latestScore": null },
    { "n": 3, "type": "timed-115", "status": "locked", "latestScore": null }
  ],
  "nextSession": "Data Loading drill"
}
```
Status values: `todo` | `next` | `in-progress` | `needs-redrill` | `cleared` (drills); `locked` | `todo` | `done` (mocks).

---

## 9. Command shortcuts I'll use

- **`START NEXT`** — build & present the next pending session (fresh questions only), following §6 design and §4 procedures.
- **`GIVE ME OVERVIEW`** — regenerate and present `overview/overview.html` (P3).
- **`RESULTS: <pasted summary>`** — ingest my copy-pasted quiz results, update `progress.json` and my knowledge model, tell me what to focus on.
- **`DRILL <domain>`** — build a fresh drill for a specific domain out of order.
- **`MOCK`** — build the next mock (only once all drills are cleared, unless I insist).
- **`FIX`** — if I spotted a wrong fact, correct it in the artifact AND note the correction here in §7.
- **`/commit-progress`** — run the auto-commit + push skill now (readiness-% commit message). Runs automatically after every update per P7; this is the manual trigger.

---

## 10. Reminders to future-Claude (do not skip)

- Read `progress.json` first; write it last. Never lose state.
- Fresh questions every drill — check `seenQuestionIds` and don't repeat.
- Fact-check everything (P1). When tools are available, verify volatile numbers; otherwise omit rather than invent.
- Save every artifact to disk (P5) and present it.
- Every quiz ends with the copy-paste summary + a saved `results/*.md` (P2).
- Keep the visual identity in §6. Mobile-first.
- I want all domains drilled regardless of diagnostic score (P6).
