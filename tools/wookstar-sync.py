#!/usr/bin/env python3
"""wookstar-sync: Bidirectional sync between projects and wookstar-claude-plugins."""

import argparse
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

# ANSI colour codes
GREEN = "\033[32m"
YELLOW = "\033[33m"
RED = "\033[31m"
BOLD = "\033[1m"
DIM = "\033[2m"
RESET = "\033[0m"

MANIFEST_NAME = "skill-manifest.json"
VENDORED_MARKER = ".vendored.json"
VENDORED_COMMENT_PREFIX = "<!-- vendored from wookstar-claude-plugins:"


def find_project_root() -> Path:
    """Walk up from cwd to find a directory containing .claude/skill-manifest.json."""
    current = Path.cwd()
    while True:
        candidate = current / ".claude" / MANIFEST_NAME
        if candidate.is_file():
            return current
        parent = current.parent
        if parent == current:
            break
        current = parent
    print(f"{RED}Error: Could not find .claude/{MANIFEST_NAME} in current or parent directories.{RESET}")
    sys.exit(1)


def load_manifest(project_root: Path) -> dict:
    """Load and return the skill manifest."""
    manifest_path = project_root / ".claude" / MANIFEST_NAME
    with open(manifest_path) as f:
        return json.load(f)


def resolve_source(manifest: dict) -> Path:
    """Resolve the wookstar source path from the manifest."""
    source = Path(os.path.expanduser(manifest["source"]))
    if not source.is_dir():
        print(f"{RED}Error: Wookstar source not found at {source}{RESET}")
        sys.exit(1)
    return source


def get_git_short_hash(repo_path: Path) -> str:
    """Get the short HEAD commit hash for a git repo."""
    try:
        result = subprocess.run(
            ["git", "-C", str(repo_path), "rev-parse", "--short", "HEAD"],
            capture_output=True, text=True, check=True,
        )
        return result.stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return "unknown"


def newest_mtime(path: Path) -> float:
    """Get the newest modification time for a file or directory (recursive)."""
    if path.is_file():
        return path.stat().st_mtime
    if not path.is_dir():
        return 0.0
    newest = 0.0
    for child in path.rglob("*"):
        if child.is_file() and child.name != VENDORED_MARKER:
            mtime = child.stat().st_mtime
            if mtime > newest:
                newest = mtime
    return newest


def human_age(mtime: float) -> str:
    """Return a human-readable age string from a modification timestamp."""
    if mtime == 0.0:
        return "missing"
    delta = datetime.now().timestamp() - mtime
    if delta < 60:
        return "just now"
    if delta < 3600:
        mins = int(delta / 60)
        return f"{mins}m ago"
    if delta < 86400:
        hours = int(delta / 3600)
        return f"{hours}h ago"
    days = int(delta / 86400)
    return f"{days}d ago"


# ---------------------------------------------------------------------------
# Pull
# ---------------------------------------------------------------------------


def pull_skills(
    manifest: dict, source_root: Path, project_root: Path, force: bool
) -> int:
    """Pull vendored skills from wookstar to project. Returns count of updated items."""
    skills = manifest.get("vendor", {}).get("skills", {})
    if not skills:
        return 0

    count = 0
    for name, source_rel in skills.items():
        src = source_root / source_rel
        dst = project_root / ".claude" / "skills" / name

        if not src.is_dir():
            print(f"  {YELLOW}SKIP{RESET}  skill/{name} - source not found: {src}")
            continue

        src_mtime = newest_mtime(src)
        dst_mtime = newest_mtime(dst)

        if dst.is_dir() and dst_mtime > src_mtime and not force:
            print(
                f"  {YELLOW}SKIP{RESET}  skill/{name} - project is newer "
                f"(project {human_age(dst_mtime)}, wookstar {human_age(src_mtime)}). "
                f"Use --force to overwrite."
            )
            continue

        # Copy directory contents (preserve structure)
        if dst.is_dir():
            # Remove existing vendored files but preserve .vendored.json temporarily
            vendored_json = dst / VENDORED_MARKER
            old_marker = None
            if vendored_json.is_file():
                old_marker = vendored_json.read_text()
            shutil.rmtree(dst)
            dst.mkdir(parents=True, exist_ok=True)
        else:
            dst.mkdir(parents=True, exist_ok=True)

        # Copy all files from source
        shutil.copytree(src, dst, dirs_exist_ok=True)

        # Write vendored marker
        marker = {
            "source_plugin": name,
            "source_path": source_rel,
            "synced_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            "source_commit": get_git_short_hash(source_root),
        }
        (dst / VENDORED_MARKER).write_text(json.dumps(marker, indent=2) + "\n")

        print(f"  {GREEN}PULL{RESET}  skill/{name}")
        count += 1

    return count


def pull_files(
    category: str,
    items: dict,
    source_root: Path,
    project_root: Path,
    dest_subdir: str,
    force: bool,
) -> int:
    """Pull vendored command or agent files. Returns count of updated items."""
    if not items:
        return 0

    count = 0
    for name, source_rel in items.items():
        src = source_root / source_rel
        dst = project_root / ".claude" / dest_subdir / f"{name}.md"

        if not src.is_file():
            print(f"  {YELLOW}SKIP{RESET}  {category}/{name} - source not found: {src}")
            continue

        src_mtime = src.stat().st_mtime
        dst_mtime = dst.stat().st_mtime if dst.is_file() else 0.0

        if dst.is_file() and dst_mtime > src_mtime and not force:
            print(
                f"  {YELLOW}SKIP{RESET}  {category}/{name} - project is newer "
                f"(project {human_age(dst_mtime)}, wookstar {human_age(src_mtime)}). "
                f"Use --force to overwrite."
            )
            continue

        dst.parent.mkdir(parents=True, exist_ok=True)
        content = src.read_text()

        # Prepend vendored comment if not already present
        header = f"{VENDORED_COMMENT_PREFIX} {source_rel} -->\n"
        if not content.startswith(VENDORED_COMMENT_PREFIX):
            content = header + content

        dst.write_text(content)
        print(f"  {GREEN}PULL{RESET}  {category}/{name}")
        count += 1

    return count


def pull_mcp(manifest: dict, source_root: Path, project_root: Path) -> int:
    """Merge MCP server configs into project .mcp.json. Returns count of servers added."""
    mcp_entries = manifest.get("vendor", {}).get("mcp_servers", [])
    if not mcp_entries:
        return 0

    merged_servers: dict = {}
    existing_mcp_path = project_root / ".mcp.json"

    # Load existing .mcp.json if present (preserve non-vendored servers)
    if existing_mcp_path.is_file():
        try:
            existing = json.loads(existing_mcp_path.read_text())
            merged_servers = existing.get("mcpServers", {})
        except (json.JSONDecodeError, KeyError):
            pass

    added = 0
    for entry_path in mcp_entries:
        src = source_root / entry_path
        if not src.is_file():
            print(f"  {YELLOW}SKIP{RESET}  mcp: {entry_path} - not found")
            continue

        try:
            data = json.loads(src.read_text())
            servers = data.get("mcpServers", {})
            for server_name, server_config in servers.items():
                if server_name not in merged_servers:
                    added += 1
                merged_servers[server_name] = server_config
                print(f"  {GREEN}MCP {RESET}  {server_name} (from {entry_path})")
        except (json.JSONDecodeError, KeyError) as e:
            print(f"  {RED}ERROR{RESET} mcp: {entry_path} - {e}")

    # Write merged .mcp.json
    output = {"mcpServers": merged_servers}
    existing_mcp_path.write_text(json.dumps(output, indent=2) + "\n")
    print(f"\n  Wrote {len(merged_servers)} server(s) to .mcp.json ({added} new)")
    return added


def cmd_pull(args: argparse.Namespace) -> None:
    """Execute the pull command."""
    project_root = find_project_root()
    manifest = load_manifest(project_root)
    source_root = resolve_source(manifest)
    vendor = manifest.get("vendor", {})

    print(f"{BOLD}Pulling from{RESET} {source_root}")
    print(f"{BOLD}Into project{RESET} {project_root}\n")

    if args.mcp_only:
        pull_mcp(manifest, source_root, project_root)
        return

    total = 0
    total += pull_skills(manifest, source_root, project_root, args.force)
    total += pull_files(
        "cmd", vendor.get("commands", {}), source_root, project_root, "commands", args.force
    )
    total += pull_files(
        "agent", vendor.get("agents", {}), source_root, project_root, "agents", args.force
    )
    total += pull_mcp(manifest, source_root, project_root)

    print(f"\n{BOLD}Done.{RESET} {total} item(s) updated.")


# ---------------------------------------------------------------------------
# Push
# ---------------------------------------------------------------------------


def push_skills(manifest: dict, source_root: Path, project_root: Path) -> int:
    """Push modified vendored skills back to wookstar. Returns count of pushed items."""
    skills = manifest.get("vendor", {}).get("skills", {})
    if not skills:
        return 0

    count = 0
    for name, source_rel in skills.items():
        dst_skill = project_root / ".claude" / "skills" / name
        marker_path = dst_skill / VENDORED_MARKER

        if not marker_path.is_file():
            continue

        marker = json.loads(marker_path.read_text())
        wookstar_path = source_root / marker["source_path"]

        if not wookstar_path.is_dir():
            print(f"  {YELLOW}SKIP{RESET}  skill/{name} - wookstar path missing: {wookstar_path}")
            continue

        proj_mtime = newest_mtime(dst_skill)
        wook_mtime = newest_mtime(wookstar_path)

        if wook_mtime >= proj_mtime:
            print(f"  {DIM}SKIP{RESET}  skill/{name} - wookstar is same or newer")
            continue

        # Push files that exist in BOTH locations (skip project-only files)
        pushed_files = 0
        for wook_file in wookstar_path.rglob("*"):
            if not wook_file.is_file():
                continue
            rel = wook_file.relative_to(wookstar_path)
            proj_file = dst_skill / rel

            if proj_file.is_file():
                shutil.copy2(proj_file, wook_file)
                pushed_files += 1

        # Also push new files from project that don't exist in wookstar
        # (except .vendored.json)
        for proj_file in dst_skill.rglob("*"):
            if not proj_file.is_file():
                continue
            if proj_file.name == VENDORED_MARKER:
                continue
            rel = proj_file.relative_to(dst_skill)
            wook_file = wookstar_path / rel
            if not wook_file.exists():
                wook_file.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(proj_file, wook_file)
                pushed_files += 1

        # Update marker
        marker["synced_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
        marker["source_commit"] = get_git_short_hash(source_root)
        marker_path.write_text(json.dumps(marker, indent=2) + "\n")

        print(f"  {GREEN}PUSH{RESET}  skill/{name} ({pushed_files} files)")
        count += 1

    return count


def push_files(
    category: str,
    items: dict,
    source_root: Path,
    project_root: Path,
    dest_subdir: str,
) -> int:
    """Push vendored command/agent files back to wookstar. Returns count of pushed items."""
    if not items:
        return 0

    count = 0
    for name, source_rel in items.items():
        proj_file = project_root / ".claude" / dest_subdir / f"{name}.md"
        wook_file = source_root / source_rel

        if not proj_file.is_file():
            continue

        content = proj_file.read_text()
        if VENDORED_COMMENT_PREFIX not in content:
            continue

        if not wook_file.is_file():
            print(f"  {YELLOW}SKIP{RESET}  {category}/{name} - wookstar file missing")
            continue

        proj_mtime = proj_file.stat().st_mtime
        wook_mtime = wook_file.stat().st_mtime

        if wook_mtime >= proj_mtime:
            print(f"  {DIM}SKIP{RESET}  {category}/{name} - wookstar is same or newer")
            continue

        # Strip vendored comment header before writing back
        lines = content.split("\n")
        if lines and lines[0].startswith(VENDORED_COMMENT_PREFIX):
            content = "\n".join(lines[1:])
            # Strip leading newline if the header was followed by one
            if content.startswith("\n"):
                content = content[1:]

        wook_file.write_text(content)
        print(f"  {GREEN}PUSH{RESET}  {category}/{name}")
        count += 1

    return count


def cmd_push(args: argparse.Namespace) -> None:
    """Execute the push command."""
    project_root = find_project_root()
    manifest = load_manifest(project_root)
    source_root = resolve_source(manifest)
    vendor = manifest.get("vendor", {})

    print(f"{BOLD}Pushing from{RESET} {project_root}")
    print(f"{BOLD}To wookstar{RESET}  {source_root}\n")

    total = 0
    total += push_skills(manifest, source_root, project_root)
    total += push_files(
        "cmd", vendor.get("commands", {}), source_root, project_root, "commands"
    )
    total += push_files(
        "agent", vendor.get("agents", {}), source_root, project_root, "agents"
    )

    print(f"\n{BOLD}Done.{RESET} {total} item(s) pushed.")


# ---------------------------------------------------------------------------
# Status
# ---------------------------------------------------------------------------


def status_entry(
    kind: str, name: str, proj_path: Path, wook_path: Path
) -> None:
    """Print a single status line comparing project and wookstar paths."""
    proj_exists = proj_path.exists()
    wook_exists = wook_path.exists()

    if not proj_exists and not wook_exists:
        print(f"  {kind:<7} {name:<25} {RED}MISSING both{RESET}")
        return
    if not proj_exists:
        print(f"  {kind:<7} {name:<25} {YELLOW}NOT VENDORED{RESET} (exists in wookstar only)")
        return
    if not wook_exists:
        print(f"  {kind:<7} {name:<25} {YELLOW}ORPHANED{RESET} (wookstar source missing)")
        return

    proj_mtime = newest_mtime(proj_path)
    wook_mtime = newest_mtime(wook_path)

    # Allow a small tolerance (1 second) for filesystem precision
    if abs(proj_mtime - wook_mtime) < 1.0:
        print(f"  {kind:<7} {name:<25} {GREEN}IN SYNC{RESET}")
    elif proj_mtime > wook_mtime:
        print(
            f"  {kind:<7} {name:<25} {YELLOW}project NEWER{RESET} "
            f"(edited {human_age(proj_mtime)}, wookstar {human_age(wook_mtime)})"
        )
    else:
        print(
            f"  {kind:<7} {name:<25} {YELLOW}wookstar NEWER{RESET} "
            f"(wookstar {human_age(wook_mtime)}, project {human_age(proj_mtime)})"
        )


def cmd_status(args: argparse.Namespace) -> None:
    """Execute the status command."""
    project_root = find_project_root()
    manifest = load_manifest(project_root)
    source_root = resolve_source(manifest)
    vendor = manifest.get("vendor", {})

    print(f"{BOLD}Project:{RESET}  {project_root}")
    print(f"{BOLD}Wookstar:{RESET} {source_root}")
    print(f"{BOLD}Commit:{RESET}   {get_git_short_hash(source_root)}\n")

    # Skills
    for name, source_rel in vendor.get("skills", {}).items():
        proj = project_root / ".claude" / "skills" / name
        wook = source_root / source_rel
        status_entry("Skill:", name, proj, wook)

    # Commands
    for name, source_rel in vendor.get("commands", {}).items():
        proj = project_root / ".claude" / "commands" / f"{name}.md"
        wook = source_root / source_rel
        status_entry("Cmd:", name, proj, wook)

    # Agents
    for name, source_rel in vendor.get("agents", {}).items():
        proj = project_root / ".claude" / "agents" / f"{name}.md"
        wook = source_root / source_rel
        status_entry("Agent:", name, proj, wook)

    # MCP servers
    mcp_entries = vendor.get("mcp_servers", [])
    if mcp_entries:
        print()
        mcp_path = project_root / ".mcp.json"
        if mcp_path.is_file():
            try:
                local_servers = json.loads(mcp_path.read_text()).get("mcpServers", {})
                print(f"  {BOLD}MCP:{RESET}    {len(local_servers)} server(s) in .mcp.json")
            except json.JSONDecodeError:
                print(f"  {RED}MCP:{RESET}    .mcp.json is invalid JSON")
        else:
            print(f"  {YELLOW}MCP:{RESET}    .mcp.json not found (run pull --mcp-only)")

        for entry_path in mcp_entries:
            src = source_root / entry_path
            exists = src.is_file()
            label = entry_path.split("/")[-2] if "/" in entry_path else entry_path
            if exists:
                print(f"  {DIM}        {label}: available{RESET}")
            else:
                print(f"  {YELLOW}        {label}: missing from wookstar{RESET}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="wookstar-sync",
        description="Bidirectional sync between projects and wookstar-claude-plugins.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # pull
    pull_parser = subparsers.add_parser("pull", help="Pull from wookstar into project")
    pull_parser.add_argument(
        "--force", action="store_true", help="Overwrite even if project files are newer"
    )
    pull_parser.add_argument(
        "--mcp-only", action="store_true", help="Only regenerate .mcp.json from wookstar sources"
    )

    # push
    subparsers.add_parser("push", help="Push project changes back to wookstar")

    # status
    subparsers.add_parser("status", help="Show sync drift between project and wookstar")

    args = parser.parse_args()

    if args.command == "pull":
        cmd_pull(args)
    elif args.command == "push":
        cmd_push(args)
    elif args.command == "status":
        cmd_status(args)


if __name__ == "__main__":
    main()
