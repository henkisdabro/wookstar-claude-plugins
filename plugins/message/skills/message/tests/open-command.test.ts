import { test, expect, describe } from "bun:test";
import { openCommand, wslMountRoot } from "../scripts/open-command";

const GMAIL = "https://mail.google.com/mail/?view=cm&tf=1&to=a%40example.com&su=Hi%20there";
const none = { which: () => null, exists: () => false, drives: [] as string[] };

describe("openCommand", () => {
  test("macOS uses open", () => {
    expect(openCommand(GMAIL, { ...none, platform: "darwin", isWSL: false })).toEqual(["open", GMAIL]);
  });

  test("native Windows uses rundll32 FileProtocolHandler - no cmd.exe, so '&' is never parsed", () => {
    const argv = openCommand(GMAIL, { ...none, platform: "win32", isWSL: false })!;
    expect(argv).toEqual(["rundll32.exe", "url.dll,FileProtocolHandler", GMAIL]);
    expect(argv.join(" ")).not.toMatch(/cmd(\.exe)?\b/);
  });

  test("WSL prefers wslview when it is installed", () => {
    const argv = openCommand(GMAIL, { ...none, platform: "linux", isWSL: true, which: (n) => (n === "wslview" ? "/usr/bin/wslview" : null) });
    expect(argv).toEqual(["/usr/bin/wslview", GMAIL]);
  });

  test("WSL uses rundll32.exe from PATH when interop put Windows on PATH", () => {
    const which = (n: string) => (n === "rundll32.exe" ? "/mnt/c/WINDOWS/system32/rundll32.exe" : null);
    expect(openCommand(GMAIL, { ...none, platform: "linux", isWSL: true, which })).toEqual(
      ["/mnt/c/WINDOWS/system32/rundll32.exe", "url.dll,FileProtocolHandler", GMAIL]);
  });

  test("WSL in a non-login shell finds rundll32.exe by absolute path on the mounted drives", () => {
    const exists = (p: string) => p === "/mnt/d/Windows/System32/rundll32.exe";
    const argv = openCommand(GMAIL, { ...none, platform: "linux", isWSL: true, exists, drives: ["/mnt/c", "/mnt/d"] });
    expect(argv).toEqual(["/mnt/d/Windows/System32/rundll32.exe", "url.dll,FileProtocolHandler", GMAIL]);
  });

  test("WSL with no way to reach Windows returns null (the caller reports failure)", () => {
    expect(openCommand(GMAIL, { ...none, platform: "linux", isWSL: true, drives: ["/mnt/c"] })).toBeNull();
  });

  test("plain Linux uses xdg-open", () => {
    expect(openCommand(GMAIL, { ...none, platform: "linux", isWSL: false })).toEqual(["xdg-open", GMAIL]);
  });

  test("the URL is always one argv element, never split or re-quoted", () => {
    for (const platform of ["darwin", "win32", "linux"]) {
      const argv = openCommand(GMAIL, { ...none, platform, isWSL: false, which: () => "/x" })!;
      expect(argv.at(-1)).toBe(GMAIL);
    }
  });
});

describe("wslMountRoot", () => {
  test("defaults to /mnt/", () => {
    expect(wslMountRoot("")).toBe("/mnt/");
    expect(wslMountRoot("[boot]\nsystemd=true\n")).toBe("/mnt/");
  });

  test("reads [automount] root from /etc/wsl.conf", () => {
    expect(wslMountRoot("[automount]\nenabled = true\nroot = /win\n")).toBe("/win/");
    expect(wslMountRoot("[automount]\nroot=/drives/ # comment\n")).toBe("/drives/");
  });

  test("ignores a root key outside [automount]", () => {
    expect(wslMountRoot("[other]\nroot = /nope\n")).toBe("/mnt/");
  });
});
