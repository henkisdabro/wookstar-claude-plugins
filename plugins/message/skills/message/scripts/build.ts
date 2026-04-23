import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import type { BuildResult, FragmentMeta } from "./types";
import { parseFragment, validateFragment, escapeHtml } from "./parse";
import { transformGmail } from "./transform-gmail";
import { transformOutlook } from "./transform-outlook";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SHELL_PATH = join(SCRIPT_DIR, "..", "templates", "shell.html");

let shellCache: string | null = null;

async function loadShell(): Promise<string> {
  if (shellCache) return shellCache;
  shellCache = await Bun.file(SHELL_PATH).text();
  return shellCache;
}

function assemble(
  shell: string,
  meta: FragmentMeta,
  gmailBody: string,
  outlookBody: string,
  rawBody: string,
): string {
  return shell
    .replaceAll("<!-- INJECT:PAGE_TITLE -->", escapeHtml(meta.title || "Message Preview"))
    .replaceAll("<!-- INJECT:TO -->", escapeHtml(meta.to || ""))
    .replaceAll("<!-- INJECT:CC -->", escapeHtml(meta.cc || ""))
    .replaceAll("<!-- INJECT:BCC -->", escapeHtml(meta.bcc || ""))
    .replaceAll("<!-- INJECT:SUBJECT -->", escapeHtml(meta.subject || ""))
    .replaceAll("<!-- INJECT:GMAIL_BODY -->", gmailBody)
    .replaceAll("<!-- INJECT:OUTLOOK_BODY -->", outlookBody)
    .replaceAll("<!-- INJECT:RAW_BODY -->", rawBody);
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
  const html = assemble(shell, meta, gmailBody, outlookBody, rawBody);
  await atomicWrite(outputPath, html);

  return { outputPath, meta, gmailBody, outlookBody, rawBody, html };
}
