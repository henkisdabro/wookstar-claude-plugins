#!/usr/bin/env python3
"""Assemble a fragment file into a full email preview.

Reads a .fragment.md (Markdown with YAML frontmatter) or .fragment.html
(legacy format), converts to platform-specific HTML for Gmail and Outlook,
and injects all three versions into the shell.html template.

Usage:
    python3 assemble.py /path/to/name.fragment.md [--serve] [--timeout 600]

Requires: pip install markdown
"""

import argparse
import os
import re
import sys
import tempfile
from html.parser import HTMLParser


# ---------------------------------------------------------------------------
# Fragment parsing
# ---------------------------------------------------------------------------

class FragmentMetaParser(HTMLParser):
    """Extract <meta name="..." content="..."> tags from fragment HTML."""

    def __init__(self):
        super().__init__()
        self.meta = {}

    def handle_starttag(self, tag, attrs):
        if tag == "meta":
            attr_dict = dict(attrs)
            name = attr_dict.get("name", "")
            content = attr_dict.get("content", "")
            if name:
                self.meta[name] = content


def parse_fragment_html(fragment_path):
    """Parse a legacy .fragment.html file, returning meta dict and body HTML."""
    with open(fragment_path, encoding="utf-8") as f:
        content = f.read()

    parser = FragmentMetaParser()
    parser.feed(content)
    meta = parser.meta

    body_match = re.search(
        r"<body[^>]*>(.*)</body>", content, re.DOTALL | re.IGNORECASE
    )
    if not body_match:
        print("Error: No <body> tags found in fragment", file=sys.stderr)
        sys.exit(1)

    body = body_match.group(1).strip()
    return meta, body


def parse_fragment_md(fragment_path):
    """Parse a .fragment.md file with YAML frontmatter, returning meta dict and HTML body."""
    try:
        import markdown
    except ImportError:
        print(
            "Error: 'markdown' package required. Install with: pip install markdown",
            file=sys.stderr,
        )
        sys.exit(1)

    with open(fragment_path, encoding="utf-8") as f:
        content = f.read()

    # Split frontmatter from body
    meta = {}
    body_text = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            frontmatter = parts[1].strip()
            body_text = parts[2].strip()
            for line in frontmatter.splitlines():
                line = line.strip()
                if ":" in line:
                    key, _, value = line.partition(":")
                    meta[key.strip()] = value.strip()

    # Pre-process: convert ~~text~~ to <del>text</del> (not in standard markdown lib)
    body_text = re.sub(r"~~(.+?)~~", r"<del>\1</del>", body_text)

    # Convert Markdown to HTML
    md = markdown.Markdown(extensions=["extra"])
    html_body = md.convert(body_text)

    return meta, html_body


def validate_fragment(meta, body):
    """Validate required fields are present."""
    errors = []
    if not meta.get("to"):
        errors.append("Missing required field: to")
    if not meta.get("subject"):
        errors.append("Missing required field: subject")
    if not body:
        errors.append("Empty body content")

    if errors:
        for err in errors:
            print(f"Error: {err}", file=sys.stderr)
        sys.exit(1)


# ---------------------------------------------------------------------------
# Gmail transform: convert semantic HTML to Gmail-native elements
# ---------------------------------------------------------------------------

def transform_gmail(html):
    """Convert clean HTML to Gmail-native elements.

    Gmail uses its own element set: <div> not <p>, <b> not <strong>,
    <i> not <em>, <font> for sizing, bare lists with no inline styles.
    """
    result = html

    # Headings: h1 -> <div><font size="6"><b>text</b></font></div>
    result = re.sub(
        r"<h1[^>]*>(.*?)</h1>",
        r'<div><font size="6"><b>\1</b></font></div>',
        result,
        flags=re.DOTALL,
    )
    result = re.sub(
        r"<h2[^>]*>(.*?)</h2>",
        r'<div><font size="4"><b>\1</b></font></div>',
        result,
        flags=re.DOTALL,
    )
    result = re.sub(
        r"<h3[^>]*>(.*?)</h3>",
        r"<div><b>\1</b></div>",
        result,
        flags=re.DOTALL,
    )
    result = re.sub(
        r"<h[4-6][^>]*>(.*?)</h[4-6]>",
        r"<div><b>\1</b></div>",
        result,
        flags=re.DOTALL,
    )

    # Blockquote: add Gmail quote styling
    result = re.sub(
        r"<blockquote(?:\s[^>]*)?>",
        '<blockquote class="gmail_quote" style="margin: 0px 0px 0px 0.8ex; border-left: 1px solid rgb(204, 204, 204); padding-left: 1ex;">',
        result,
    )

    # Pre+code blocks: <pre><code>text</code></pre> -> <div><font face="monospace">text</font></div>
    result = re.sub(
        r"<pre[^>]*>\s*<code[^>]*>(.*?)</code>\s*</pre>",
        r'<div><font face="monospace">\1</font></div>',
        result,
        flags=re.DOTALL,
    )

    # Inline code: <code>text</code> -> <font face="monospace">text</font>
    result = re.sub(
        r"<code[^>]*>(.*?)</code>",
        r'<font face="monospace">\1</font>',
        result,
        flags=re.DOTALL,
    )

    # <strong> -> <b>
    result = re.sub(r"<strong([^>]*)>", r"<b\1>", result)
    result = result.replace("</strong>", "</b>")

    # <em> -> <i>
    result = re.sub(r"<em([^>]*)>", r"<i\1>", result)
    result = result.replace("</em>", "</i>")

    # <del> -> <strike>
    result = re.sub(r"<del([^>]*)>", r"<strike\1>", result)
    result = result.replace("</del>", "</strike>")

    # Links: add Gmail default blue
    result = re.sub(
        r'<a\s+(href="[^"]*")',
        r'<a \1 style="color: rgb(17, 85, 204);"',
        result,
    )
    # Fix links that already have a style attribute (from user HTML)
    # - don't double-add style on <a> tags that already have style=
    # The regex above only matches <a href="..."> without existing style.
    # Links with existing style (user-specified colours) are preserved as-is.

    # Tables: add basic border styles for paste compatibility
    result = re.sub(
        r"<table(?:\s[^>]*)?>",
        '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; border: 1px solid #999999;">',
        result,
    )
    result = re.sub(
        r"<td(?:\s[^>]*)?>",
        '<td style="border: 1px solid #999999; padding: 8px;">',
        result,
    )
    result = re.sub(
        r"<th(?:\s[^>]*)?>",
        '<th style="border: 1px solid #999999; padding: 8px; font-weight: bold;">',
        result,
    )

    # <p> -> <div> (must be last to avoid interfering with other transforms)
    result = re.sub(r"<p([^>]*)>", r"<div\1>", result)
    result = result.replace("</p>", "</div>")

    # Gmail spacing: insert <div><br></div> between consecutive paragraph divs
    # This mimics Gmail's native blank-line-between-paragraphs behaviour
    _BR = "<div><br></div>"
    result = re.sub(r"</div>\s*<div>", f"</div>\n{_BR}\n<div>", result)

    # Spacing before block elements: headings, tables, blockquotes
    result = re.sub(
        r"</div>\s*(<div><font size=)",
        f"</div>\n{_BR}\n\\1",
        result,
    )
    result = re.sub(
        r"</div>\s*(<div><b>)",
        f"</div>\n{_BR}\n\\1",
        result,
    )
    result = re.sub(
        r"(?<!</div>\n<div><br></div>)\s*(<table\b)",
        f"\n{_BR}\n\\1",
        result,
    )
    result = re.sub(
        r"(</table>)\s*",
        f"\\1\n{_BR}\n",
        result,
    )
    result = re.sub(
        r"(?<!</div>\n<div><br></div>)\s*(<blockquote\b)",
        f"\n{_BR}\n\\1",
        result,
    )
    result = re.sub(
        r"(</blockquote>)\s*",
        f"\\1\n{_BR}\n",
        result,
    )

    # Clean up: collapse multiple consecutive <div><br></div> into one
    while f"{_BR}\n{_BR}" in result:
        result = result.replace(f"{_BR}\n{_BR}", _BR)

    return result


# ---------------------------------------------------------------------------
# Outlook transform: add inline styles to every element
# ---------------------------------------------------------------------------

_OUTLOOK_FONT = "font-family: Aptos, Calibri, Arial, sans-serif"
_OUTLOOK_SIZE = "font-size: 11pt"
_OUTLOOK_COLOR = "color: #000000"
_OUTLOOK_LINE = "mso-line-height-rule: exactly; line-height: 115%"
_OUTLOOK_BASE = f"{_OUTLOOK_FONT}; {_OUTLOOK_SIZE}; {_OUTLOOK_COLOR}; margin: 0; {_OUTLOOK_LINE}"


def _has_user_style(match_str):
    """Check if a tag already has a style attribute (user-specified)."""
    return 'style="' in match_str or "style='" in match_str


def transform_outlook(html):
    """Add Outlook-compatible inline styles to every element.

    Outlook uses Word's rendering engine which strips <style> blocks
    and does not inherit styles. Every element needs explicit inline styles.
    Only platform defaults are applied - user-specified inline styles are preserved.
    """
    result = html

    # Headings: <h1> -> <p style="font-size:14pt; font-weight:bold; ...">
    result = re.sub(
        r"<h1[^>]*>(.*?)</h1>",
        rf'<p style="{_OUTLOOK_FONT}; font-size: 14pt; font-weight: bold; {_OUTLOOK_COLOR}; margin: 0; mso-line-height-rule: exactly; line-height: 115%;">\1</p>',
        result,
        flags=re.DOTALL,
    )
    result = re.sub(
        r"<h2[^>]*>(.*?)</h2>",
        rf'<p style="{_OUTLOOK_FONT}; font-size: 12pt; font-weight: bold; {_OUTLOOK_COLOR}; margin: 0; mso-line-height-rule: exactly; line-height: 115%;">\1</p>',
        result,
        flags=re.DOTALL,
    )
    result = re.sub(
        r"<h3[^>]*>(.*?)</h3>",
        rf'<p style="{_OUTLOOK_FONT}; {_OUTLOOK_SIZE}; font-weight: bold; {_OUTLOOK_COLOR}; margin: 0; {_OUTLOOK_LINE};">\1</p>',
        result,
        flags=re.DOTALL,
    )
    result = re.sub(
        r"<h[4-6][^>]*>(.*?)</h[4-6]>",
        rf'<p style="{_OUTLOOK_FONT}; {_OUTLOOK_SIZE}; font-weight: bold; {_OUTLOOK_COLOR}; margin: 0; {_OUTLOOK_LINE};">\1</p>',
        result,
        flags=re.DOTALL,
    )

    # Paragraphs: add full inline styles (only those without existing style)
    def _style_p(m):
        tag_content = m.group(0)
        if _has_user_style(tag_content):
            return tag_content
        return f'<p style="{_OUTLOOK_BASE};">'

    result = re.sub(r"<p(?:\s[^>]*)?>", _style_p, result)

    # <del> -> <strike> (Outlook uses <strike>)
    result = re.sub(r"<del([^>]*)>", r"<strike\1>", result)
    result = result.replace("</del>", "</strike>")

    # Code: inline styling
    def _style_code(m):
        inner = m.group(1)
        return f'<code style="font-family: \'Courier New\', Consolas, monospace; font-size: 10pt; {_OUTLOOK_COLOR}; background-color: #f4f4f4; padding: 2pt 4pt;">{inner}</code>'

    result = re.sub(r"<code[^>]*>(.*?)</code>", _style_code, result, flags=re.DOTALL)

    # Pre blocks: style as code blocks
    def _style_pre(m):
        inner = m.group(1)
        return f'<div style="font-family: \'Courier New\', Consolas, monospace; font-size: 10pt; {_OUTLOOK_COLOR}; background-color: #f4f4f4; padding: 8pt; margin: 0 0 12pt 0;">{inner}</div>'

    result = re.sub(r"<pre[^>]*>(.*?)</pre>", _style_pre, result, flags=re.DOTALL)

    # Blockquote: convert to <div> with border-left for Outlook paste compatibility
    # Outlook strips <blockquote> on paste but preserves styled <div>
    def _style_blockquote(m):
        return f'<div style="margin: 0 0 0 4pt; border-left: 3px solid #999999; padding-left: 10pt; {_OUTLOOK_FONT}; {_OUTLOOK_SIZE}; {_OUTLOOK_COLOR};">'

    result = re.sub(r"<blockquote(?:\s[^>]*)?>", _style_blockquote, result)
    result = result.replace("</blockquote>", "</div>")

    # Lists
    def _style_ul(m):
        tag_content = m.group(0)
        if _has_user_style(tag_content):
            return tag_content
        return f'<ul style="margin: 0; padding-left: 20pt; {_OUTLOOK_FONT}; {_OUTLOOK_SIZE}; {_OUTLOOK_COLOR};">'

    def _style_ol(m):
        tag_content = m.group(0)
        if _has_user_style(tag_content):
            return tag_content
        return f'<ol style="margin: 0; padding-left: 20pt; {_OUTLOOK_FONT}; {_OUTLOOK_SIZE}; {_OUTLOOK_COLOR};">'

    def _style_li(m):
        tag_content = m.group(0)
        if _has_user_style(tag_content):
            return tag_content
        return f'<li style="margin: 0; {_OUTLOOK_FONT}; {_OUTLOOK_SIZE}; {_OUTLOOK_COLOR}; {_OUTLOOK_LINE};">'

    result = re.sub(r"<ul(?:\s[^>]*)?>", _style_ul, result)
    result = re.sub(r"<ol(?:\s[^>]*)?>", _style_ol, result)
    result = re.sub(r"<li(?:\s[^>]*)?>", _style_li, result)

    # Tables
    def _style_table(m):
        tag_content = m.group(0)
        if _has_user_style(tag_content):
            return tag_content
        return f'<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; border: 1px solid #999999; {_OUTLOOK_FONT}; {_OUTLOOK_SIZE};">'

    def _style_td(m):
        tag_content = m.group(0)
        if _has_user_style(tag_content):
            return tag_content
        return f'<td style="border: 1px solid #999999; padding: 8pt; {_OUTLOOK_FONT}; {_OUTLOOK_SIZE}; {_OUTLOOK_COLOR}; {_OUTLOOK_LINE};">'

    def _style_th(m):
        tag_content = m.group(0)
        if _has_user_style(tag_content):
            return tag_content
        return f'<th style="border: 1px solid #999999; padding: 8pt; font-weight: bold; {_OUTLOOK_FONT}; {_OUTLOOK_SIZE}; {_OUTLOOK_COLOR}; {_OUTLOOK_LINE};">'

    result = re.sub(r"<table(?:\s[^>]*)?>", _style_table, result)
    result = re.sub(r"<td(?:\s[^>]*)?>", _style_td, result)
    result = re.sub(r"<th(?:\s[^>]*)?>", _style_th, result)

    # Links
    def _style_a(m):
        tag_content = m.group(0)
        if _has_user_style(tag_content):
            return tag_content
        # Extract href and any other attributes
        href_match = re.search(r'href="[^"]*"', tag_content)
        href = href_match.group(0) if href_match else ""
        return f'<a {href} style="color: #0563c1; text-decoration: underline; {_OUTLOOK_FONT}; {_OUTLOOK_SIZE};">'

    result = re.sub(r"<a\s[^>]*>", _style_a, result)

    # Horizontal rules
    result = re.sub(
        r"<hr\s*/?>",
        '<hr style="border: none; border-top: 1px solid #cccccc; margin: 24pt 0;">',
        result,
    )

    # Outlook spacing: insert &nbsp; spacer before/after block elements only
    # No spacers between consecutive paragraphs - Outlook Classic has tight spacing
    _SPACER = f'<p style="{_OUTLOOK_FONT}; {_OUTLOOK_SIZE}; {_OUTLOOK_COLOR}; margin: 0;">&nbsp;</p>'

    # Spacer before/after tables
    result = re.sub(r"(</p>|</div>)\s*(<table\b)", f"\\1\n{_SPACER}\n\\2", result)
    result = re.sub(r"(</table>)\s*(<p\b|<div\b)", f"\\1\n{_SPACER}\n\\2", result)

    # Spacer before/after blockquote divs (identified by border-left in style)
    result = re.sub(
        r"(</p>)\s*(<div style=\"margin: 0; border-left:)",
        f"\\1\n{_SPACER}\n\\2",
        result,
    )
    result = re.sub(
        r"(</div>)\s*(<p\b)(?=\s+style)",
        f"\\1\n{_SPACER}\n\\2",
        result,
    )

    # Spacer before/after lists
    result = re.sub(r"(</p>|</div>)\s*(<[uo]l\b)", f"\\1\n{_SPACER}\n\\2", result)
    result = re.sub(r"(</[uo]l>)\s*(<p\b|<div\b)", f"\\1\n{_SPACER}\n\\2", result)

    # Spacer before headings (p tags with font-weight: bold)
    result = re.sub(
        r"(</p>|</div>|</[uo]l>|</table>)\s*(<p style=\"[^\"]*font-weight: bold)",
        f"\\1\n{_SPACER}\n\\2",
        result,
    )

    # Clean up: collapse multiple consecutive spacers into one
    while f"{_SPACER}\n{_SPACER}" in result:
        result = result.replace(f"{_SPACER}\n{_SPACER}", _SPACER)

    return result


# ---------------------------------------------------------------------------
# Assembly
# ---------------------------------------------------------------------------

def assemble(shell_path, meta, gmail_body, outlook_body, raw_body):
    """Inject three body versions and metadata into shell template."""
    with open(shell_path, encoding="utf-8") as f:
        html = f.read()

    # Inject metadata fields (order matters - bodies last)
    title = meta.get("title", "HTML Email Preview")
    html = html.replace("<!-- INJECT:PAGE_TITLE -->", title)
    html = html.replace("<!-- INJECT:TO -->", meta.get("to", ""))
    html = html.replace("<!-- INJECT:CC -->", meta.get("cc", ""))
    html = html.replace("<!-- INJECT:BCC -->", meta.get("bcc", ""))
    html = html.replace("<!-- INJECT:SUBJECT -->", meta.get("subject", ""))
    # Bodies last to prevent body content containing marker text
    html = html.replace("<!-- INJECT:GMAIL_BODY -->", gmail_body)
    html = html.replace("<!-- INJECT:OUTLOOK_BODY -->", outlook_body)
    html = html.replace("<!-- INJECT:RAW_BODY -->", raw_body)

    return html


def atomic_write(output_path, content):
    """Write content to file atomically using temp file + rename."""
    output_dir = os.path.dirname(os.path.abspath(output_path))
    fd, tmp_path = tempfile.mkstemp(dir=output_dir, suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(content)
        os.replace(tmp_path, output_path)
    except Exception:
        os.unlink(tmp_path)
        raise


def main():
    parser = argparse.ArgumentParser(
        description="Assemble fragment into full email preview"
    )
    parser.add_argument("fragment", help="Path to .fragment.md or .fragment.html file")
    parser.add_argument(
        "--serve",
        action="store_true",
        help="Launch preview server after assembly",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=600,
        help="Preview server idle timeout in seconds (default: 600)",
    )
    args = parser.parse_args()

    fragment_path = os.path.abspath(args.fragment)
    if not os.path.isfile(fragment_path):
        print(f"Error: {fragment_path} not found", file=sys.stderr)
        sys.exit(1)

    # Resolve shell.html relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    shell_path = os.path.join(script_dir, "..", "templates", "shell.html")
    shell_path = os.path.normpath(shell_path)

    if not os.path.isfile(shell_path):
        print(f"Error: shell.html not found at {shell_path}", file=sys.stderr)
        sys.exit(1)

    # Parse fragment based on extension
    if fragment_path.endswith(".fragment.md"):
        meta, body_html = parse_fragment_md(fragment_path)
        output_path = fragment_path.replace(".fragment.md", ".html")
    elif fragment_path.endswith(".fragment.html"):
        meta, body_html = parse_fragment_html(fragment_path)
        output_path = fragment_path.replace(".fragment.html", ".html")
    else:
        print("Error: Fragment must be .fragment.md or .fragment.html", file=sys.stderr)
        sys.exit(1)

    validate_fragment(meta, body_html)

    # For .fragment.md: generate platform-specific transforms
    # For .fragment.html: body already has inline styles, use as-is for all three
    if fragment_path.endswith(".fragment.md"):
        gmail_body = transform_gmail(body_html)
        outlook_body = transform_outlook(body_html)
        raw_body = body_html
    else:
        # Legacy: same body for all three (backward compat)
        gmail_body = body_html
        outlook_body = body_html
        raw_body = body_html

    # Safety: if no .fragment in name, append _assembled
    if output_path == fragment_path:
        output_path = fragment_path.replace(".html", "_assembled.html")
        if output_path.endswith(".md"):
            output_path = fragment_path + ".assembled.html"

    # Assemble
    result = assemble(shell_path, meta, gmail_body, outlook_body, raw_body)

    atomic_write(output_path, result)
    print(output_path, flush=True)

    # Optionally launch preview server
    if args.serve:
        preview_script = os.path.join(script_dir, "preview-server.py")
        os.execvp(
            sys.executable,
            [sys.executable, preview_script, output_path, "--timeout", str(args.timeout)],
        )


if __name__ == "__main__":
    main()
