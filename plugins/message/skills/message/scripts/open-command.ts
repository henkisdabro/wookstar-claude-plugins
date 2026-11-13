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

export function openCommand(url: string, env: OpenEnv): string[] | null {
  if (env.platform === "darwin") return ["open", url];
  if (env.platform === "win32") return ["rundll32.exe", ...RUNDLL, url];
  if (env.isWSL) {
    const wslview = env.which("wslview");
    if (wslview) return [wslview, url];
    const onPath = env.which("rundll32.exe");
    if (onPath) return [onPath, ...RUNDLL, url];
    // drvfs paths are case-insensitive, so one spelling finds Windows\System32.
    const found = env.drives.map((d) => `${d}/Windows/System32/rundll32.exe`).find(env.exists);
    return found ? [found, ...RUNDLL, url] : null;
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
