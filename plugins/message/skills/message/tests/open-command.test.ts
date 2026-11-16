import { test, expect, describe } from "bun:test";
import { openCommand, handlerProbe, appScheme, wslMountRoot } from "../scripts/open-command";

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

describe("handlerProbe", () => {
  const env = { ...none, platform: "darwin", isWSL: false, hasDisplay: false };

  test("web and mail links need no probe", () => {
    expect(appScheme("https://app.slack.com/client")).toBeNull();
    expect(appScheme("mailto:a@b.com")).toBeNull();
    expect(handlerProbe("https://web.telegram.org/", env)).toBeNull();
    expect(appScheme("msteams:")).toBe("msteams");
  });

  test("macOS asks NSWorkspace, with the URL as an argument, never in the script", () => {
    const p = handlerProbe("slack://open", env)!;
    expect(p.argv.slice(0, 4)).toEqual(["osascript", "-l", "JavaScript", "-e"]);
    expect(p.argv[4]).not.toContain("slack");
    expect(p.argv[5]).toBe("slack://open");
    expect(p.read(0, "present\n")).toBe("present");
    expect(p.read(0, "absent\n")).toBe("absent");
    expect(p.read(1, "")).toBe("unknown");
  });

  test("Windows asks AssocQueryString through PowerShell, and reads its three answers", () => {
    const p = handlerProbe("msteams:", { ...env, platform: "win32" })!;
    expect(p.argv.slice(0, 4)).toEqual(["powershell.exe", "-NoProfile", "-NonInteractive", "-Command"]);
    expect(p.argv[4]).toContain("AssocQueryString(0x1000,4,'msteams'");
    expect(p.read(0, "present\r\n")).toBe("present");
    expect(p.read(0, "absent\r\n")).toBe("absent");
    expect(p.read(0, "unknown\r\n")).toBe("unknown");
  });

  test("WSL finds powershell.exe on PATH or on a mounted drive, else no probe", () => {
    const wsl = { ...env, platform: "linux", isWSL: true };
    expect(handlerProbe("tg://", { ...wsl, which: (n: string) => (n === "powershell.exe" ? "/c/ps.exe" : null) })!.argv[0]).toBe("/c/ps.exe");
    const ps = "/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe";
    expect(handlerProbe("tg://", { ...wsl, drives: ["/mnt/c"], exists: (p: string) => p === ps })!.argv[0]).toBe(ps);
    expect(handlerProbe("tg://", { ...wsl, drives: ["/mnt/c"] })).toBeNull();
  });

  test("Linux trusts empty xdg-mime output only inside a desktop session", () => {
    const linux = { ...env, platform: "linux", which: (n: string) => (n === "xdg-mime" ? "/usr/bin/xdg-mime" : null) };
    const p = handlerProbe("discord://", { ...linux, hasDisplay: true })!;
    expect(p.argv).toEqual(["xdg-mime", "query", "default", "x-scheme-handler/discord"]);
    expect(p.read(0, "discord.desktop\n")).toBe("present");
    expect(p.read(0, "\n")).toBe("absent");
    expect(p.read(1, "")).toBe("unknown");
    expect(handlerProbe("discord://", { ...linux, hasDisplay: false })!.read(0, "")).toBe("unknown");
    expect(handlerProbe("discord://", { ...env, platform: "linux" })).toBeNull();
  });
});
