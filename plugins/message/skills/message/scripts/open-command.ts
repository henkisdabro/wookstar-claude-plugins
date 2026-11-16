// How the preview server hands a URL to the OS. A pure function of the
// platform and what is installed, so every branch is unit-tested without
// opening anything.
//
// Windows and WSL never go through cmd.exe: `cmd /c start <url>` re-parses the
// line and cuts a URL at its first '&' (the Gmail compose link lost every
// parameter after view=cm). rundll32's FileProtocolHandler hands the argument
// straight to the default handler instead. Under WSL the Windows directories
// are often missing from PATH (a non-login shell), so rundll32.exe is also
// looked up by absolute path on the mounted Windows drives.

export interface OpenEnv {
  platform: string;          // process.platform
  isWSL: boolean;
  which: (name: string) => string | null;
  exists: (path: string) => boolean;
  drives: string[];          // mounted Windows drive roots, e.g. ["/mnt/c"] (WSL only)
}

const RUNDLL = ["url.dll,FileProtocolHandler"];

// A Windows program from WSL: on PATH when interop put Windows there, otherwise
// by absolute path on the mounted drives (drvfs paths are case-insensitive, so
// one spelling finds Windows\System32).
function findWindowsExe(env: OpenEnv, name: string, underWindows: string): string | null {
  return env.which(name) ?? env.drives.map((d) => `${d}/Windows/${underWindows}`).find(env.exists) ?? null;
}

export function openCommand(url: string, env: OpenEnv): string[] | null {
  if (env.platform === "darwin") return ["open", url];
  if (env.platform === "win32") return ["rundll32.exe", ...RUNDLL, url];
  if (env.isWSL) {
    const wslview = env.which("wslview");
    if (wslview) return [wslview, url];
    const rundll = findWindowsExe(env, "rundll32.exe", "System32/rundll32.exe");
    return rundll ? [rundll, ...RUNDLL, url] : null;
  }
  return ["xdg-open", url];
}

// The drive mount root from /etc/wsl.conf ([automount] root=), default /mnt/.
export function wslMountRoot(wslConf: string): string {
  let section = "";
  for (const raw of wslConf.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const head = line.match(/^\[(.+)\]$/);
    if (head) { section = head[1].trim().toLowerCase(); continue; }
    const kv = line.match(/^root\s*=\s*(\S+)/);
    if (section === "automount" && kv) return kv[1].endsWith("/") ? kv[1] : kv[1] + "/";
  }
  return "/mnt/";
}

// Is a desktop app registered for an app link (slack://, msteams:, ...)? The
// preview asks the OS before opening one, so a missing app can fall back to the
// web version instead of failing silently. Registration is evidence, not proof:
// the answer is a hint, and "unknown" (no probe, a timeout, a failed probe)
// keeps the old behaviour of trying the app.
export type HandlerState = "present" | "absent" | "unknown";

export interface HandlerProbe {
  argv: string[];
  read: (exitCode: number, stdout: string) => HandlerState;
}

export interface ProbeEnv extends OpenEnv {
  hasDisplay: boolean;       // Linux: a desktop session (DISPLAY or WAYLAND_DISPLAY)
}

// The URL reaches osascript as an argument, never as script source.
const MAC_JXA =
  'function run(argv){ObjC.import("AppKit");' +
  "var u=$.NSWorkspace.sharedWorkspace.URLForApplicationToOpenURL($.NSURL.URLWithString(argv[0]));" +
  'return u.isNil()?"absent":"present"}';

// AssocQueryString with ASSOCF_IS_PROTOCOL (0x1000) and ASSOCSTR_FRIENDLYAPPNAME (4)
// asks Windows itself, so packaged (Store/MSIX) handlers count as well as
// registry ones. 0x80070483 is "no association".
const winScript = (scheme: string) =>
  "Add-Type -Namespace W -Name A -MemberDefinition '[DllImport(\"shlwapi.dll\",CharSet=CharSet.Unicode)]" +
  " public static extern uint AssocQueryString(uint f,uint s,string a,string x,System.Text.StringBuilder o,ref uint n);';" +
  "$n=[uint32]1024;$o=New-Object System.Text.StringBuilder 1024;" +
  `$r=[W.A]::AssocQueryString(0x1000,4,'${scheme}',$null,$o,[ref]$n);` +
  "if($r -eq 0 -and $o.Length -gt 0){'present'}elseif($r -eq 0x80070483){'absent'}else{'unknown'}";

const readWord = (_code: number, out: string): HandlerState => {
  const w = out.trim();
  return w === "present" || w === "absent" ? w : "unknown";
};

// The scheme of an app link, or null for web and mail links (nothing to probe).
export function appScheme(url: string): string | null {
  const m = /^([a-z][a-z0-9+.-]*):/i.exec(url);
  if (!m) return null;
  const s = m[1].toLowerCase();
  return s === "http" || s === "https" || s === "mailto" ? null : s;
}

export function handlerProbe(url: string, env: ProbeEnv): HandlerProbe | null {
  const scheme = appScheme(url);
  if (!scheme) return null;
  if (env.platform === "darwin") return { argv: ["osascript", "-l", "JavaScript", "-e", MAC_JXA, url], read: readWord };
  if (env.platform === "win32" || env.isWSL) {
    const ps = env.platform === "win32"
      ? "powershell.exe"
      : findWindowsExe(env, "powershell.exe", "System32/WindowsPowerShell/v1.0/powershell.exe");
    return ps ? { argv: [ps, "-NoProfile", "-NonInteractive", "-Command", winScript(scheme)], read: readWord } : null;
  }
  if (!env.which("xdg-mime")) return null;
  return {
    argv: ["xdg-mime", "query", "default", `x-scheme-handler/${scheme}`],
    // Empty output means "absent" only inside a working desktop session.
    read: (code, out) => (code !== 0 ? "unknown" : out.trim() ? "present" : env.hasDisplay ? "absent" : "unknown"),
  };
}
