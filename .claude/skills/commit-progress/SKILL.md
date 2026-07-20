---
name: commit-progress
description: Auto-commit and auto-push the SnowPro prep repo with a readiness-% commit message. Use after any study update — a new/updated quiz, saved results, progress.json change, or dashboard regen. Also runs when the user types /commit-progress.
---

# commit-progress — auto-commit + push with a readiness-% message

Stage everything, commit with a **computed** readiness percentage in the message,
and push to `origin`. The `%` is derived from `progress.json` by
`scripts/readiness.py` — never hand-typed, so the git history stays honest.

## Commit message format (exactly)

```
<pct>% ready — <auto summary of what changed>
```

e.g. `46% ready — data loading drill built; logged data loading results; progress updated`

## Steps

1. **Confirm there's something to commit.** Run `git -C <repo> status --porcelain`.
   If empty, tell the user "nothing to commit" and stop.

2. **Build the message.** Run:
   ```
   python3 scripts/readiness.py
   ```
   Its stdout IS the commit message (`<pct>% ready — <summary>`). Use it verbatim.
   - If the auto summary is vague and you have better context on what changed this
     session (e.g. "cleared Monitoring at 84%"), you MAY replace the part after
     `— ` with a clearer phrase, but keep the `<pct>% ready — ` prefix exactly as
     the script computed it. Do not change the number.

3. **Stage + commit + push:**
   ```
   git -C <repo> add -A
   git -C <repo> commit -m "<message from step 2>"
   git -C <repo> push
   ```
   Append the standard co-author trailer to the commit body:
   ```
   Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
   ```

4. **Report** the short SHA, the readiness %, and confirm the push succeeded
   (`git -C <repo> log -1 --oneline` + the push result). One line is enough.

## Guardrails

- Only ever operates on this repo (the SnowPro prep folder). Never `git add`
  outside it.
- If `git push` fails (no network, auth, non-fast-forward), report the exact
  error and leave the local commit in place — do NOT force-push.
- Never amend or rebase existing commits; only add new ones.
- If `progress.json` is missing, stop and say so — the % can't be computed.

## When to auto-run

Per CLAUDE.md standing procedure, invoke this automatically at the end of any
session that changed files on disk (P4/P5): after delivering a quiz, after
ingesting `RESULTS:`, and after `GIVE ME OVERVIEW`. The user can also trigger it
manually with `/commit-progress`.
