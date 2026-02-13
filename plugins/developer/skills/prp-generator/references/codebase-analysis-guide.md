# Codebase Analysis Guide

Detailed guidance for Phase 2 of PRP generation. This covers the systematic process of analysing an existing codebase to understand patterns, conventions, and integration points.

## 1. Search for Similar Features

**Goal**: Identify existing implementations that solve similar problems.

Use Grep to search for:

- Similar component names
- Similar functionality keywords
- Similar UI patterns
- Similar API endpoints

Document findings with:

- Exact file paths and line numbers
- Code snippets showing patterns
- Relevance to new feature
- Necessary adaptations

**Example**:

```
Found: User authentication flow in `src/auth/AuthProvider.tsx:23-89`
Pattern: Context provider with useAuth hook
Relevance: Similar state management approach needed for feature X
Adaptation: Will need to add Y and Z properties
```

## 2. Identify Architectural Patterns

Look for:

- Directory structure conventions
- Component organisation patterns
- State management approach
- API structure patterns
- Routing patterns (if applicable)

**Example findings**:

```
Pattern: Feature-based directory structure
Location: src/features/
Application: Create src/features/[new-feature]/ with:
  - components/
  - hooks/
  - types/
  - api/
  - tests/
```

## 3. Document Coding Conventions

Check for:

- TypeScript usage patterns (interfaces vs types, strict mode)
- Component patterns (FC vs function, default vs named exports)
- Styling approach (CSS modules, styled-components, Tailwind)
- Import ordering and organisation
- Function and variable naming
- Comment style

**Example**:

```
Convention: Named exports for all components
Example: export function UserProfile() { ... }
Found in: src/components/*.tsx
Reasoning: Easier refactoring and better IDE support
```

## 4. Study Test Patterns

Investigate:

- Test framework and version
- Test file naming and location
- Mock strategies
- Coverage expectations
- Example test to mirror

**Example documentation**:

```
Framework: Vitest + @testing-library/react
Pattern: Co-located tests with *.test.tsx
Example: src/components/Button/Button.test.tsx
Mock Strategy: Use vi.fn() for functions, MSW for HTTP
Approach: Test user interactions, not implementation details
```

## 5. Check Project Configuration

Review:

- `package.json` for dependencies and scripts
- `tsconfig.json` for TypeScript settings
- Build configuration (vite.config.ts, etc.)
- `.eslintrc` for linting rules
- `.prettierrc` for formatting rules
- Note path aliases and special configurations

**Example documentation**:

```
Build Tool: Vite 5.x
Path Aliases: '@/' -> 'src/', '@components/' -> 'src/components/'
TypeScript: Strict mode enabled
Must use: Import type syntax for type-only imports
```
