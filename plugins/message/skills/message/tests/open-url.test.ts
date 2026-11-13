import { test, expect } from "bun:test";
import { isAllowedOpenUrl } from "../scripts/open-url";

test("allows the four destination URL forms the Open buttons produce", () => {
  expect(isAllowedOpenUrl("https://mail.google.com/mail/?view=cm&tf=1&to=a@b.com")).toBe(true);
  expect(isAllowedOpenUrl("mailto:a@b.com?subject=Hi")).toBe(true);
  expect(isAllowedOpenUrl("whatsapp://send?text=hello")).toBe(true);
  expect(isAllowedOpenUrl("https://wa.me/61400000000")).toBe(true);
});

test("allows the social compose intents, and only those paths", () => {
  expect(isAllowedOpenUrl("https://x.com/intent/tweet?text=hi")).toBe(true);
  expect(isAllowedOpenUrl("https://www.threads.com/intent/post?text=hi")).toBe(true);
  expect(isAllowedOpenUrl("https://bsky.app/intent/compose?text=hi")).toBe(true);
  expect(isAllowedOpenUrl("https://x.com/home")).toBe(false);
  expect(isAllowedOpenUrl("https://bsky.app/profile/someone")).toBe(false);
});

test("blocks everything else - the endpoint must not be an open-anything launcher", () => {
  expect(isAllowedOpenUrl("https://example.com/")).toBe(false);
  expect(isAllowedOpenUrl("file:///etc/passwd")).toBe(false);
  expect(isAllowedOpenUrl("https://mail.google.com.evil.com/")).toBe(false);
  expect(isAllowedOpenUrl("javascript:alert(1)")).toBe(false);
  expect(isAllowedOpenUrl("")).toBe(false);
});
