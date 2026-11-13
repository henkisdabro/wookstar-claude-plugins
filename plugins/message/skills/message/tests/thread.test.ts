import { test, expect, describe } from "bun:test";
import { splitThread, threadSuffix } from "../scripts/client/thread.js";
import { xWeightedLength } from "../scripts/client/counter.js";

const X = { max: 280, weigh: xWeightedLength };
const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const graphemes = (s: string) => [...seg.segment(s)].map((g) => g.segment);
// Strip the " i/n" numbering suffix to get the part's own text back.
const body = (p: string) => p.replace(/ \d+\/\d+$/, "");

function expectWithinLimit(parts: string[], max = 280) {
  for (const p of parts) expect(xWeightedLength(p)).toBeLessThanOrEqual(max);
}

describe("splitThread", () => {
  test("a post exactly at the limit is not split and gets no numbering", () => {
    const text = "a".repeat(280);
    expect(splitThread(text, X)).toEqual([text]);
  });

  test("one weighted character over the limit splits into two numbered parts", () => {
    const parts = splitThread("word ".repeat(56) + "x", X); // 281 weighted
    expect(parts.length).toBe(2);
    expect(parts[0].endsWith(" 1/2")).toBe(true);
    expect(parts[1].endsWith(" 2/2")).toBe(true);
    expectWithinLimit(parts);
  });

  test("splits at paragraph boundaries first", () => {
    const p1 = "First paragraph. " + "a".repeat(150);
    const p2 = "Second paragraph. " + "b".repeat(150);
    const parts = splitThread(p1 + "\n\n" + p2, X);
    expect(parts.map(body)).toEqual([p1, p2]);
  });

  test("then at sentence boundaries", () => {
    const s = (n: number) => `Sentence number ${n} ends here with enough words to take up some room.`;
    const text = [1, 2, 3, 4, 5, 6].map(s).join(" ");
    const parts = splitThread(text, X);
    expect(parts.length).toBeGreaterThan(1);
    for (const p of parts) expect(body(p)).toMatch(/\.$/);
    expectWithinLimit(parts);
  });

  test("then at word boundaries, and never loses or reorders text", () => {
    const words = Array.from({ length: 120 }, (_, i) => "w" + i);
    const parts = splitThread(words.join(" "), X);
    expect(parts.map(body).join(" ")).toBe(words.join(" "));
    for (const p of parts) expect(body(p)).not.toMatch(/^\s|\s$/);
    expectWithinLimit(parts);
  });

  test("a URL is never split, and counts 23 wherever it lands", () => {
    const url = "https://example.com/" + "segment/".repeat(40) + "end";
    const text = "word ".repeat(50) + url + " " + "tail ".repeat(40);
    const parts = splitThread(text, X);
    expect(parts.filter((p) => p.includes(url)).length).toBe(1);
    expect(parts.join(" ")).toContain(url);
    expectWithinLimit(parts);
  });

  test("emoji and CJK weigh 2 and are never cut inside a grapheme", () => {
    const text = "👨‍👩‍👧".repeat(100) + "日本語".repeat(40);
    const parts = splitThread(text, X);
    expectWithinLimit(parts);
    expect(parts.map(body).join("")).toBe(text);
    for (const p of parts) for (const g of graphemes(body(p))) expect(["👨‍👩‍👧", "日", "本", "語"]).toContain(g);
  });

  test("numbering widens to two digits at 10+ parts and every part still fits", () => {
    const text = Array.from({ length: 12 }, (_, i) => `Paragraph ${i + 1}. ` + "z".repeat(250)).join("\n\n");
    const parts = splitThread(text, X);
    expect(parts.length).toBe(12);
    expect(parts[0].endsWith(" 1/12")).toBe(true);
    expect(parts[11].endsWith(" 12/12")).toBe(true);
    expectWithinLimit(parts);
  });

  test("the numbering budget is re-planned when the part count gains a digit", () => {
    // 9 parts that each fill the one-digit budget exactly must re-split once
    // the count reaches 10 and the suffix grows.
    const one = 280 - threadSuffix(9, 9).length;
    const text = Array.from({ length: 10 }, () => "q".repeat(one)).join("\n\n");
    const parts = splitThread(text, X);
    expect(parts.length).toBeGreaterThanOrEqual(10);
    expect(parts.at(-1)!).toMatch(new RegExp(` ${parts.length}/${parts.length}$`));
    expectWithinLimit(parts);
  });

  test("works with a grapheme counter for other destinations", () => {
    const g = { max: 300, weigh: (t: string) => graphemes(t).length };
    const parts = splitThread("🎉 ".repeat(200).trim(), g);
    expect(parts.length).toBe(2);
    for (const p of parts) expect(graphemes(p).length).toBeLessThanOrEqual(300);
  });
});
