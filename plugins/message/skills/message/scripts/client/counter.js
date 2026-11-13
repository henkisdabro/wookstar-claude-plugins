// Live length counters for destinations with a limit. X uses the published
// twitter-text config v3 rules (references/destinations.md, "X"); everything
// else counts grapheme clusters, optionally weighing each URL as a fixed length.
import { GRAPHEMES, EMOJI_RE } from "./text-common.js";

// twitter-text config/v3.json: scale 100, defaultWeight 200, these ranges 100.
const X_RANGES = [[0, 4351], [8192, 8205], [8208, 8223], [8242, 8247]];
const X_URL_WEIGHT = 23;
const URL_RE = /\bhttps?:\/\/[^\s<>"]+/gi;
const isEmoji = (g) => EMOJI_RE.test(g) || /^\p{Regional_Indicator}{2}$/u.test(g);

export function xWeightedLength(text) {
  const s = (text || "").normalize("NFC");
  let weight = 0;
  const rest = s.replace(URL_RE, () => { weight += X_URL_WEIGHT * 100; return ""; });
  for (const { segment } of GRAPHEMES.segment(rest)) {
    if (isEmoji(segment)) { weight += 200; continue; }
    for (const ch of segment) {
      const cp = ch.codePointAt(0);
      weight += X_RANGES.some(([a, b]) => cp >= a && cp <= b) ? 100 : 200;
    }
  }
  return weight / 100;
}

function graphemeLength(text, urlWeight) {
  let count = 0;
  let s = text || "";
  if (urlWeight) s = s.replace(URL_RE, () => { count += urlWeight; return ""; });
  for (const _ of GRAPHEMES.segment(s)) count++;
  return count;
}

// rule: { kind: "x" | "graphemes", max, about?, urlWeight?, note? }
export function countFor(rule, text) {
  const count = rule.kind === "x" ? xWeightedLength(text) : graphemeLength(text, rule.urlWeight);
  return { count, max: rule.max, over: count > rule.max, about: !!rule.about };
}
