import { test, expect, describe } from "bun:test";
import { fragmentHtml } from "./helpers";
import { transformGmail } from "../scripts/transform-gmail";
import { transformOutlook } from "../scripts/transform-outlook";
import { isNumericCell, tableColumnSpecs, toLeadingMinus, GMAIL_MONO, OUTLOOK_MONO } from "../scripts/numeric-columns";

const html = (md: string) => fragmentHtml(md);
// The opening tags of every cell, row by row.
const cells = (out: string) => [...out.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<(?:td|th)\b[^>]*>/g)].map((m) => m[0]));

describe("isNumericCell", () => {
  test("accepts amounts, currency, percent, negatives and unit suffixes", () => {
    for (const v of ["12", "1,200", "1,200.50", "0.5", ".75", "$6,000", "AUD 1,200", "1,200 AUD", "A$90", "€3.20", "£12", "-12", "-$1,200",
      "$-1,200", "(1,200)", "($1,200.00)", "+4.5%", "12%", "-0.3%", "$1.2m", "45k", "3.4bn", "− 7"]) {
      expect([v, isNumericCell(v)]).toEqual([v, true]);
    }
  });

  test("rejects text, dates and mixed values", () => {
    for (const v of ["Live", "Q1", "2026-11-13", "1,2,3", "12 days", "v1.2", "N/A", "$", "1.2.3", "abc 12"]) {
      expect([v, isNumericCell(v)]).toEqual([v, false]);
    }
  });
});

describe("column detection", () => {
  test("decided from body cells only; empty and '-' ignored; one text cell disqualifies", async () => {
    const specs = tableColumnSpecs(await html([
      "| Channel | Spend | Status | Mixed |",
      "|---|---|---|---|",
      "| Search | $6,000 | Live | 12 |",
      "| Social |  | Paused | n/a |",
      "| Total | - | - | 4 |",
    ].join("\n")));
    expect(specs[0].columns.map((c) => c.numeric)).toEqual([false, true, false, false]);
  });

  test("a column of only empty or '-' cells is not numeric", async () => {
    const specs = tableColumnSpecs(await html("| A | B |\n|---|---|\n| x | - |\n| y |  |"));
    expect(specs[0].columns[1].numeric).toBe(false);
  });

  test("explicit Markdown alignment is recorded", async () => {
    const specs = tableColumnSpecs(await html("| A | B | C |\n|:--|:-:|--:|\n| 1 | 2 | 3 |"));
    expect(specs[0].columns.map((c) => c.align)).toEqual(["left", "center", "right"]);
  });
});

const MIXED = [
  "| Channel | Budget | Change |",
  "|---|---|---|",
  "| Search | $6,000 | +12% |",
  "| Social | (4,500) | -3.5% |",
].join("\n");

for (const [name, transform, mono] of [["Gmail", transformGmail, GMAIL_MONO], ["Rich Text", transformOutlook, OUTLOOK_MONO]] as const) {
  describe(`${name} transform`, () => {
    test("numeric body cells are right-aligned in the mono stack with tabular figures", async () => {
      const out = transform(await html(MIXED));
      const rows = cells(out);
      for (const r of rows.slice(1)) {
        expect(r[0]).not.toContain("text-align");
        for (const c of r.slice(1)) {
          expect(c).toContain("text-align: right");
          expect(c).toContain(mono);
          expect(c).toContain("font-variant-numeric: tabular-nums");
          expect(c.match(/font-family:/g)!.length).toBe(1);
          expect(c.match(/font-size:/g)?.length ?? 0).toBeLessThanOrEqual(1);
        }
      }
    });

    test("the header of a numeric column is right-aligned but keeps the normal font", async () => {
      const head = cells(transform(await html(MIXED)))[0];
      expect(head[0]).not.toContain("text-align");
      for (const c of head.slice(1)) {
        expect(c).toContain("text-align: right");
        expect(c).not.toContain(mono);
        expect(c).toContain("font-weight: bold");
      }
    });

    test("an all-text table is byte-identical to the plain transform", async () => {
      const md = "| Name | Status |\n|---|---|\n| Search | Live |\n| Social | Paused |";
      const input = await html(md);
      const out = transform(input);
      expect(out).not.toContain("text-align");
      expect(out).not.toContain(mono);
    });

    test("explicit alignment wins for alignment; mono still applies", async () => {
      const out = transform(await html("| Item | Qty |\n|---|:--|\n| Apples | 3 |\n| Pears | 12 |"));
      const body = cells(out).slice(1);
      for (const r of body) {
        expect(r[1]).toContain("text-align: left");
        expect(r[1]).toContain(mono);
      }
      expect(cells(out)[0][1]).toContain("text-align: left");
    });

    test("explicit alignment on a text column is left as the transform already handles it", async () => {
      const md = "| Name | Status |\n|:-:|--:|\n| Search | Live |";
      const out = transform(await html(md));
      expect(out).not.toContain(mono);
    });
  });
}

describe("nothing else changes", () => {
  test("a fragment without tables transforms exactly as before", async () => {
    const input = await html("Hello **there**\n\n- a\n- b\n\n> quote");
    const { transformGmail: g } = await import("../scripts/transform-gmail");
    expect(g(input)).toBe(transformGmail(input));
    expect(transformGmail(input)).not.toContain("tabular-nums");
    expect(transformOutlook(input)).not.toContain("tabular-nums");
  });
});

describe("negatives use a leading minus, never accounting parentheses", () => {
  test("toLeadingMinus: the minus leads the whole value, before any symbol or code", () => {
    const cases: [string, string][] = [
      ["(1,200)", "-1,200"],
      ["($1,200)", "-$1,200"],
      ["($1,200.00)", "-$1,200.00"],
      ["(12%)", "-12%"],
      ["(A$90)", "-A$90"],
      ["(AUD 1,200)", "-AUD 1,200"],
      ["AUD (1,200)", "-AUD 1,200"],
      ["(1,200) AUD", "-1,200 AUD"],
      ["(4.5k)", "-4.5k"],
    ];
    for (const [input, out] of cases) expect([input, toLeadingMinus(input)]).toEqual([input, out]);
  });

  test("toLeadingMinus leaves everything else alone", () => {
    for (const v of ["1,200", "-1,200", "-$1,200", "+4.5%", "(-5)", "(note)", "(Q1)", "Live", "", "-"]) {
      expect([v, toLeadingMinus(v)]).toEqual([v, v]);
    }
  });

  test("a code before a bracketed amount still counts as numeric", () => {
    expect(isNumericCell("AUD (1,200)")).toBe(true);
    expect(isNumericCell("(1,200) AUD")).toBe(true);
  });

  const TABLE = [
    "| Line | Amount | Change | Note |",
    "|---|---|---|---|",
    "| Media | $12,400 | 4.5% | (estimate) |",
    "| Fees | ($1,200) | (12%) | (paid) |",
    "| Credit | AUD (300) | -0.3% | (n/a) |",
  ].join("\n");

  for (const [name, transform] of [["Gmail", transformGmail], ["Rich Text", transformOutlook]] as const) {
    test(`${name}: bracketed negatives in numeric columns become leading-minus values`, async () => {
      const out = transform(await html(TABLE));
      expect(out).toContain(">-$1,200</td>");
      expect(out).toContain(">-12%</td>");
      expect(out).toContain(">-AUD 300</td>");
      expect(out).not.toMatch(/>\(\$?1,200\)</);
      expect(out).not.toContain(">(12%)<");
    });

    test(`${name}: text columns keep their brackets`, async () => {
      const out = transform(await html(TABLE));
      expect(out).toContain(">(estimate)</td>");
      expect(out).toContain(">(paid)</td>");
    });
  }

  test("the text payloads are not affected", async () => {
    const { renderDialect, DIALECTS } = await import("../scripts/client/dialects.js");
    expect(renderDialect(await html(TABLE), DIALECTS.plain)).toContain("($1,200)");
  });
});
