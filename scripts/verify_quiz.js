#!/usr/bin/env node
/*
 * verify_quiz.js — deterministic INTEGRITY checks for a SnowPro quiz HTML.
 *
 * This catches STRUCTURAL / CONSISTENCY defects that a human review misses:
 * missing fields, invalid answer keys, letter-referencing explanations
 * (which break answer-shuffling), duplicate IDs, malformed multi-selects, etc.
 *
 * It does NOT judge whether a Snowflake fact is TRUE — that's the LLM
 * fact-check pass in the verify-quiz skill. This is the cheap, exact gate that
 * always runs first.
 *
 * Usage:  node scripts/verify_quiz.js quizzes/08-data-protection-drill.html
 * Exit:   0 = no errors (warnings allowed), 1 = errors found, 2 = parse failure.
 */
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('usage: node verify_quiz.js <quiz.html>'); process.exit(2); }

let html;
try { html = fs.readFileSync(file, 'utf8'); }
catch (e) { console.error(`cannot read ${file}: ${e.message}`); process.exit(2); }

// ---- extract the Q array literal and eval it ----
const startTok = 'const Q=[';
const s = html.indexOf(startTok);
const engineIdx = html.indexOf('/* ---------- ENGINE', s);
if (s < 0 || engineIdx < 0) { console.error('could not locate Q array / ENGINE marker'); process.exit(2); }
const arrStart = html.indexOf('[', s);
const arrEnd = html.lastIndexOf('];', engineIdx);
let Q;
try { Q = eval('(' + html.slice(arrStart, arrEnd + 1) + ')'); }
catch (e) { console.error('failed to eval Q array: ' + e.message); process.exit(2); }

const errors = [], warns = [];
const ids = new Set();
const LETTER = /\boption\s+[A-E]\b|\b(first|second|third|fourth|fifth|last)\s+option\b|\bslot\s+[A-E]\b|\bchoice\s+[A-E]\b|\banswer\s+is\s+[A-E]\b/i;

Q.forEach((q, i) => {
  const tag = q && q.id ? q.id : `#${i + 1}`;
  const E = m => errors.push(`[${tag}] ${m}`);
  const W = m => warns.push(`[${tag}] ${m}`);

  // required fields
  for (const f of ['id', 'sub', 'q', 'concept', 'trap']) {
    if (typeof q[f] !== 'string' || !q[f].trim()) E(`missing/empty string field "${f}"`);
  }
  if (!Array.isArray(q.opts)) return E('opts is not an array');
  if (!Array.isArray(q.a)) return E('a (answer key) is not an array');
  if (!Array.isArray(q.why)) E('why is not an array');

  // ids unique
  if (ids.has(q.id)) E('duplicate id'); else ids.add(q.id);

  // opts count + uniqueness
  if (q.opts.length < 2 || q.opts.length > 5) E(`opts count ${q.opts.length} (expected 2–5)`);
  const seen = new Set();
  q.opts.forEach(o => { if (seen.has(o)) E(`duplicate option text: "${String(o).slice(0, 40)}…"`); seen.add(o); });

  // answer key validity
  if (q.a.length < 1) E('answer key is empty');
  const uniqA = new Set(q.a);
  if (uniqA.size !== q.a.length) E('answer key has duplicate indices');
  q.a.forEach(idx => { if (!Number.isInteger(idx) || idx < 0 || idx >= q.opts.length) E(`answer index ${idx} out of range`); });
  if (q.a.length >= q.opts.length) E('all options marked correct (no distractors)');

  // why-count should match number of distractors (consistency, not fatal)
  if (Array.isArray(q.why)) {
    const distractors = q.opts.length - q.a.length;
    if (q.why.length !== distractors)
      W(`why has ${q.why.length} items but there are ${distractors} distractors (each wrong option should be explained)`);
  }

  // letter/position references anywhere in teaching text (breaks shuffle) -> ERROR
  const teach = [q.q, q.concept, q.trap, ...(q.why || [])].join(' \n ');
  if (LETTER.test(teach)) E('explanation references an option by letter/position (breaks answer shuffling — reference content instead)');

  // multi-select present but no hint word needed: engine derives from a.length, so just sanity note
  if (q.a.length > 1 && q.a.length > 3) W(`multi-select expects ${q.a.length} answers (hint only supports up to FOUR wording)`);
});

// ---- report ----
console.log(`verify_quiz: ${file}`);
console.log(`  questions parsed: ${Q.length}`);
console.log(`  ids: ${[...ids].join(', ')}`);
if (warns.length) { console.log(`\n  WARNINGS (${warns.length}):`); warns.forEach(w => console.log('   ⚠ ' + w)); }
if (errors.length) { console.log(`\n  ERRORS (${errors.length}):`); errors.forEach(e => console.log('   ✗ ' + e)); }
else console.log('\n  ✓ no structural errors');

process.exit(errors.length ? 1 : 0);
