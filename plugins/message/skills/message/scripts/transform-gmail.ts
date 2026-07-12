// Port of transform_gmail() from .claude/skills/message/scripts/serve.py lines 130-269.
// Semantics must stay identical - these transforms are the truth of the skill.

import { codeNewlinesToBr, stripHorizontalRules } from "./transform-shared";

function hasUserStyle(tag: string): boolean {
  return tag.includes('style="') || tag.includes("style='");
}

const BR = "<div><br></div>";

export function transformGmail(html: string): string {
  let result = html;

  result = stripHorizontalRules(result);

  // Blank-line spacers are decided on marked's semantic output, BEFORE any tag
  // conversion (afterwards headings and paragraphs are both <div> and can no
  // longer be told apart). Left blocks {p, table, blockquote, pre} give a
  // blank line; right blocks {p, h1-6, table, blockquote, pre} accept one.
  // Headings give none - the text under a heading sits flush. Lists neither
  // give nor accept one - Gmail's compose applies its own ~1em list margins on
  // paste, so a spacer div would double the gap.
  result = result.replace(
    /(<\/(?:p|table|blockquote|pre)>)\s*(<(?:p|h[1-6]|table|blockquote|pre)\b)/g,
    `$1\n${BR}\n$2`,
  );

  result = result.replace(
    /<h1[^>]*>([\s\S]*?)<\/h1>/g,
    '<div><font size="6"><b>$1</b></font></div>',
  );
  result = result.replace(
    /<h2[^>]*>([\s\S]*?)<\/h2>/g,
    '<div><font size="4"><b>$1</b></font></div>',
  );
  result = result.replace(
    /<h3[^>]*>([\s\S]*?)<\/h3>/g,
    "<div><b>$1</b></div>",
  );
  result = result.replace(
    /<h[4-6][^>]*>([\s\S]*?)<\/h[4-6]>/g,
    "<div><b>$1</b></div>",
  );

  result = result.replace(
    /<blockquote(?:\s[^>]*)?>/g,
    '<blockquote class="gmail_quote" style="margin: 0px 0px 0px 0.8ex; border-left: 1px solid rgb(204, 204, 204); padding-left: 1ex;">',
  );

  result = result.replace(
    /<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/g,
    (_m, inner: string) =>
      `<div><font face="monospace">${codeNewlinesToBr(inner)}</font></div>`,
  );
  result = result.replace(
    /<code[^>]*>([\s\S]*?)<\/code>/g,
    '<font face="monospace">$1</font>',
  );

  result = result.replace(/<strong([^>]*)>/g, "<b$1>").replace(/<\/strong>/g, "</b>");
  result = result.replace(/<em([^>]*)>/g, "<i$1>").replace(/<\/em>/g, "</i>");
  result = result.replace(/<del([^>]*)>/g, "<strike$1>").replace(/<\/del>/g, "</strike>");

  result = result.replace(/<a\s[^>]*>/g, (tag) => {
    if (hasUserStyle(tag)) return tag;
    const hrefMatch = tag.match(/href="[^"]*"/);
    const href = hrefMatch ? hrefMatch[0] : "";
    return `<a ${href} style="color: rgb(17, 85, 204);">`;
  });

  result = result.replace(/<table(?:\s[^>]*)?>/g, (tag) =>
    hasUserStyle(tag)
      ? tag
      : '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; border: 1px solid #999999;">',
  );
  result = result.replace(/<td(?:\s[^>]*)?>/g, (tag) =>
    hasUserStyle(tag)
      ? tag
      : '<td style="border: 1px solid #999999; padding: 8px;">',
  );
  result = result.replace(/<th(?:\s[^>]*)?>/g, (tag) =>
    hasUserStyle(tag)
      ? tag
      : '<th style="border: 1px solid #999999; padding: 8px; font-weight: bold; background-color: #f2f2f2;">',
  );

  result = result.replace(/<p([^>]*)>/g, "<div$1>").replace(/<\/p>/g, "</div>");

  return result;
}
