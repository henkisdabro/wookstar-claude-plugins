import { readFileSync } from "node:fs";

export function isWSL(): boolean {
  if (process.platform !== "linux") return false;
  if (process.env.WSL_DISTRO_NAME) return true;
  try {
    return readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft");
  } catch {
    return false;
  }
}

export function openBrowser(url: string): void {
  let cmd: string[];
  if (process.platform === "darwin") cmd = ["open", url];
  else if (process.platform === "win32") cmd = ["cmd", "/c", "start", "", url];
  // WSL: open the Windows host browser. localhost is shared with the host so
  // 127.0.0.1:PORT is reachable. cmd.exe is on PATH inside WSL2 by default.
  else if (isWSL()) cmd = ["cmd.exe", "/c", "start", "", url];
  else cmd = ["xdg-open", url];
  try {
    Bun.spawn(cmd, { stdout: "ignore", stderr: "ignore" });
  } catch {
    // Non-fatal - user can open the URL manually
  }
}
