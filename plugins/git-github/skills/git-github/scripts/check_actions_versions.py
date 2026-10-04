#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""Resolve the current version of GitHub Actions straight from GitHub.

For each owner/repo it reads the latest release and the repo's tags, then
recommends the moving major tag (`v7`) when one exists for the latest
release's major, otherwise the full release tag (`v10.2.0`) to pin.
Works for first-party `actions/*` and third-party actions alike.

Auth: GITHUB_TOKEN or GH_TOKEN, else `gh auth token`, else anonymous
(60 requests an hour - enough for a handful of lookups).
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

API = "https://api.github.com"

COMMON = [
    "actions/checkout",
    "actions/setup-node",
    "actions/setup-python",
    "actions/setup-go",
    "actions/setup-java",
    "actions/setup-dotnet",
    "actions/cache",
    "actions/upload-artifact",
    "actions/download-artifact",
    "actions/github-script",
    "actions/configure-pages",
    "actions/upload-pages-artifact",
    "actions/deploy-pages",
    "actions/create-github-app-token",
    "actions/attest-build-provenance",
    "actions/dependency-review-action",
    "actions/labeler",
    "actions/stale",
    "pnpm/action-setup",
    "astral-sh/setup-uv",
    "oven-sh/setup-bun",
    "docker/setup-buildx-action",
    "docker/login-action",
    "docker/build-push-action",
    "softprops/action-gh-release",
    "cloudflare/wrangler-action",
]

SEMVER = re.compile(r"^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?$")
SHA = re.compile(r"^[0-9a-f]{40}$")


def token() -> str | None:
    for var in ("GITHUB_TOKEN", "GH_TOKEN"):
        if os.environ.get(var):
            return os.environ[var]
    if shutil.which("gh"):
        out = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True)
        if out.returncode == 0 and out.stdout.strip():
            return out.stdout.strip()
    return None


TOKEN = token()


def get(path: str):
    req = urllib.request.Request(f"{API}{path}", headers={"Accept": "application/vnd.github+json"})
    if TOKEN:
        req.add_header("Authorization", f"Bearer {TOKEN}")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        if e.code in (403, 429):
            sys.exit("GitHub API rate limit hit - set GITHUB_TOKEN or run `gh auth login`.")
        raise


def key(tag: str) -> tuple[int, int, int]:
    m = SEMVER.match(tag)
    return tuple(int(g or 0) for g in m.groups()) if m else (-1, -1, -1)


def resolve(action: str) -> dict:
    """Latest version info for `owner/repo[/path]`."""
    repo = "/".join(action.split("/")[:2])
    refs = get(f"/repos/{repo}/git/matching-refs/tags/v")
    if refs is None:
        return {"action": action, "error": "repository not found"}
    tags = {r["ref"].removeprefix("refs/tags/") for r in refs}
    release = (get(f"/repos/{repo}/releases/latest") or {}).get("tag_name")
    if not release or not SEMVER.match(release):
        semver = [t for t in tags if SEMVER.match(t) and "." in t]
        release = max(semver, key=key) if semver else None
    majors = [t for t in tags if re.fullmatch(r"v\d+", t)]
    if release:
        major = f"v{key(release)[0]}"
        use = major if major in tags else release
    elif majors:
        use = max(majors, key=key)
    else:
        return {"action": action, "error": "no v-prefixed version tags"}
    return {"action": action, "use": use, "latest_release": release, "tags": sorted(tags)}


def resolve_all(actions: list[str]) -> list[dict]:
    with ThreadPoolExecutor(max_workers=8) as pool:
        return list(pool.map(resolve, actions))


def workflow_uses(path: str) -> list[tuple[int, str, str]]:
    found = []
    with open(path) as fh:
        for n, line in enumerate(fh, 1):
            m = re.search(r"uses:\s*['\"]?([^@\s'\"]+)@([^\s#'\"]+)", line)
            if m and not m.group(1).startswith(("./", "docker://")):
                found.append((n, m.group(1), m.group(2)))
    return found


def validate(path: str, as_json: bool) -> int:
    uses = workflow_uses(path)
    info = {r["action"]: r for r in resolve_all(sorted({a for _, a, _ in uses}))}
    problems = []
    for line, action, ref in uses:
        r = info[action]
        if "error" in r:
            problems.append({"line": line, "action": action, "current": ref, "issue": r["error"]})
        elif SHA.match(ref):
            problems.append({"line": line, "action": action, "current": ref,
                             "issue": f"SHA pin - confirm it matches {r['use']}", "latest": r["use"]})
        elif ref not in r["tags"]:
            problems.append({"line": line, "action": action, "current": ref,
                             "issue": "tag does not exist", "latest": r["use"]})
        elif ref != r["use"] and key(ref) < key(r["use"]):
            major = key(ref)[0] != key(r["use"])[0]
            problems.append({"line": line, "action": action, "current": ref,
                             "issue": "major update" if major else "outdated", "latest": r["use"]})
    if as_json:
        print(json.dumps(problems, indent=2))
    elif problems:
        print(f"{len(problems)} issue(s) in {path}:")
        for p in problems:
            latest = f" -> {p['latest']}" if p.get("latest") else ""
            print(f"  line {p['line']}: {p['action']}@{p['current']}  [{p['issue']}]{latest}")
    else:
        print(f"All {len(uses)} action reference(s) in {path} are current.")
    return 1 if problems else 0


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Resolve current GitHub Action versions live from GitHub.",
        epilog="examples:\n  %(prog)s --common\n  %(prog)s actions/checkout pnpm/action-setup\n"
               "  %(prog)s --validate .github/workflows/ci.yml",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    ap.add_argument("actions", nargs="*", help="owner/repo[/path] to look up")
    ap.add_argument("--common", "-c", action="store_true", help="look up a list of widely used actions")
    ap.add_argument("--validate", "-v", metavar="FILE", help="check every `uses:` line in a workflow file")
    ap.add_argument("--json", "-j", action="store_true", help="JSON output")
    args = ap.parse_args()

    if args.validate:
        return validate(args.validate, args.json)
    actions = args.actions + (COMMON if args.common else [])
    if not actions:
        ap.print_help()
        return 2
    results = resolve_all(actions)
    if args.json:
        print(json.dumps([{k: v for k, v in r.items() if k != "tags"} for r in results], indent=2))
    else:
        for r in results:
            if "error" in r:
                print(f"{r['action']}: {r['error']}", file=sys.stderr)
            else:
                note = "" if r["use"] == r["latest_release"] or not r["latest_release"] else f"  (latest release {r['latest_release']})"
                print(f"{r['action']}@{r['use']}{note}")
    return 1 if any("error" in r for r in results) else 0


if __name__ == "__main__":
    sys.exit(main())
