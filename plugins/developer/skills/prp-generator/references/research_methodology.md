# Research Methodology for PRP Generation

Search strategies and note templates for step 3 (research externally). For the codebase side of the research, see [codebase-analysis-guide.md](codebase-analysis-guide.md); for the completeness questions and final checklist, see [quality-assessment.md](quality-assessment.md).

Every finding goes into the PRP with an exact URL, the version it applies to, and why it matters - the implementer does not have this conversation.

## External Research Process

### 1. Library Documentation

**When to search**: a library or framework feature new to the project, a third-party service integration, or anything where the installed version may differ from what you remember.

**How to search**:

1. Read the installed version from the project's manifest or lockfile first.
2. Go to the official documentation for that version, not the latest by default.
3. Look for getting-started guides, API references, examples, migration guides and known issues.

**What to document**:

```
Library: <package name>
Version: <exact version from the lockfile>
URL: <docs page for that version>
Key sections:
  - <topic>: <deep link>
  - <topic>: <deep link>
Gotchas:
  - <default behaviour that surprises>
  - <breaking change between the installed version and the latest>
```

### 2. Implementation Examples

**Where to search**:

- GitHub repositories (search: "language:typescript [feature]")
- Official example repositories
- Stack Overflow (recent answers)
- Blog posts from reputable sources

**What to look for**:

- Production-grade code, not quick hacks
- Recent examples - check the date and the library version they target
- Edge case handling

**What to document**:

```
Example: Form validation with Zod and React Hook Form
Source: <URL of the example in the library's own repository>
Relevance: Shows the integration pattern we need
Key takeaway: Use zodResolver for the integration
Caution: Needs the @hookform/resolvers package
```

### 3. Best Practices

**Search queries**:

- "[Technology] best practices [current year]"
- "[Feature] common pitfalls"
- "[Library] performance optimisation"
- "[Pattern] security considerations"

**What to document**:

```
Practice: Input sanitisation for user-generated content
Why: Prevent XSS attacks
How: Sanitise with DOMPurify before rendering HTML
Reference: https://owasp.org/www-community/attacks/xss/
Warning: Never use dangerouslySetInnerHTML without sanitisation
```

### 4. Performance

**Research**: bundle size implications, runtime performance patterns, common optimisation techniques, lazy loading opportunities.

**What to document**:

```
Performance: Large data table rendering
Solution: Virtualise the rows (@tanstack/react-virtual)
Reference: https://tanstack.com/virtual/latest
Benefit: Renders only the visible rows
Trade-off: <bundle size added, measured for the installed version>
```

### 5. Security

**Check**: common vulnerabilities (OWASP Top 10), authentication and authorisation patterns, data validation requirements, secure defaults.

**What to document**:

```
Security: API authentication
Pattern: HTTP-only cookies for tokens
Reference: https://owasp.org/www-community/HttpOnly
Implementation: <where the project sets cookies>
Warning: Do not store tokens in localStorage
```

## Judging sources

- Prefer the vendor's own documentation, changelog and repository over third-party posts.
- When sources disagree, the one matching the installed version wins; record the disagreement as a gotcha.
- Discard anything that targets a deprecated API or an older major version.

## Combining findings with the codebase

1. **Match external patterns to codebase conventions** - "Library X recommends pattern Y, but the codebase uses pattern Z"; document the adaptation.
2. **Identify conflicts or gaps** - "The existing auth pattern does not support OAuth"; document how to extend it.
3. **Plan integration points** - "The new feature connects to [Component] at [path:line]"; document every touch point.
