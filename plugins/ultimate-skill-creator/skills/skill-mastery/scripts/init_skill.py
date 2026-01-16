#!/usr/bin/env python3
"""
Skill Initialiser - Creates a new skill from template

Usage:
    python init_skill.py <skill-name> --path <path>

Examples:
    python init_skill.py my-new-skill --path ~/.claude/skills
    python init_skill.py api-helper --path .claude/skills
    python init_skill.py custom-skill --path /custom/location
"""

import sys
from pathlib import Path


SKILL_TEMPLATE = """---
name: {skill_name}
description: >-
  [TODO: What it does - actions, capabilities].
  Use when [TODO: trigger phrases, contexts, file types, user intents].
---

# {skill_title}

[TODO: Brief overview - 1-2 sentences explaining what this skill enables]

## Quick Start

[TODO: Most common use case with minimal setup]

## [TODO: Main Section Based on Archetype]

Choose structure based on archetype:
- **CLI Reference**: Commands grouped by function, minimal prose
- **Methodology**: Philosophy + THE EXACT PROMPT + examples
- **Safety Tool**: Threat model + risk tiers + rules
- **Orchestration**: Quick start + robot mode APIs

See skill-mastery references for archetype templates.

## Resources

### scripts/
Executable code for deterministic operations. Run without loading into context.

### references/
Documentation loaded on-demand. Keep SKILL.md lean, detail goes here.

### assets/
Files used in output (templates, images). Not loaded into context.

---

Delete unused directories. Not every skill needs all resource types.
"""

EXAMPLE_SCRIPT = '''#!/usr/bin/env python3
"""
Example helper script for {skill_name}

Replace with actual implementation or delete if not needed.
"""

def main():
    print("Example script for {skill_name}")
    # TODO: Add actual logic

if __name__ == "__main__":
    main()
'''

EXAMPLE_REFERENCE = """# Reference Documentation for {skill_title}

Replace with actual reference content or delete if not needed.

## When to Use References

- Comprehensive API documentation
- Detailed workflow guides
- Complex multi-step processes
- Information too lengthy for main SKILL.md
- Content only needed for specific use cases

Keep references ONE level deep from SKILL.md.
"""


def title_case_skill_name(skill_name: str) -> str:
    """Convert hyphenated skill name to Title Case."""
    return ' '.join(word.capitalize() for word in skill_name.split('-'))


def validate_skill_name(name: str) -> tuple[bool, str]:
    """Validate skill name follows conventions."""
    import re

    if len(name) > 64:
        return False, f"Name '{name}' exceeds 64 character limit"

    if not re.match(r'^[a-z0-9-]+$', name):
        return False, f"Name '{name}' must be lowercase letters, digits, and hyphens only"

    if name.startswith('-') or name.endswith('-'):
        return False, f"Name '{name}' cannot start or end with hyphen"

    if '--' in name:
        return False, f"Name '{name}' cannot contain consecutive hyphens"

    if 'anthropic' in name.lower() or 'claude' in name.lower():
        return False, f"Name '{name}' cannot contain 'anthropic' or 'claude'"

    return True, "Valid"


def init_skill(skill_name: str, path: str) -> Path | None:
    """
    Initialise a new skill directory with template SKILL.md.

    Args:
        skill_name: Name of the skill (hyphen-case)
        path: Path where the skill directory should be created

    Returns:
        Path to created skill directory, or None if error
    """
    # Validate name
    valid, message = validate_skill_name(skill_name)
    if not valid:
        print(f"Error: {message}")
        return None

    # Determine skill directory path
    skill_dir = Path(path).expanduser().resolve() / skill_name

    # Check if directory already exists
    if skill_dir.exists():
        print(f"Error: Skill directory already exists: {skill_dir}")
        return None

    # Create skill directory
    try:
        skill_dir.mkdir(parents=True, exist_ok=False)
        print(f"Created skill directory: {skill_dir}")
    except Exception as e:
        print(f"Error creating directory: {e}")
        return None

    # Create SKILL.md from template
    skill_title = title_case_skill_name(skill_name)
    skill_content = SKILL_TEMPLATE.format(
        skill_name=skill_name,
        skill_title=skill_title
    )

    skill_md_path = skill_dir / 'SKILL.md'
    try:
        skill_md_path.write_text(skill_content)
        print("Created SKILL.md")
    except Exception as e:
        print(f"Error creating SKILL.md: {e}")
        return None

    # Create resource directories with example files
    try:
        # Create scripts/ directory with example script
        scripts_dir = skill_dir / 'scripts'
        scripts_dir.mkdir(exist_ok=True)
        example_script = scripts_dir / 'example.py'
        example_script.write_text(EXAMPLE_SCRIPT.format(skill_name=skill_name))
        example_script.chmod(0o755)
        print("Created scripts/example.py")

        # Create references/ directory with example reference doc
        references_dir = skill_dir / 'references'
        references_dir.mkdir(exist_ok=True)
        example_reference = references_dir / 'reference.md'
        example_reference.write_text(EXAMPLE_REFERENCE.format(skill_title=skill_title))
        print("Created references/reference.md")

        # Create assets/ directory (empty, with .gitkeep)
        assets_dir = skill_dir / 'assets'
        assets_dir.mkdir(exist_ok=True)
        gitkeep = assets_dir / '.gitkeep'
        gitkeep.write_text('')
        print("Created assets/")
    except Exception as e:
        print(f"Error creating resource directories: {e}")
        return None

    # Print summary
    print(f"\nSkill '{skill_name}' initialised at {skill_dir}")
    print("\nNext steps:")
    print("1. Edit SKILL.md - complete TODO items and description")
    print("2. Choose archetype (CLI, Methodology, Safety, Orchestration)")
    print("3. Customise or delete example files in scripts/, references/, assets/")
    print("4. Validate with plugin-dev's skill-reviewer agent")

    return skill_dir


def main():
    if len(sys.argv) < 4 or sys.argv[2] != '--path':
        print("Usage: python init_skill.py <skill-name> --path <path>")
        print("\nSkill name requirements:")
        print("  - Lowercase letters, digits, and hyphens only")
        print("  - Max 64 characters")
        print("  - No 'anthropic' or 'claude' in name")
        print("\nExamples:")
        print("  python init_skill.py my-new-skill --path ~/.claude/skills")
        print("  python init_skill.py api-helper --path .claude/skills")
        sys.exit(1)

    skill_name = sys.argv[1]
    path = sys.argv[3]

    print(f"Initialising skill: {skill_name}")
    print(f"Location: {path}\n")

    result = init_skill(skill_name, path)
    sys.exit(0 if result else 1)


if __name__ == "__main__":
    main()
