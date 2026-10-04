#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""Scan directory trees for stale Claude model IDs of one family. Read-only.

Matches dated and dateless API IDs, old-order `claude-3-5-sonnet-*`, `-latest`,
dotted versions, OpenRouter `anthropic/`, Bedrock and Vertex forms, and prose
such as "Sonnet 4.5". Anything that is CURRENT_ID (in any platform form) is
skipped. Each hit is classed:

  RECORD  history the scan must never rewrite: logs, transcripts, changelogs,
          backups, caches, session stores, vendored third-party trees, plus
          every path regex in the ignore file and --record
  TARGET  everything else: skills, agents, prompts, configs, code, docs

Writes scan-<family>.tsv (file, line, match, group) to --out. Needs ripgrep.
"""

import argparse
import collections
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

SKIP_DIRS = [".git", "node_modules", ".venv", "venv", "__pycache__", ".cache", ".npm",
             ".pnpm-store", ".cargo", ".rustup", ".Trash", "Library", "dist", "build"]

RECORD = [
    r"(^|/)CHANGELOG", r"(^|/)HISTORY", r"(^|/)RELEASE[_-]?NOTES", r"\.log$", r"\.jsonl$",
    r"/logs?/", r"/history/", r"transcript", r"backup", r"/archive/",
    r"/\.claude/(projects|sessions|file-history|paste-cache|cache|telemetry|backups|"
    r"shell-snapshots|todos|plugins)/", r"/\.claude\.json", r"stats-cache",
    r"/site-packages/", r"/vendor/", r"/third[_-]party/", r"/\.local/share/", r"/go/pkg/",
]

IGNORE_FILE = Path(os.environ.get("XDG_CONFIG_HOME", "~/.config")).expanduser() / "claude-model-upgrade" / "ignore"


def build_pattern(family: str) -> str:
    F = re.escape(family)
    cap = f"[{family[0].upper()}{family[0]}]{F[1:]}"
    return (
        rf"(anthropic[./])?((us|eu|apac|au|jp|global)\.)?(anthropic\.)?"
        rf"(claude[-.][0-9]([-.][0-9])?[-.]{F}[-.a-z0-9:@]*"
        rf"|claude[-.]?"
        rf"{F}[-.]?[0-9]*([-.][0-9]+)?"
        rf"([-.](latest|thinking|think|[0-9]{{8}}|[0-9]{{4}}))*(@[0-9]{{8}})?(-v[0-9](:[0-9])?)?)"
        rf"|\b{cap}[- ]?[0-9](\.[0-9])?\b"
    )


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("family", help="model family, e.g. sonnet, opus, haiku, fable")
    ap.add_argument("current", help="current model ID for that family, e.g. claude-sonnet-5-5")
    ap.add_argument("roots", nargs="*", default=["."], help="directories to scan (default: .)")
    ap.add_argument("--exclude", action="append", default=[], metavar="GLOB",
                    help="skip paths matching this ripgrep glob entirely (repeatable)")
    ap.add_argument("--record", action="append", default=[], metavar="REGEX",
                    help="class paths matching this regex as RECORD (repeatable)")
    ap.add_argument("--ignore-file", default=str(IGNORE_FILE), metavar="FILE",
                    help=f"one RECORD path regex per line, # for comments (default: {IGNORE_FILE})")
    ap.add_argument("--out", default=".", metavar="DIR", help="where to write scan-<family>.tsv")
    args = ap.parse_args()

    if not shutil.which("rg"):
        sys.exit("ripgrep (rg) is required: https://github.com/BurntSushi/ripgrep#installation")

    family = args.family.lower()
    base = re.sub(r"-\d{8}$", "", args.current)  # claude-haiku-4-5-20251001 -> claude-haiku-4-5
    cur = re.compile(
        r"^(anthropic[./])?((us|eu|apac|au|jp|global)\.)?(anthropic\.)?"
        + re.escape(base) + r"([-@]\d{8})?(-v\d(:\d)?)?$", re.I)
    ver = base.split(family + "-", 1)[-1]  # "5-5"
    prose_ok = {f"{family} {ver.replace('-', '.')}", f"{family}-{ver}", f"{family} {ver}"}

    record_rx = list(RECORD) + args.record
    ignore = Path(args.ignore_file).expanduser()
    if ignore.is_file():
        record_rx += [ln.strip() for ln in ignore.read_text().splitlines()
                      if ln.strip() and not ln.lstrip().startswith("#")]
    record = re.compile("|".join(f"(?:{r})" for r in record_rx), re.I)

    cmd = ["rg", "-InoH", "--no-messages", "--hidden", "--max-filesize", "5M", "-e", build_pattern(family)]
    for g in SKIP_DIRS:
        cmd += ["-g", f"!{g}"]
    for g in args.exclude:
        cmd += ["-g", f"!{g}"]
    cmd += [os.path.expanduser(r) for r in args.roots]
    out = subprocess.run(cmd, capture_output=True, text=True).stdout

    variants, groups, rows = collections.Counter(), collections.Counter(), []
    for line in out.splitlines():
        parts = line.split(":", 2)
        if len(parts) < 3:
            continue
        f, ln, m = parts
        m = m.strip()
        if cur.match(m) or m.lower() in prose_ok:
            continue
        g = "RECORD" if record.search(f) else "TARGET"
        groups[g] += 1
        if g == "TARGET":
            variants[m] += 1
        rows.append((f, ln, m, g))

    tsv = Path(args.out) / f"scan-{family}.tsv"
    tsv.write_text("".join("\t".join(r) + "\n" for r in rows))

    print("| Group | Hits |\n|---|---|")
    for g in ("TARGET", "RECORD"):
        print(f"| {g} | {groups[g]} |")
    print("\n| TARGET variant | Hits |\n|---|---|")
    for v, n in variants.most_common(40):
        print(f"| `{v}` | {n} |")
    print(f"\nTARGET files: {len({r[0] for r in rows if r[3] == 'TARGET'})}  ->  {tsv}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
