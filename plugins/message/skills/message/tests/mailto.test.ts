import { test, expect, describe } from "bun:test";
import { buildMailto, mailtoAddrs } from "../scripts/client/mailto.js";

describe("mailtoAddrs", () => {
  test("leaves a bare address unencoded (@ must not become %40)", () => {
    expect(mailtoAddrs("a@b.com")).toBe("a@b.com");
  });

  test("extracts the address from a Name <addr> form", () => {
    expect(mailtoAddrs("Jamie Smith <jamie@example.com>")).toBe("jamie@example.com");
  });

  test("keeps commas bare between multiple recipients", () => {
    expect(mailtoAddrs("a@b.com, Jamie <jamie@x.com>")).toBe("a@b.com,jamie@x.com");
  });

  test("drops empties", () => {
    expect(mailtoAddrs("a@b.com, , ")).toBe("a@b.com");
  });

  test("empty input yields empty string", () => {
    expect(mailtoAddrs("")).toBe("");
  });
});

describe("buildMailto", () => {
  test("assembles a bare recipient, subject, and CRLF-encoded body", () => {
    const { href, overflow } = buildMailto({
      to: "a@b.com",
      subject: "Hi there",
      body: "line one\nline two",
    });
    expect(overflow).toBe(false);
    expect(href.startsWith("mailto:a@b.com?")).toBe(true);
    expect(href).not.toContain("%40");
    expect(href).toContain("subject=Hi%20there");
    expect(href).toContain("body=line%20one%0D%0Aline%20two");
  });

  test("includes cc and bcc when present, bare addresses + comma separators", () => {
    const { href } = buildMailto({
      to: "a@b.com",
      subject: "s",
      cc: "c@d.com, e@f.com",
      bcc: "g@h.com",
      body: "x",
    });
    expect(href).toContain("cc=c@d.com,e@f.com");
    expect(href).toContain("bcc=g@h.com");
  });

  test("omits cc/bcc params when empty", () => {
    const { href } = buildMailto({ to: "a@b.com", subject: "s", body: "x" });
    expect(href).not.toContain("cc=");
    expect(href).not.toContain("bcc=");
  });

  test("a normal-length body does NOT overflow (keeps the body)", () => {
    const body = "This is a realistic multi-paragraph email.\n\n".repeat(40); // ~1800 chars
    const { href, overflow } = buildMailto({ to: "a@b.com", subject: "s", body });
    expect(overflow).toBe(false);
    expect(href).toContain("body=");
  });

  test("overflow: drops body and flags only for pathologically long drafts", () => {
    const bigBody = "x".repeat(40000);
    const { href, overflow } = buildMailto({ to: "a@b.com", subject: "s", body: bigBody });
    expect(overflow).toBe(true);
    expect(href).not.toContain("body=");
    expect(href).toContain("subject=s");
    expect(href.length).toBeLessThan(16000);
  });

  test("Name <addr> recipient is normalised (bare) in the href", () => {
    const { href } = buildMailto({ to: "Jamie <jamie@x.com>", subject: "s", body: "x" });
    expect(href.startsWith("mailto:jamie@x.com?")).toBe(true);
  });

  test("empty body omits the body param (rich-text-to-clipboard path)", () => {
    const { href, overflow } = buildMailto({ to: "a@b.com", subject: "Hi", body: "" });
    expect(overflow).toBe(false);
    expect(href).not.toContain("body=");
    expect(href).toContain("subject=Hi");
    expect(href.startsWith("mailto:a@b.com?")).toBe(true);
  });

  test("empty body with no other params yields a bare mailto (no trailing ?)", () => {
    const { href } = buildMailto({ to: "a@b.com" });
    expect(href).toBe("mailto:a@b.com");
  });

  test("empty body still carries cc/bcc when present", () => {
    const { href } = buildMailto({ to: "a@b.com", cc: "c@d.com", bcc: "g@h.com" });
    expect(href).toContain("cc=c@d.com");
    expect(href).toContain("bcc=g@h.com");
    expect(href).not.toContain("body=");
  });
});
