# Research Methodology for PRP Generation

This document provides detailed guidance on conducting thorough research for creating comprehensive Product Requirement Plans.

## Research Philosophy

The AI agent implementing the PRP only receives:
1. The context you include in the PRP
2. Their training data knowledge
3. Access to the codebase
4. WebSearch capabilities

Therefore, your research findings MUST be:
- **Comprehensive**: Cover all aspects of implementation
- **Specific**: Include exact URLs, file paths, line numbers
- **Actionable**: Provide concrete examples and patterns
- **Complete**: Assume the implementer won't have your conversation context

## Codebase Analysis Process

### 1. Find Similar Features

**Goal**: Identify existing implementations that solve similar problems

**Approach**:
```bash
# Search for similar feature keywords
# Use Grep tool with relevant patterns

# Look for:
- Similar UI components
- Similar API endpoints
- Similar data models
- Similar business logic
```

**What to Document**:
- Exact file paths with line numbers (e.g., `src/components/UserProfile.tsx:45-67`)
- Code snippets showing the pattern
- Why this pattern is relevant
- Any modifications needed

**Example**:
```
Found: User authentication flow in `src/auth/AuthProvider.tsx:23-89`
Pattern: Context provider with useAuth hook
Relevance: Similar state management approach needed for feature X
Adaptation: Will need to add Y and Z properties
```

### 2. Identify Architectural Patterns

**Goal**: Understand how the codebase is structured

**Look for**:
- Directory structure conventions
- File naming patterns
- Component organization
- State management approach (Redux, Context, Zustand, etc.)
- API structure patterns
- Database access patterns
- Error handling patterns

**What to Document**:
```
Pattern: Feature-based directory structure
Example: src/features/authentication/
Application: Create src/features/[new-feature]/ with:
  - components/
  - hooks/
  - types/
  - api/
  - tests/
```

### 3. Analyze Coding Conventions

**Goal**: Ensure consistency with existing codebase

**Check**:
- TypeScript usage (strict mode? interfaces vs types?)
- Component patterns (FC vs function? default vs named exports?)
- Styling approach (CSS modules, styled-components, Tailwind?)
- Import ordering
- Comment style
- Function naming (camelCase, descriptive names)

**What to Document**:
```
Convention: Named exports for all components
Example: export function UserProfile() { ... }
Reasoning: Easier refactoring and better IDE support
```

### 4. Study Test Patterns

**Goal**: Write tests that match existing patterns

**Investigate**:
- Test framework (Jest, Vitest, etc.)
- Testing library usage (@testing-library/react?)
- Test file naming (`*.test.ts` or `*.spec.ts`?)
- Test organization (co-located or separate test directory?)
- Mock patterns
- Test coverage expectations

**What to Document**:
```
Pattern: Co-located tests with *.test.tsx suffix
Framework: Vitest + @testing-library/react
Example: src/components/Button.test.tsx
Approach: Test user interactions, not implementation details
Mock Strategy: Use vi.fn() for callbacks, MSW for API calls
```

### 5. Check Configuration Files

**Goal**: Understand build, lint, and tooling setup

**Review**:
- `package.json` - scripts and dependencies
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` or `webpack.config.js` - build setup
- `.eslintrc` - linting rules
- `.prettierrc` - formatting rules

**What to Document**:
```
TypeScript: Strict mode enabled
Build: Vite with React plugin
Path Aliases: '@/' maps to 'src/'
Must use: Import type syntax for type-only imports
```

## External Research Process

### 1. Library Documentation

**When to Search**:
- Using a new library or framework feature
- Integrating third-party services
- Implementing complex functionality

**How to Search**:
1. Go directly to official documentation
2. Search for the specific version being used
3. Look for:
   - Getting started guides
   - API references
   - Examples
   - Migration guides
   - Known issues

**What to Document**:
```
Library: @tanstack/react-query v5
URL: https://tanstack.com/query/latest/docs/react/guides/queries
Key Sections:
  - Queries: https://tanstack.com/query/latest/docs/react/guides/queries
  - Mutations: https://tanstack.com/query/latest/docs/react/guides/mutations
Version: 5.28.0 (check package.json)
Gotchas:
  - Query keys must be arrays
  - Automatic refetching on window focus (may want to disable)
  - Stale time defaults to 0
```

### 2. Implementation Examples

**Where to Search**:
- GitHub repositories (search: "language:typescript [feature]")
- StackOverflow (recent answers)
- Official example repositories
- Blog posts from reputable sources

**What to Look For**:
- Production-grade code (not quick hacks)
- Recent examples (check dates)
- Well-explained implementations
- Edge case handling

**What to Document**:
```
Example: Form validation with Zod and React Hook Form
Source: https://github.com/react-hook-form/react-hook-form/tree/master/examples/V7/zodResolver
Relevance: Shows integration pattern we need
Key Takeaway: Use zodResolver for seamless integration
Caution: Needs @hookform/resolvers package
```

### 3. Best Practices Research

**Search Queries**:
- "[Technology] best practices 2024"
- "[Feature] common pitfalls"
- "[Library] performance optimization"
- "[Pattern] security considerations"

**What to Document**:
```
Practice: Input sanitization for user-generated content
Why: Prevent XSS attacks
How: Use DOMPurify library before rendering HTML
Reference: https://owasp.org/www-community/attacks/xss/
Warning: Never use dangerouslySetInnerHTML without sanitization
```

### 4. Performance Considerations

**Research**:
- Bundle size implications
- Runtime performance patterns
- Common optimization techniques
- Lazy loading opportunities

**What to Document**:
```
Performance: Large data table rendering
Solution: Use virtualization (@tanstack/react-virtual)
Reference: https://tanstack.com/virtual/latest
Benefit: Render only visible rows (handles 100k+ items)
Tradeoff: Adds 15KB to bundle
```

### 5. Security Research

**Check**:
- Common vulnerabilities (OWASP Top 10)
- Authentication/authorization patterns
- Data validation requirements
- Secure defaults

**What to Document**:
```
Security: API authentication
Pattern: Use HTTP-only cookies for tokens
Reference: https://owasp.org/www-community/HttpOnly
Implementation: Configure in Cloudflare Workers
Warning: Don't store tokens in localStorage
```

## Combining Research Findings

### Integration Analysis

After completing both codebase and external research:

1. **Match external patterns to codebase conventions**
   - "Library X recommends pattern Y, but codebase uses pattern Z"
   - Document adaptations needed

2. **Identify conflicts or gaps**
   - "Existing auth pattern doesn't support OAuth"
   - Document how to extend existing patterns

3. **Plan integration points**
   - "New feature will integrate with existing [Component] at [Location]"
   - Document all touch points

### Context Completeness Check

Before finalizing research, verify:

- [ ] Can implementer understand the codebase structure from your findings?
- [ ] Are all external dependencies documented with versions and URLs?
- [ ] Are code examples specific enough to follow?
- [ ] Are gotchas and warnings clearly stated?
- [ ] Are all integration points identified?
- [ ] Can implementer validate their work with the gates you've defined?

## Research Output Format

Organize findings into these categories for the PRP:

1. **Codebase Analysis**
   - Similar patterns (with file:line references)
   - Existing conventions (with examples)
   - Test patterns (with framework details)

2. **External Research**
   - Documentation references (with specific URLs and sections)
   - Implementation examples (with source links and relevance)
   - Best practices (with rationale and warnings)

3. **Integration Points**
   - Where new code connects to existing code
   - What patterns to follow
   - What conventions to maintain

## Common Research Pitfalls to Avoid

1. **Vague references**: "There's a similar component somewhere" ❌
   - Should be: "See UserProfile component at src/components/UserProfile.tsx:45" ✅

2. **Outdated examples**: Linking to old blog posts or deprecated APIs ❌
   - Should be: Check dates, verify current best practices ✅

3. **Missing version info**: "Use React Query" ❌
   - Should be: "Use @tanstack/react-query v5.28.0" ✅

4. **No gotchas**: Assuming smooth implementation ❌
   - Should be: Document known issues, common mistakes, edge cases ✅

5. **Too generic**: "Follow React best practices" ❌
   - Should be: Specific patterns with code examples ✅

## Research Time Allocation

**Codebase Analysis**: 40% of research time
- Critical for maintaining consistency
- Most valuable for implementation

**External Research**: 35% of research time
- Essential for new technologies
- Validation of approaches

**Integration Planning**: 15% of research time
- Connecting the dots
- Identifying conflicts

**Documentation**: 10% of research time
- Organizing findings
- Creating clear references

## Quality Indicators

Your research is complete when:
- ✅ An implementer could start coding immediately
- ✅ All necessary context is documented
- ✅ Integration points are clear
- ✅ Validation approach is defined
- ✅ Edge cases are identified
- ✅ Error handling strategy is outlined
- ✅ No assumptions are left undocumented
