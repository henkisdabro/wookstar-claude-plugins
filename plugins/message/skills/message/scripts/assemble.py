#!/usr/bin/env python3
"""Assemble a fragment HTML file into a full email preview.

Reads a small .fragment.html file (meta tags + body), injects into the
static shell.html template, and writes a self-contained .html output.

Usage:
    python3 assemble.py /path/to/name.fragment.html [--serve] [--timeout 600]
"""

import argparse
import os
import re
import sys
import tempfile
from html.parser import HTMLParser


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


def parse_fragment(fragment_path):
    """Parse a fragment HTML file, returning meta dict and body HTML."""
    with open(fragment_path, encoding="utf-8") as f:
        content = f.read()

    # Parse meta tags
    parser = FragmentMetaParser()
    parser.feed(content)
    meta = parser.meta

    # Extract body content
    body_match = re.search(
        r"<body[^>]*>(.*)</body>", content, re.DOTALL | re.IGNORECASE
    )
    if not body_match:
        print("Error: No <body> tags found in fragment", file=sys.stderr)
        sys.exit(1)

    body = body_match.group(1).strip()

    return meta, body


def validate_fragment(meta, body):
    """Validate required fields are present."""
    errors = []
    if not meta.get("to"):
        errors.append("Missing required meta tag: to")
    if not meta.get("subject"):
        errors.append("Missing required meta tag: subject")
    if not body:
        errors.append("Empty body content")

    if errors:
        for err in errors:
            print(f"Error: {err}", file=sys.stderr)
        sys.exit(1)


def assemble(shell_path, meta, body):
    """Inject fragment data into shell template."""
    with open(shell_path, encoding="utf-8") as f:
        html = f.read()

    # Inject metadata fields (order matters - do BODY last)
    title = meta.get("title", "HTML Email Preview")
    html = html.replace("<!-- INJECT:PAGE_TITLE -->", title)
    html = html.replace("<!-- INJECT:TO -->", meta.get("to", ""))
    html = html.replace("<!-- INJECT:CC -->", meta.get("cc", ""))
    html = html.replace("<!-- INJECT:BCC -->", meta.get("bcc", ""))
    html = html.replace("<!-- INJECT:SUBJECT -->", meta.get("subject", ""))
    # Body LAST to prevent body content containing marker text
    html = html.replace("<!-- INJECT:BODY -->", body)

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
        description="Assemble fragment HTML into full email preview"
    )
    parser.add_argument("fragment", help="Path to .fragment.html file")
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

    # Parse and validate fragment
    meta, body = parse_fragment(fragment_path)
    validate_fragment(meta, body)

    # Assemble
    result = assemble(shell_path, meta, body)

    # Output path: strip .fragment from filename
    output_path = fragment_path.replace(".fragment.html", ".html")
    if output_path == fragment_path:
        # Safety: if no .fragment in name, append _assembled
        output_path = fragment_path.replace(".html", "_assembled.html")

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
