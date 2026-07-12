// Port of transform_outlook() from .claude/skills/message/scripts/serve.py lines 288-450.
// Adds Outlook-compatible inline styles. Word engine strips <style> blocks.

import { codeNewlinesToBr, stripHorizontalRules } from "./transform-shared";

const FONT = "font-family: Aptos, Calibri, Arial, sans-serif";
const SIZE = "font-size: 11pt";
const COLOR = "color: #000000";
const LINE = "mso-line-height-rule: exactly; line-height: 115%";
const BASE = `${FONT}; ${SIZE}; ${COLOR}; margin: 0; ${LINE}`;

function hasUserStyle(tag: string): boolean {
  return tag.includes('style="') || tag.includes("style='");
}

const SPACER = `<p style="${FONT}; ${SIZE}; ${COLOR}; margin: 0;">&nbsp;</p>`;

export function transformOutlook(html: string): string {
  let result = html;

  result = stripHorizontalRules(result);

  // Consecutive paragraphs get a blank-line spacer. This runs on marked's
  // semantic output BEFORE heading conversion (headings also become <p> below,
  // and heading -> following text must stay flush), so only real paragraph
  // boundaries match here.
  //
  // Unlike the Gmail transform (one semantic pre-conversion rule), this lane
  // keeps its remaining spacer rules post-conversion further down: their
  // boundaries (table/list/blockquote/bold-heading) key off the CONVERTED
  // markup and their output is signed-off rendering that must stay
  // byte-identical. Only the paragraph rule lives up here, because it is the
  // one boundary that post-conversion markup can no longer distinguish.
  result = result.replace(/(<\/p>)\s*(<p>)/g, `$1\n${SPACER}\n$2`);

  result = result.replace(
    /<h1[^>]*>([\s\S]*?)<\/h1>/g,
    `<p style="${FONT}; font-size: 14pt; font-weight: bold; ${COLOR}; margin: 0; mso-line-height-rule: exactly; line-height: 115%;">$1</p>`,
  );
  result = result.replace(
    /<h2[^>]*>([\s\S]*?)<\/h2>/g,
    `<p style="${FONT}; font-size: 12pt; font-weight: bold; ${COLOR}; margin: 0; mso-line-height-rule: exactly; line-height: 115%;">$1</p>`,
  );
  result = result.replace(
    /<h3[^>]*>([\s\S]*?)<\/h3>/g,
    `<p style="${FONT}; ${SIZE}; font-weight: bold; ${COLOR}; margin: 0; ${LINE};">$1</p>`,
  );
  result = result.replace(
    /<h[4-6][^>]*>([\s\S]*?)<\/h[4-6]>/g,
    `<p style="${FONT}; ${SIZE}; font-weight: bold; ${COLOR}; margin: 0; ${LINE};">$1</p>`,
  );

  result = result.replace(/<p(?:\s[^>]*)?>/g, (tag) =>
    hasUserStyle(tag) ? tag : `<p style="${BASE};">`,
  );

  result = result.replace(/<del([^>]*)>/g, "<strike$1>").replace(/<\/del>/g, "</strike>");

  result = result.replace(
    /<code[^>]*>([\s\S]*?)<\/code>/g,
    (_m, inner) =>
      `<code style="font-family: 'Courier New', Consolas, monospace; font-size: 10pt; ${COLOR}; background-color: #f4f4f4; padding: 2pt 4pt;">${inner}</code>`,
  );

  result = result.replace(
    /<pre[^>]*>([\s\S]*?)<\/pre>/g,
    (_m, inner: string) =>
      `<div style="font-family: 'Courier New', Consolas, monospace; font-size: 10pt; ${COLOR}; background-color: #f4f4f4; padding: 8pt; margin: 0 0 12pt 0;">${codeNewlinesToBr(inner)}</div>`,
  );

  result = result.replace(
    /<blockquote(?:\s[^>]*)?>/g,
    `<div style="margin: 0 0 0 4pt; border-left: 3px solid #999999; padding-left: 10pt; ${FONT}; ${SIZE}; ${COLOR};">`,
  );
  result = result.replace(/<\/blockquote>/g, "</div>");

  result = result.replace(/<ul(?:\s[^>]*)?>/g, (tag) =>
    hasUserStyle(tag) ? tag : `<ul style="margin: 0; padding-left: 20pt; ${FONT}; ${SIZE}; ${COLOR};">`,
  );
  result = result.replace(/<ol(?:\s[^>]*)?>/g, (tag) =>
    hasUserStyle(tag) ? tag : `<ol style="margin: 0; padding-left: 20pt; ${FONT}; ${SIZE}; ${COLOR};">`,
  );
  result = result.replace(/<li(?:\s[^>]*)?>/g, (tag) =>
    hasUserStyle(tag) ? tag : `<li style="margin: 0; ${FONT}; ${SIZE}; ${COLOR}; ${LINE};">`,
  );

  result = result.replace(/<table(?:\s[^>]*)?>/g, (tag) =>
    hasUserStyle(tag)
      ? tag
      : `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; border: 1px solid #999999; ${FONT}; ${SIZE};">`,
  );
  result = result.replace(/<td(?:\s[^>]*)?>/g, (tag) =>
    hasUserStyle(tag)
      ? tag
      : `<td style="border: 1px solid #999999; padding: 8pt; ${FONT}; ${SIZE}; ${COLOR}; ${LINE};">`,
  );
  result = result.replace(/<th(?:\s[^>]*)?>/g, (tag) =>
    hasUserStyle(tag)
      ? tag
      : `<th style="border: 1px solid #999999; padding: 8pt; font-weight: bold; background-color: #f2f2f2; ${FONT}; ${SIZE}; ${COLOR}; ${LINE};">`,
  );

  result = result.replace(/<a\s[^>]*>/g, (tag) => {
    if (hasUserStyle(tag)) return tag;
    const hrefMatch = tag.match(/href="[^"]*"/);
    const href = hrefMatch ? hrefMatch[0] : "";
    return `<a ${href} style="color: #0563c1; text-decoration: underline; ${FONT}; ${SIZE};">`;
  });

  // Phase 2 of the spacer mechanism - post-conversion rules keyed off the
  // CONVERTED markup. See the note on the paragraph rule above for why this
  // lane is two-phase while the Gmail lane is a single semantic pre-pass.
  result = result.replace(/(<\/p>|<\/div>)\s*(<table\b)/g, `$1\n${SPACER}\n$2`);
  result = result.replace(/(<\/table>)\s*(<p\b|<div\b)/g, `$1\n${SPACER}\n$2`);

  result = result.replace(
    /(<\/p>)\s*(<div style="margin: 0; border-left:)/g,
    `$1\n${SPACER}\n$2`,
  );
  result = result.replace(/(<\/div>)\s*(<p\b)(?=\s+style)/g, `$1\n${SPACER}\n$2`);

  result = result.replace(/(<\/p>|<\/div>)\s*(<[uo]l\b)/g, `$1\n${SPACER}\n$2`);
  result = result.replace(/(<\/[uo]l>)\s*(<p\b|<div\b)/g, `$1\n${SPACER}\n$2`);

  result = result.replace(
    /(<\/p>|<\/div>|<\/[uo]l>|<\/table>)\s*(<p style="[^"]*font-weight: bold)/g,
    `$1\n${SPACER}\n$2`,
  );

  const spacerEsc = SPACER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  result = result.replace(new RegExp(`(${spacerEsc}\\n)+${spacerEsc}`, "g"), SPACER);

  return result;
}
