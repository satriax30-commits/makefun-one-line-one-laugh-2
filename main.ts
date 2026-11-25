// makefun-one-line-one-laugh-2 — One Line, One Laugh.
// Deterministic, Node 22 stdlib only: no randomness, no wall-clock time,
// no network, no environment secrets. Writes exactly one funny line to
// entry.txt.
//
// The line: ghosting a gym membership like a clingy ex — except this ex
// literally has your card number, so the "breakup" never works. The twist
// lands on the last words and is concrete, not abstract.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Chosen line (see README for the rejected candidates and why).
// 96 characters, one line, no trailing newline.
const LINE =
  "I tried to ghost my gym, but it keeps texting 'we miss you' like an ex who knows my card number.";

// Gate: the entry must be UTF-8 text of 1 to 140 characters, not only
// whitespace, and a single line. Validate before writing so a bad line
// fails loudly here instead of silently at grading time.
const chars = [...LINE];
if (chars.length < 1 || chars.length > 140) {
  console.error(`entry must be 1-140 characters, got ${chars.length}`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("entry must not be only white space");
  process.exit(1);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("entry must be a single line");
  process.exit(1);
}

// Output directory: first CLI argument, else OUTPUT_DIR / ENTRY_OUTPUT_DIR,
// else /output (the grader's default). This keeps local testing easy
// without changing the graded behaviour.
const outDir =
  process.argv[2] ?? process.env.OUTPUT_DIR ?? process.env.ENTRY_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Self-check: read the file back and confirm it is byte-for-byte the line
// we intended, so a partial write or encoding surprise fails here.
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  console.error("read-back mismatch: entry.txt does not match the line");
  process.exit(1);
}
console.log(`wrote ${chars.length} characters to ${outPath}`);
