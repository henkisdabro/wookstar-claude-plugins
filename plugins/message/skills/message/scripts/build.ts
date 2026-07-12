import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import type { BuildResult, FragmentMeta } from "./types";
import { parseFragment, validateFragment, escapeHtml } from "./parse";
import { transformGmail } from "./transform-gmail";
import { transformOutlook } from "./transform-outlook";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SHELL_PATH = join(SCRIPT_DIR, "..", "templates", "shell.html");
// Client helpers authored/tested as ES modules, then inlined into the preview
// so the built page stays a self-contained, zero-network-fetch file. Single
// source of truth: the browser runs the exact code the tests exercise.
const CLIENT_JS_FILES = [
  join(SCRIPT_DIR, "client", "mailto.js"),
  join(SCRIPT_DIR, "client", "whatsapp.js"),
];

let shellCache: string | null = null;
let clientJsCache: string | null = null;

async function loadShell(): Promise<string> {
  if (shellCache) return shellCache;
  shellCache = await Bun.file(SHELL_PATH).text();
  return shellCache;
}

async function loadClientJs(): Promise<string> {
  if (clientJsCache !== null) return clientJsCache;
  const parts = await Promise.all(CLIENT_JS_FILES.map((f) => Bun.file(f).text()));
  // Strip ESM `export ` so the declarations become plain globals the inline
  // preview script can call; the modules import cleanly in the test runner.
  const js = parts.join("\n\n").replace(/^\s*export\s+/gm, "");
  clientJsCache = js;
  return js;
}

function assemble(
  shell: string,
  meta: FragmentMeta,
  gmailBody: string,
  outlookBody: string,
  rawBody: string,
  clientJs: string,
): string {
  // Function replacements, not string replacements: a plain replacement string
  // makes replaceAll interpret `$'`, `` $` ``, `$&`, `$1` as substitution
  // patterns, which silently corrupts any body/subject containing them (e.g.
  // the finance notation "in $'000s"). A replacer function is taken verbatim.
  const inject = (s: string, marker: string, value: string): string =>
    s.replaceAll(marker, () => value);
  let out = shell;
  out = inject(out, "<!-- INJECT:PAGE_TITLE -->", escapeHtml(meta.title || "Message Preview"));
  out = inject(out, "<!-- INJECT:TO -->", escapeHtml(meta.to || ""));
  out = inject(out, "<!-- INJECT:CC -->", escapeHtml(meta.cc || ""));
  out = inject(out, "<!-- INJECT:BCC -->", escapeHtml(meta.bcc || ""));
  out = inject(out, "<!-- INJECT:SUBJECT -->", escapeHtml(meta.subject || ""));
  out = inject(out, "<!-- INJECT:GMAIL_BODY -->", gmailBody);
  out = inject(out, "<!-- INJECT:OUTLOOK_BODY -->", outlookBody);
  out = inject(out, "<!-- INJECT:RAW_BODY -->", rawBody);
  out = inject(out, "/* INJECT:CLIENT_JS */", clientJs);
  return out;
}

async function atomicWrite(outputPath: string, content: string): Promise<void> {
  const dir = dirname(outputPath);
  const tmp = join(dir, `.${basename(outputPath)}.${Date.now()}.tmp`);
  await Bun.write(tmp, content);
  const { rename } = await import("node:fs/promises");
  await rename(tmp, outputPath);
}

export async function build(fragmentPath: string): Promise<BuildResult> {
  const isMarkdown = fragmentPath.endsWith(".fragment.md");
  const isHtml = fragmentPath.endsWith(".fragment.html");
  if (!isMarkdown && !isHtml) {
    throw new Error("Fragment must be .fragment.md or .fragment.html");
  }

  const outputPath = isMarkdown
    ? fragmentPath.replace(/\.fragment\.md$/, ".html")
    : fragmentPath.replace(/\.fragment\.html$/, ".html");

  const { meta, bodyHtml } = await parseFragment(fragmentPath);
  const errors = validateFragment(meta, bodyHtml);
  if (errors.length) {
    throw new Error(errors.join("; "));
  }

  const gmailBody = isMarkdown ? transformGmail(bodyHtml) : bodyHtml;
  const outlookBody = isMarkdown ? transformOutlook(bodyHtml) : bodyHtml;
  const rawBody = bodyHtml;

  const shell = await loadShell();
  const clientJs = await loadClientJs();
  const html = assemble(shell, meta, gmailBody, outlookBody, rawBody, clientJs);
  await atomicWrite(outputPath, html);

  return { outputPath, meta, gmailBody, outlookBody, rawBody, html };
}
