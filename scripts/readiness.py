#!/usr/bin/env python3
"""Compute a reproducible exam-readiness % from progress.json and build an
auto commit message from the staged/working changes.

Readiness model (deterministic, explainable):
  - Each of the 8 Phase-1 domains has a "mastery" value:
        cleared / attempted -> its latestScore
        not yet attempted   -> DIAGNOSTIC baseline (the only signal we have)
  - phase1 = mean(mastery over 8 domains)
  - If any Phase-2 mock has a score, the mock is the truest signal:
        readiness = 0.5 * phase1 + 0.5 * (latest mock score)
    otherwise readiness = phase1
  - Rounded to a whole percent, clamped 0..100.

This mirrors the guidance in CLAUDE.md: ~4-5 points of readiness per cleared
domain, converging on your mock performance once mocks begin.

Usage:
  readiness.py            -> prints "<pct>% ready — <auto summary>"
  readiness.py --pct      -> prints just the integer percent
  readiness.py --explain  -> prints the per-domain breakdown
"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROGRESS = os.path.join(ROOT, "progress.json")


def load():
    with open(PROGRESS) as f:
        return json.load(f)


def readiness(p):
    diag = p.get("diagnostic", {}).get("scorePct", 40)
    drills = p.get("phase1_drills", [])
    masteries = []
    for d in drills:
        s = d.get("latestScore")
        masteries.append(s if isinstance(s, (int, float)) else diag)
    phase1 = sum(masteries) / len(masteries) if masteries else diag

    mock_scores = [m.get("latestScore") for m in p.get("phase2_mocks", [])
                   if isinstance(m.get("latestScore"), (int, float))]
    if mock_scores:
        latest_mock = mock_scores[-1]
        val = 0.5 * phase1 + 0.5 * latest_mock
    else:
        val = phase1
    return max(0, min(100, round(val)))


def explain(p):
    diag = p.get("diagnostic", {}).get("scorePct", 40)
    lines = [f"diagnostic baseline: {diag}%"]
    for d in p.get("phase1_drills", []):
        s = d.get("latestScore")
        tag = f"{s}%" if isinstance(s, (int, float)) else f"(baseline {diag}%)"
        status = d.get("status", "")
        lines.append(f"  {d['domain']:<22} {tag:<16} [{status}]")
    for m in p.get("phase2_mocks", []):
        s = m.get("latestScore")
        tag = f"{s}%" if isinstance(s, (int, float)) else "—"
        lines.append(f"  Mock {m['n']} ({m['type']:<10}) {tag}")
    lines.append(f"=> readiness {readiness(p)}%")
    return "\n".join(lines)


def changed_paths():
    """Union of staged + unstaged + untracked files."""
    out = subprocess.run(["git", "-C", ROOT, "status", "--porcelain"],
                         capture_output=True, text=True).stdout
    paths = []
    for line in out.splitlines():
        if not line.strip():
            continue
        paths.append(line[3:].strip().strip('"'))
    return paths


def summarize(paths):
    """Turn changed file paths into a short human phrase — never invents facts,
    just names what moved on disk."""
    phrases = []
    quizzes = [p for p in paths if p.startswith("quizzes/") and p.endswith(".html")]
    results = [p for p in paths if p.startswith("results/") and p.endswith(".md")]
    for q in quizzes:
        base = os.path.basename(q)
        name = base.replace(".html", "").split("-", 1)[-1].replace("-", " ")
        phrases.append(f"{name} built")
    for r in results:
        base = os.path.basename(r).replace("-results.md", "").split("-", 1)[-1].replace("-", " ")
        phrases.append(f"logged {base} results")
    if any(p == "progress.json" for p in paths):
        phrases.append("progress updated")
    if any(p.startswith("overview/") for p in paths):
        phrases.append("dashboard regenerated")
    if any(p == "CLAUDE.md" for p in paths):
        phrases.append("spec updated")
    if any(p.startswith("scripts/") or p.startswith(".claude/") for p in paths):
        phrases.append("tooling updated")
    if any(p == "README.md" for p in paths):
        phrases.append("readme updated")
    # de-dup preserving order
    seen, out = set(), []
    for ph in phrases:
        if ph not in seen:
            seen.add(ph); out.append(ph)
    return "; ".join(out) if out else "state updated"


def main():
    p = load()
    if "--pct" in sys.argv:
        print(readiness(p)); return
    if "--explain" in sys.argv:
        print(explain(p)); return
    print(f"{readiness(p)}% ready — {summarize(changed_paths())}")


if __name__ == "__main__":
    main()
