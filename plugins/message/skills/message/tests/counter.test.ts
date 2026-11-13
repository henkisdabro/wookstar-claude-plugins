import { test, expect, describe } from "bun:test";
import { xWeightedLength, countFor } from "../scripts/client/counter.js";

// Rules from twitter-text config v3 (references/destinations.md, "X").
describe("xWeightedLength", () => {
  test("Latin text counts one per character", () => {
    expect(xWeightedLength("hello world")).toBe(11);
    expect(xWeightedLength("a".repeat(280))).toBe(280);
  });

  test("CJK counts two per glyph", () => {
    expect(xWeightedLength("日本語")).toBe(6);
  });

  test("every emoji counts two, including skin tones and ZWJ sequences", () => {
    expect(xWeightedLength("👍")).toBe(2);
    expect(xWeightedLength("👍🏽")).toBe(2);
    expect(xWeightedLength("👨‍👩‍👧")).toBe(2);
    expect(xWeightedLength("🇦🇺")).toBe(2);
  });

  test("URLs count 23 whatever their length", () => {
    expect(xWeightedLength("see https://example.com/a/very/long/path?with=query")).toBe(4 + 23);
    expect(xWeightedLength("http://x.co")).toBe(23);
  });

  test("weight-100 punctuation ranges count one, others outside count two", () => {
    expect(xWeightedLength("’")).toBe(1); // right single quote, 8208-8223
    expect(xWeightedLength("′")).toBe(1); // prime, 8242-8247
    expect(xWeightedLength("…")).toBe(2); // ellipsis, outside the ranges
  });

  test("text is NFC-normalised before counting", () => {
    expect(xWeightedLength("é")).toBe(1);
  });
});

describe("countFor", () => {
  test("X reports over-limit past 280", () => {
    const r = countFor({ kind: "x", max: 280 }, "a".repeat(281));
    expect(r).toMatchObject({ count: 281, max: 280, over: true, about: false });
  });

  test("grapheme counter counts emoji as one", () => {
    expect(countFor({ kind: "graphemes", max: 300 }, "👨‍👩‍👧 hi").count).toBe(4);
  });

  test("grapheme counter can weigh URLs as 23 and carries the about flag", () => {
    const r = countFor({ kind: "graphemes", max: 500, urlWeight: 23, about: true }, "go https://example.com/long/long/path");
    expect(r.count).toBe(3 + 23);
    expect(r.about).toBe(true);
    expect(r.over).toBe(false);
  });
});
