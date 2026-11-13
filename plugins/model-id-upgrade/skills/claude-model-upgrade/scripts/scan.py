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

Also flags made-up or malformed IDs - a date on a dateless (4.6+) model, a
snapshot date that never shipped, the wrong name order for 3.x versus 4+, a
dotted API ID, a -v1 suffix on a 4.6+ Bedrock ID - and says why.

Writes scan-<family>.tsv (file, line, match, group, flag) to --out. Needs ripgrep.
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

# Real dated snapshots (pre-4.6). Every model from 4.6 on is dateless, so a date on one is made up.
KNOWN_DATED = {
    "claude-3-haiku": {"20240307"}, "claude-3-sonnet": {"20240229"}, "claude-3-opus": {"20240229"},
    "claude-3-5-sonnet": {"20240620", "20241022"}, "claude-3-5-haiku": {"20241022"},
    "claude-3-7-sonnet": {"20250219"}, "claude-sonnet-4": {"20250514"}, "claude-opus-4": {"20250514"},
    "claude-opus-4-1": {"20250805"}, "claude-sonnet-4-5": {"20250929"}, "claude-haiku-4-5": {"20251001"},
    "claude-opus-4-5": {"20251101"},
}
PLATFORM_PREFIX = r"^(anthropic[./])?((us|eu|apac|au|jp|global)\.)?(anthropic\.)?"

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
        rf"|\b{cap}[- ]?[0-9](\\?[.-][0-9])?\b"
    )


def malformed(match: str, family: str) -> str:
    """Why an ID-shaped match cannot be a real model ID, or "" when it can."""
    F = re.escape(family)
    id_shape = re.compile(
        rf"claude-(?:(?P<omaj>\d)(?:[-.](?P<omin>\d))?-{F}|{F}-(?P<maj>\d+)(?:(?P<sep>[-.])(?P<min>\d{{1,2}}))?)"
        r"(?:-(?P<date>\d{8}))?(?:-latest)?"
    )
    s = match.lower()
    gateway = s.startswith("anthropic/")
    s = re.sub(PLATFORM_PREFIX, "", s)
    bedrock_v1 = re.search(r"-v\d(:\d)?$", s)
    s = re.sub(r"-v\d(:\d)?$", "", s).replace("@", "-")
    mo = id_shape.fullmatch(s)
    if not mo:
        return ""
    old = mo["omaj"] is not None
    maj, mn = (int(mo["omaj"]), int(mo["omin"] or 0)) if old else (int(mo["maj"]), int(mo["min"] or 0))
    if old and maj >= 4:
        return f"old name order on a 4+ model (claude-{family}-{maj}-...)"
    if not old and maj < 4:
        was = f"claude-{maj}-{mn}-{family}" if mn else f"claude-{maj}-{family}"
        return f"new name order on a 3.x model (it was {was})"
    if "." in s and not gateway:
        return "dotted version; API IDs use hyphens (dots only after anthropic/ on gateways)"
    if mo["date"] and (maj, mn) >= (4, 6):
        return "date on a dateless (4.6+) model"
    if mo["date"]:
        base = (f"claude-{maj}" + (f"-{mo['omin']}" if mo["omin"] else "") + f"-{family}") if old else \
               (f"claude-{family}-{maj}" + (f"-{mo['min']}" if mo["min"] else ""))
        real = KNOWN_DATED.get(base)
        if not real:
            return f"no dated snapshot exists for {base}"
        if mo["date"] not in real:
            return f"wrong snapshot date (real: {base}-{'/'.join(sorted(real))})"
    if bedrock_v1 and (maj, mn) >= (4, 6) and (family, maj, mn) != ("opus", 4, 6):
        return "-v1 suffix on a 4.6+ Bedrock ID (opus-4-6 was the last)"
    return ""


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
    gateway_cur = "anthropic/" + re.sub(r"-(\d+)-(\d+)$", r"-\1.\2", base)  # AI Gateway / OpenRouter form

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
        mm = m.replace("\\", "")  # regex-escaped prose: Haiku 5\.5
        # A trailing - or . is a truncated match (an ID built from a template variable).
        if not mm or cur.match(mm) or mm.lower() in prose_ok or mm.lower() == gateway_cur or mm[-1] in "-.":
            continue
        g = "RECORD" if record.search(f) else "TARGET"
        groups[g] += 1
        if g == "TARGET":
            variants[m] += 1
        rows.append((f, ln, m, g, malformed(mm, family)))

    tsv = Path(args.out) / f"scan-{family}.tsv"
    tsv.write_text("".join("\t".join(r) + "\n" for r in rows))

    print("| Group | Hits |\n|---|---|")
    for g in ("TARGET", "RECORD"):
        print(f"| {g} | {groups[g]} |")
    print("\n| TARGET variant | Hits |\n|---|---|")
    for v, n in variants.most_common(40):
        print(f"| `{v}` | {n} |")
    bad = collections.Counter((r[2], r[4], r[3]) for r in rows if r[4])
    if bad:
        print("\n| Made-up or malformed ID | Why | Group | Hits |\n|---|---|---|---|")
        for (v, why, g), n in sorted(bad.items(), key=lambda kv: (kv[0][2] != "TARGET", -kv[1])):
            print(f"| `{v}` | {why} | {g} | {n} |")
    print(f"\nTARGET files: {len({r[0] for r in rows if r[3] == 'TARGET'})}  ->  {tsv}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
