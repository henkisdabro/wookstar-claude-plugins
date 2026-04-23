// Port of transform_gmail() from .claude/skills/message/scripts/serve.py lines 130-269.
// Semantics must stay identical — these transforms are the truth of the skill.

export function transformGmail(html: string): string {
  let result = html;

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
    '<div><font face="monospace">$1</font></div>',
  );
  result = result.replace(
    /<code[^>]*>([\s\S]*?)<\/code>/g,
    '<font face="monospace">$1</font>',
  );

  result = result.replace(/<strong([^>]*)>/g, "<b$1>").replace(/<\/strong>/g, "</b>");
  result = result.replace(/<em([^>]*)>/g, "<i$1>").replace(/<\/em>/g, "</i>");
  result = result.replace(/<del([^>]*)>/g, "<strike$1>").replace(/<\/del>/g, "</strike>");

  result = result.replace(
    /<a\s+(href="[^"]*")/g,
    '<a $1 style="color: rgb(17, 85, 204);"',
  );

  result = result.replace(
    /<table(?:\s[^>]*)?>/g,
    '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; border: 1px solid #999999;">',
  );
  result = result.replace(
    /<td(?:\s[^>]*)?>/g,
    '<td style="border: 1px solid #999999; padding: 8px;">',
  );
  result = result.replace(
    /<th(?:\s[^>]*)?>/g,
    '<th style="border: 1px solid #999999; padding: 8px; font-weight: bold;">',
  );

  result = result.replace(/<hr\s*\/?>/g, "");

  result = result.replace(/<p([^>]*)>/g, "<div$1>").replace(/<\/p>/g, "</div>");

  const BR = "<div><br></div>";
  result = result.replace(/<\/div>\s*<div>/g, `</div>\n${BR}\n<div>`);
  result = result.replace(/<\/div>\s*(<div><font size=)/g, `</div>\n${BR}\n$1`);
  result = result.replace(/<\/div>\s*(<div><b>)/g, `</div>\n${BR}\n$1`);
  result = result.replace(/(?<!<\/div>\n<div><br><\/div>)\s*(<table\b)/g, `\n${BR}\n$1`);
  result = result.replace(/(<\/table>)\s*/g, `$1\n${BR}\n`);
  result = result.replace(/(?<!<\/div>\n<div><br><\/div>)\s*(<blockquote\b)/g, `\n${BR}\n$1`);
  result = result.replace(/(<\/blockquote>)\s*/g, `$1\n${BR}\n`);

  const brEsc = BR.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  result = result.replace(new RegExp(`(${brEsc}\\n)+${brEsc}`, "g"), BR);

  return result;
}
