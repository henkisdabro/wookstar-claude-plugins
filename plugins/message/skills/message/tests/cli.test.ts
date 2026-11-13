import { test, expect, describe } from "bun:test";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseServeArgs, listChannels, RESERVED_FLAGS } from "../scripts/cli-args";
import { DESTINATIONS, resolveChannel } from "../scripts/client/destinations.js";
import { resolveSelection } from "../scripts/client/selection.js";
import { parseFragment } from "../scripts/parse";
import { build } from "../scripts/build";

describe("parseServeArgs", () => {
  test("plain fragment path keeps the old defaults", () => {
    expect(parseServeArgs(["d.fragment.md"])).toMatchObject({ fragment: "d.fragment.md", buildOnly: false, timeout: 1800, channel: null, tier: null });
  });

  test("--channel takes an id or an alias", () => {
    expect(parseServeArgs(["--channel", "linkedin", "d.fragment.md"]).channel).toBe("linkedin");
    expect(parseServeArgs(["d.fragment.md", "--channel", "plaintext"]).channel).toBe("plain");
  });

  test("a shorthand flag exists for every registry id and alias", () => {
    for (const d of DESTINATIONS) {
      for (const name of [d.id, ...(d.aliases || [])]) {
        expect(parseServeArgs([`--${name}`, "d.fragment.md"]).channel).toBe(d.id);
      }
    }
    expect(parseServeArgs(["--x", "d.fragment.md"]).channel).toBe("x");
    expect(parseServeArgs(["--plaintext", "d.fragment.md"]).channel).toBe("plain");
  });

  test("--tier is validated against the registry tiers", () => {
    expect(parseServeArgs(["--x", "--tier", "premium", "d.fragment.md"]).tier).toBe("premium");
    expect(() => parseServeArgs(["--tier", "gold", "d.fragment.md"])).toThrow(/Unknown tier: gold.*free.*premium/);
  });

  test("an unknown flag is a clear error that lists the valid ones", () => {
    let msg = "";
    try { parseServeArgs(["--myspace", "d.fragment.md"]); } catch (e) { msg = (e as Error).message; }
    expect(msg).toMatch(/^Unknown flag: --myspace/);
    for (const f of ["--linkedin", "--plaintext", "--channel", "--tier", "--list-channels"]) expect(msg).toContain(f);
    expect(() => parseServeArgs(["--channel", "myspace", "d.fragment.md"])).toThrow(/Unknown channel: myspace/);
  });

  test("two different channel flags conflict", () => {
    expect(() => parseServeArgs(["--x", "--linkedin", "d.fragment.md"])).toThrow(/more than one channel/i);
    expect(parseServeArgs(["--plain", "--plaintext", "d.fragment.md"]).channel).toBe("plain");
  });

  test("--help needs no fragment", () => {
    expect(parseServeArgs(["--help"]).help).toBe(true);
  });

  test("--list-channels needs no fragment", () => {
    expect(parseServeArgs(["--list-channels"])).toMatchObject({ listChannels: "text" });
    expect(parseServeArgs(["--list-channels", "--json"])).toMatchObject({ listChannels: "json" });
  });
});

describe("registry aliases", () => {
  test("every id and alias is unique, lowercase and not a reserved flag", () => {
    const names = DESTINATIONS.flatMap((d) => [d.id, ...(d.aliases || [])]);
    expect(new Set(names).size).toBe(names.length);
    for (const n of names) {
      expect(n).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(RESERVED_FLAGS).not.toContain(n);
    }
  });

  test("resolveChannel accepts ids and aliases, case-insensitively", () => {
    expect(resolveChannel("X")).toBe("x");
    expect(resolveChannel("twitter")).toBe("x");
    expect(resolveChannel("plaintext")).toBe("plain");
    expect(resolveChannel("nope")).toBeNull();
  });

  test("listChannels prints every row as text and JSON", () => {
    const json = JSON.parse(listChannels("json"));
    expect(json.length).toBe(DESTINATIONS.length);
    expect(json.find((r: { id: string }) => r.id === "plain")).toMatchObject({ label: "Plain text", group: "Generic" });
    expect(json.find((r: { id: string }) => r.id === "plain").aliases).toContain("plaintext");
    const text = listChannels("text");
    for (const d of DESTINATIONS) expect(text).toContain(d.id);
  });
});

// Order: URL ?channel= > CLI flag > fragment channel: > remembered > Gmail.
// A chip clicked in the tab outlives hot reloads until that explicit source
// changes, so editing `channel:` in the fragment always switches the tab.
describe("resolveSelection", () => {
  const valid = (id: string) => ["gmail", "x", "linkedin", "plain"].includes(id);
  const base = { query: null, cli: null, fragment: null, pick: null, stored: null, fallback: "gmail", valid };

  test("precedence: query > cli > fragment > stored > fallback", () => {
    expect(resolveSelection({ ...base })).toBe("gmail");
    expect(resolveSelection({ ...base, stored: "plain" })).toBe("plain");
    expect(resolveSelection({ ...base, stored: "plain", fragment: "linkedin" })).toBe("linkedin");
    expect(resolveSelection({ ...base, stored: "plain", fragment: "linkedin", cli: "x" })).toBe("x");
    expect(resolveSelection({ ...base, stored: "plain", fragment: "linkedin", cli: "x", query: "gmail" })).toBe("gmail");
  });

  test("invalid values are skipped, not fatal", () => {
    expect(resolveSelection({ ...base, query: "myspace", fragment: "linkedin" })).toBe("linkedin");
  });

  test("a click survives reloads while the explicit source is unchanged", () => {
    expect(resolveSelection({ ...base, fragment: "linkedin", pick: { source: "linkedin", id: "plain" } })).toBe("plain");
  });

  test("editing channel: in the fragment beats an earlier click", () => {
    expect(resolveSelection({ ...base, fragment: "x", pick: { source: "linkedin", id: "plain" } })).toBe("x");
  });
});

describe("build carries CLI overrides and resolves aliases", () => {
  async function withFragment(fm: string, fn: (p: string) => Promise<void>) {
    const dir = await mkdtemp(join(tmpdir(), "msg-cli-"));
    const p = join(dir, "c.fragment.md");
    await writeFile(p, `---\n${fm}\n---\n\nBody\n`, "utf-8");
    try { await fn(p); } finally { await rm(dir, { recursive: true, force: true }); }
  }

  test("frontmatter channel accepts an alias and is stored as the id", async () => {
    await withFragment("channel: twitter", async (p) => {
      expect((await parseFragment(p)).meta.channel).toBe("x");
    });
  });

  test("CLI channel and tier are injected beside the fragment's own", async () => {
    await withFragment("channel: linkedin", async (p) => {
      const { html } = await build(p, { channel: "x", tier: "premium" });
      expect(html).toContain('data-channel="linkedin"');
      expect(html).toContain('data-cli-channel="x"');
      expect(html).toContain('data-cli-tier="premium"');
    });
  });

  test("without overrides nothing is injected for the CLI", async () => {
    await withFragment("channel: linkedin", async (p) => {
      const { html } = await build(p);
      expect(html).toContain('data-cli-channel=""');
    });
  });
});
