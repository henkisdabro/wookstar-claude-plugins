---
name: git-commit-helper
description: Generate descriptive commit messages by analyzing git diffs. Use when the user asks for help writing commit messages or reviewing staged changes.
user-invocable: false
---

# Git Commit Helper

## Quick start

Analyse staged changes and generate a commit message:

```bash
git diff --staged
```

## Commit message format

Follow conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Example

```
feat(auth): add JWT authentication

Implement JWT-based authentication system with:
- Login endpoint with token generation
- Token validation middleware
- Refresh token support
```

> For more examples (bugfix, refactor, multi-file, breaking changes, scopes), see `references/examples.md`.

## Commit message guidelines

**DO:**

- Use imperative mood ("add feature" not "added feature")
- Keep first line under 50 characters
- Capitalise first letter
- No period at end of summary
- Explain WHY not just WHAT in body

**DON'T:**

- Use vague messages like "update" or "fix stuff"
- Include technical implementation details in summary
- Write paragraphs in summary line
- Use past tense

## Template workflow

1. **Review changes**: `git diff --staged`
2. **Identify type**: Is it feat, fix, refactor, etc.?
3. **Determine scope**: What part of the codebase?
4. **Write summary**: Brief, imperative description
5. **Add body**: Explain why and what impact
6. **Note breaking changes**: If applicable

> For git commands (analysing diffs, interactive staging, amending commits), see `references/git-commands.md`.

## Best practices

1. **Atomic commits** - One logical change per commit
2. **Test before commit** - Ensure code works
3. **Reference issues** - Include issue numbers if applicable
4. **Keep it focused** - Don't mix unrelated changes
5. **Write for humans** - Future you will read this

## Commit message checklist

- [ ] Type is appropriate (feat/fix/docs/etc.)
- [ ] Scope is specific and clear
- [ ] Summary is under 50 characters
- [ ] Summary uses imperative mood
- [ ] Body explains WHY not just WHAT
- [ ] Breaking changes are clearly marked
- [ ] Related issue numbers are included

## References

- `references/examples.md` - Detailed commit message examples (feature, bugfix, refactor, multi-file, breaking changes, scope examples)
- `references/git-commands.md` - Git commands for analysing changes, interactive staging, and amending commits
