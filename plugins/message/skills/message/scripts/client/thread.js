// Split a post that is over its destination's limit into a numbered thread.
// Each part ends with " i/n" and stays within the limit, numbering included.
// Splits at the coarsest boundary that works: paragraph, then line, then
// sentence, then word, and only as a last resort between graphemes. A URL is
// a single word, so it is never split. `weigh` is the destination's own
// counter (X weighting, or graphemes), so the same splitter serves any
// short-limit destination.
import { GRAPHEMES } from "./text-common.js";

export const threadSuffix = (i, n) => ` ${i}/${n}`;

const LEVELS = [
  { split: (t) => t.split(/\n{2,}/), sep: "\n\n" },
  { split: (t) => t.split("\n"), sep: "\n" },
  { split: (t) => t.split(/(?<=[.!?…])\s+/), sep: " " },
  { split: (t) => t.split(/\s+/), sep: " " },
  { split: (t) => [...GRAPHEMES.segment(t)].map((g) => g.segment), sep: "" },
];

function pack(text, budget, weigh) {
  // Break text into atoms that each fit, remembering the separator before each.
  const atoms = [];
  const walk = (t, level, sep) => {
    if (weigh(t) <= budget || level >= LEVELS.length) { atoms.push({ t, sep }); return; }
    const units = LEVELS[level].split(t).filter((u) => u !== "");
    if (units.length <= 1) { walk(t, level + 1, sep); return; }
    units.forEach((u, i) => walk(u, level + 1, i === 0 ? sep : LEVELS[level].sep));
  };
  walk(text, 0, "");
  // Greedily fill each part with as many atoms as fit.
  const parts = [];
  let cur = "";
  for (const { t, sep } of atoms) {
    const next = cur ? cur + sep + t : t;
    if (!cur || weigh(next) <= budget) cur = next;
    else { parts.push(cur); cur = t; }
  }
  if (cur) parts.push(cur);
  return parts.map((p) => p.trim());
}

// { max, weigh } -> array of post texts. Text within the limit comes back as
// one unnumbered part.
export function splitThread(text, { max, weigh }) {
  const t = (text || "").trim();
  if (weigh(t) <= max) return [t];
  // The suffix width depends on the part count, so plan, then re-plan if the
  // count gained a digit (e.g. 9 parts that become 10).
  let n = 2;
  for (;;) {
    const parts = pack(t, max - weigh(threadSuffix(n, n)), weigh);
    if (String(parts.length).length <= String(n).length) {
      return parts.map((p, i) => p + threadSuffix(i + 1, parts.length));
    }
    n = parts.length;
  }
}
