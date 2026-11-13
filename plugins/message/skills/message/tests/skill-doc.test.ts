import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// The skill loader substitutes positional arguments ($0, $1, $2 ...) in
// SKILL.md when the skill is invoked with arguments, so a literal such as a
// dollar amount written with a leading $ before a digit is silently rewritten
// (one rendered as "announcing,000"). Keep every $ followed by a non-digit.
test("SKILL.md contains no $<digit> that the loader would substitute", () => {
  const md = readFileSync(join(import.meta.dir, "..", "SKILL.md"), "utf8");
  const hits = md.split("\n").map((l, i) => [i + 1, l] as const).filter(([, l]) => /\$\d/.test(l));
  expect(hits.map(([n]) => `SKILL.md:${n}`)).toEqual([]);
});
