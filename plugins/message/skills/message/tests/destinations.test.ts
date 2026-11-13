import { test, expect, describe } from "bun:test";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DESTINATIONS, destinationById, EMAIL_CHANNELS } from "../scripts/client/destinations.js";
import { DIALECTS } from "../scripts/client/dialects.js";
import { isAllowedOpenUrl } from "../scripts/open-url";
import { parseFragment, validateFragment } from "../scripts/parse";
import { build } from "../scripts/build";

describe("destination registry", () => {
  test("ids and shortcuts are unique", () => {
    const ids = DESTINATIONS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    const keys = DESTINATIONS.flatMap((d) => (d.key ? [d.key] : []));
    expect(new Set(keys).size).toBe(keys.length);
    for (const k of keys) expect(["c", "o", "r", "[", "]"]).not.toContain(k);
  });

  test("every row resolves: group, payload, dialect, icon, counter", () => {
    for (const d of DESTINATIONS) {
      expect(["Email", "Messaging", "Social", "Generic"]).toContain(d.group);
      expect(["gmail", "rich", "text"]).toContain(d.payload);
      if (d.payload === "text") expect(DIALECTS[d.dialect]).toBeDefined();
      expect(typeof d.icon).toBe("string");
      expect(d.label.length).toBeGreaterThan(0);
      if (d.counter) expect(["x", "graphemes"]).toContain(d.counter.kind);
      if (d.thread || d.tiers) expect(d.counter).toBeDefined();
      for (const t of Object.values(d.tiers || {}) as { label: string; max: number }[]) {
        expect(t.label.length).toBeGreaterThan(0);
        expect(t.max).toBeGreaterThan(0);
      }
    }
  });

  test("every Open URL is one the server allows", () => {
    const fields = { to: "a@example.com", subject: "Hi", cc: "", bcc: "" };
    for (const d of DESTINATIONS) {
      if (!d.openUrl) continue;
      expect(isAllowedOpenUrl(d.openUrl("Hello & welcome 🎉", fields))).toBe(true);
    }
  });

  test("the destinations the brief names are all present", () => {
    for (const id of ["gmail", "mail", "whatsapp", "slack", "telegram", "discord", "teams", "signal", "imessage",
      "messenger", "x", "linkedin", "facebook", "instagram", "threads", "bluesky", "mastodon", "reddit", "tiktok",
      "youtube", "plain", "markdown"]) {
      expect(destinationById(id)).toBeDefined();
    }
  });

  test("X offers Free (threads at 280) and Premium (25,000, no thread)", () => {
    const x = destinationById("x")!;
    expect(Object.keys(x.tiers)).toEqual(["free", "premium"]);
    expect(x.tiers.free).toMatchObject({ max: 280, thread: true });
    expect(x.tiers.premium).toMatchObject({ max: 25000, thread: false });
  });

  test("other short-limit posts thread too", () => {
    for (const id of ["bluesky", "threads", "mastodon"]) expect(destinationById(id)!.thread).toBe(true);
  });

  test("legacy shortcuts stay mapped", () => {
    expect(destinationById("whatsapp")!.key).toBe("m");
    expect(destinationById("plain")!.key).toBe("p");
  });
});

describe("channel frontmatter", () => {
  async function meta(fm: string) {
    const dir = await mkdtemp(join(tmpdir(), "msg-channel-"));
    const path = join(dir, "c.fragment.md");
    await writeFile(path, `---\n${fm}\n---\n\nBody\n`, "utf-8");
    try {
      const { meta, bodyHtml } = await parseFragment(path);
      return { meta, errors: validateFragment(meta, bodyHtml) };
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }

  test("a social channel needs no to or subject", async () => {
    const { meta: m, errors } = await meta("channel: x");
    expect(m.channel).toBe("x");
    expect(errors).toEqual([]);
  });

  test("email channels still require to and subject", async () => {
    for (const c of EMAIL_CHANNELS) {
      const { errors } = await meta(`channel: ${c}`);
      expect(errors).toContain("Missing required field: to");
    }
  });

  test("no channel behaves exactly as before", async () => {
    expect((await meta("to: a@example.com")).errors).toContain("Missing required field: subject");
    expect((await meta("to: a@example.com\nsubject: Hi")).errors).toEqual([]);
  });

  test("tier is accepted when known, rejected otherwise", async () => {
    expect((await meta("channel: x\ntier: premium")).errors).toEqual([]);
    const { errors } = await meta("channel: x\ntier: gold");
    expect(errors.some((e) => e.includes("Unknown tier: gold") && e.includes("premium"))).toBe(true);
  });

  test("Messaging, Social and Generic channels need no to or subject", async () => {
    for (const c of ["whatsapp", "teams", "linkedin", "plain", "markdown"]) expect((await meta(`channel: ${c}`)).errors).toEqual([]);
  });

  test("an unknown channel is rejected with the valid list", async () => {
    const { errors } = await meta("channel: myspace");
    expect(errors.some((e) => e.includes("Unknown channel: myspace") && e.includes("whatsapp"))).toBe(true);
  });

  test("the channel is injected into the built page", async () => {
    const dir = await mkdtemp(join(tmpdir(), "msg-channel-"));
    const path = join(dir, "c.fragment.md");
    await writeFile(path, "---\nchannel: bluesky\n---\n\nBody\n", "utf-8");
    try {
      const { html } = await build(path);
      expect(html).toContain('data-channel="bluesky"');
      // The page is called Paste Ready, in the tab title and the heading.
      expect(html).toContain("<title>Paste Ready</title>");
      expect(html).toContain('<h1 id="page-title">Paste Ready</h1>');
      expect(html).toContain("function splitThread(");
      expect(html).toContain("const DESTINATIONS");
      expect(html).not.toMatch(/^\s*import\s/m);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
