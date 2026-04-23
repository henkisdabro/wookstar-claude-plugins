import { marked } from "marked";
import type { FragmentMeta } from "./types";

marked.setOptions({ gfm: true, breaks: false });

export interface ParsedFragment {
  meta: FragmentMeta;
  bodyHtml: string;
}

export async function parseFragment(path: string): Promise<ParsedFragment> {
  const file = Bun.file(path);
  const content = await file.text();

  if (path.endsWith(".fragment.md")) {
    return parseMarkdownFragment(content);
  }
  if (path.endsWith(".fragment.html")) {
    return parseLegacyHtmlFragment(content);
  }
  throw new Error("Fragment must be .fragment.md or .fragment.html");
}

function parseMarkdownFragment(content: string): ParsedFragment {
  const meta: Record<string, string> = {};
  let body = content;

  if (content.startsWith("---")) {
    const parts = content.split(/\n---\n/);
    if (parts.length >= 2) {
      const fm = parts[0].replace(/^---\n?/, "").trim();
      body = parts.slice(1).join("\n---\n").trim();
      for (const line of fm.split(/\r?\n/)) {
        const trimmed = line.trim();
        const colonIdx = trimmed.indexOf(":");
        if (colonIdx > 0) {
          const key = trimmed.slice(0, colonIdx).trim();
          const value = trimmed.slice(colonIdx + 1).trim();
          meta[key] = value;
        }
      }
    }
  }

  const preprocessed = body.replace(/~~(.+?)~~/g, "<del>$1</del>");
  const bodyHtml = marked.parse(preprocessed, { async: false }) as string;

  return { meta: meta as FragmentMeta, bodyHtml };
}

function parseLegacyHtmlFragment(content: string): ParsedFragment {
  const meta: Record<string, string> = {};
  const metaRe = /<meta\s+name="([^"]+)"\s+content="([^"]*)"\s*\/?>/gi;
  let m: RegExpExecArray | null;
  while ((m = metaRe.exec(content)) !== null) {
    meta[m[1]] = m[2];
  }

  const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) {
    throw new Error("No <body> tags found in fragment");
  }
  return { meta: meta as FragmentMeta, bodyHtml: bodyMatch[1].trim() };
}

export function validateFragment(meta: FragmentMeta, body: string): string[] {
  const errors: string[] = [];
  if (!meta.to) errors.push("Missing required field: to");
  if (!meta.subject) errors.push("Missing required field: subject");
  if (!body.trim()) errors.push("Empty body content");
  return errors;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
