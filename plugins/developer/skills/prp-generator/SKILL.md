---
name: prp-generator
description: Generate comprehensive Product Requirement Plans (PRPs) for feature implementation with thorough codebase analysis and external research. Use when the user requests a PRP, PRD, or detailed implementation plan for a new feature. Conducts systematic research, identifies patterns, and creates executable validation gates for one-pass implementation success.
context: fork
agent: Plan
---

# PRP Generator

## Overview

This skill generates comprehensive Product Requirement Plans (PRPs) that enable AI agents to implement features in a single pass with high success rates. The skill combines systematic codebase analysis with external research to create detailed, context-rich implementation blueprints.

## When to Use This Skill

Invoke this skill when:
- User requests a PRP or PRD (Product Requirement Plan/Document)
- User wants a detailed implementation plan for a new feature
- User asks to "plan out" or "design" a complex feature
- Beginning a significant feature development that would benefit from structured planning
- User provides a feature description file and asks for implementation guidance

## Core Principle

**Context is Everything**: The AI agent implementing your PRP only receives:
1. The PRP content you create
2. Training data knowledge
3. Access to the codebase
4. WebSearch capabilities

Therefore, your PRP must be self-contained with all necessary context, specific references, and executable validation gates.

## Workflow

### Phase 1: Understanding the Feature

1. **Read the Feature Request**
   - If user provides a feature file path, read it completely
   - If user provides verbal description, clarify requirements by asking:
     - What is the user trying to accomplish?
     - What are the acceptance criteria?
     - Are there any specific constraints or requirements?
   - Identify the core problem being solved

2. **Clarify Ambiguities**
   - Use AskUserQuestion tool for any unclear requirements
   - Confirm technology stack assumptions
   - Verify integration points
   - Ask about specific patterns to follow if not obvious

### Phase 2: Codebase Analysis (Mandatory)

**Goal**: Understand existing patterns, conventions, and integration points

Refer to `references/research_methodology.md` for detailed guidance, but the core steps are:

1. **Search for Similar Features**
   ```
   Use Grep to search for:
   - Similar component names
   - Similar functionality keywords
   - Similar UI patterns
   - Similar API endpoints
   ```

   Document findings with:
   - Exact file paths and line numbers
   - Code snippets showing patterns
   - Relevance to new feature
   - Necessary adaptations

2. **Identify Architectural Patterns**
   - Directory structure conventions
   - Component organization patterns
   - State management approach
   - API structure patterns
   - Routing patterns (if applicable)

   Example findings:
   ```
   Pattern: Feature-based directory structure
   Location: src/features/
   Application: Create src/features/[new-feature]/
   ```

3. **Document Coding Conventions**
   - TypeScript usage patterns (interfaces vs types, strict mode)
   - Component patterns (FC vs function, default vs named exports)
   - Styling approach (CSS modules, styled-components, Tailwind)
   - Import ordering and organization
   - Function and variable naming
   - Comment style

   Example:
   ```
   Convention: Named exports for all components
   Example: export function UserProfile() { ... }
   Found in: src/components/*.tsx
   ```

4. **Study Test Patterns**
   - Test framework and version
   - Test file naming and location
   - Mock strategies
   - Coverage expectations
   - Example test to mirror

   Document:
   ```
   Framework: Vitest + @testing-library/react
   Pattern: Co-located tests with *.test.tsx
   Example: src/components/Button/Button.test.tsx
   Mock Strategy: Use vi.fn() for functions, MSW for HTTP
   ```

5. **Check Project Configuration**
   - Review `package.json` for dependencies and scripts
   - Check `tsconfig.json` for TypeScript settings
   - Review build configuration (vite.config.ts, etc.)
   - Note path aliases and special configurations

   Document:
   ```
   Build Tool: Vite 5.x
   Path Aliases: '@/' → 'src/', '@components/' → 'src/components/'
   TypeScript: Strict mode enabled
   ```

### Phase 3: External Research (Mandatory)

**Goal**: Find best practices, documentation, examples, and gotchas

Refer to `references/research_methodology.md` for detailed guidance, but the core steps are:

1. **Search for Library Documentation**
   - Go to official documentation for any libraries being used
   - Find the SPECIFIC version in package.json
   - Document exact URLs to relevant sections
   - Note version-specific features or changes

   Example output:
   ```
   Library: @tanstack/react-query
   Version: 5.28.0 (from package.json)
   Docs: https://tanstack.com/query/latest/docs/react/overview
   Key Sections:
     - Queries: https://tanstack.com/query/latest/docs/react/guides/queries
     - Mutations: https://tanstack.com/query/latest/docs/react/guides/mutations
   Gotchas:
     - Query keys must be arrays
     - Automatic refetching on window focus
     - Default staleTime is 0
   ```

2. **Find Implementation Examples**
   - Search GitHub for similar implementations
   - Look for StackOverflow solutions (recent, highly-voted)
   - Find blog posts from reputable sources
   - Check official example repositories

   Document:
   ```
   Example: Form validation with React Hook Form + Zod
   Source: https://github.com/react-hook-form/react-hook-form/tree/master/examples/V7/zodResolver
   Relevance: Shows exact integration pattern needed
   Key Takeaway: Use zodResolver from @hookform/resolvers
   ```

3. **Research Best Practices**
   - Search for "[technology] best practices [current year]"
   - Look for common pitfalls and gotchas
   - Research performance considerations
   - Check security implications (OWASP guidelines)

   Document:
   ```
   Practice: Input sanitization for user content
   Why: Prevent XSS attacks
   How: Use DOMPurify before rendering HTML
   Reference: https://owasp.org/www-community/attacks/xss/
   Warning: NEVER use dangerouslySetInnerHTML without sanitization
   ```

4. **Performance & Security Research**
   - Bundle size implications of new dependencies
   - Runtime performance patterns
   - Security vulnerabilities to avoid
   - Accessibility considerations

   Document specific URLs and recommendations

### Phase 4: Ultra-Thinking (Critical)

**STOP AND THINK DEEPLY BEFORE WRITING THE PRP**

This is the most important phase. Spend significant time analyzing:

1. **Integration Analysis**
   - How does the new feature connect to existing code?
   - What existing patterns should be followed?
   - Where might conflicts arise?
   - What files will need to be created vs modified?

2. **Implementation Path Planning**
   - What is the logical order of implementation steps?
   - What are the dependencies between steps?
   - Where are the potential roadblocks?
   - What edge cases need handling?

3. **Validation Strategy**
   - What can be validated automatically?
   - What requires manual testing?
   - How can the implementer verify each step?
   - What are the success criteria?

4. **Context Completeness Check**
   Ask yourself:
   - Could an AI agent implement this without asking questions?
   - Are all integration points documented?
   - Are all necessary examples included?
   - Are gotchas and warnings clearly stated?
   - Are validation gates executable?
   - Is the implementation path clear and logical?

5. **Quality Assessment**
   - Is this PRP comprehensive enough for one-pass implementation?
   - What could cause the implementation to fail?
   - What additional context would be helpful?
   - Are all assumptions documented?

### Phase 5: Generate the PRP

Use the template from `assets/prp_template.md` as the base structure, and populate it with:

1. **Metadata Section**
   - Feature name
   - Timeline estimate
   - Confidence score (1-10)
   - Creation date

2. **Executive Summary**
   - 2-3 sentences describing the feature
   - Core value proposition

3. **Research Findings**
   - Codebase analysis results (with file:line references)
   - External research (with specific URLs and sections)
   - Document EVERYTHING discovered in Phase 2 and 3

4. **Technical Specification**
   - Architecture overview
   - Component breakdown
   - Data models
   - API endpoints (if applicable)

5. **Implementation Blueprint**
   - Prerequisites
   - Step-by-step implementation (with pseudocode)
   - File-by-file changes
   - Reference patterns from codebase
   - Error handling strategy
   - Edge cases

6. **Testing Strategy**
   - Unit test approach
   - Integration test approach
   - Manual testing checklist

7. **Validation Gates**
   Must be EXECUTABLE commands:
   ```bash
   # Type checking
   npm run type-check

   # Linting
   npm run lint

   # Tests
   npm run test

   # Build
   npm run build
   ```

8. **Success Criteria**
   - Clear, measurable completion criteria
   - Checklist format

### Phase 6: Quality Scoring

Score the PRP on a scale of 1-10 for one-pass implementation success:

**Scoring Criteria**:
- **9-10**: Exceptionally detailed, all context included, clear path, executable gates
- **7-8**: Very good, minor gaps, mostly clear implementation path
- **5-6**: Adequate, some ambiguity, may require clarification
- **3-4**: Incomplete research, missing context, unclear path
- **1-2**: Insufficient for implementation

**If score is below 7**: Go back and improve the PRP before delivering it.

### Phase 7: Save and Deliver

1. **Determine Feature Name**
   - Use kebab-case
   - Be descriptive but concise
   - Example: "user-authentication", "dark-mode-toggle", "data-export"

2. **Save the PRP**
   ```
   Save to: PRPs/[feature-name].md
   ```

   If PRPs directory doesn't exist, create it:
   ```bash
   mkdir -p PRPs
   ```

3. **Deliver Summary to User**
   Provide:
   - Brief summary of the feature
   - Location of saved PRP
   - Confidence score and rationale
   - Next steps recommendation

## Quality Checklist

Before delivering the PRP, verify:

- [ ] Feature requirements fully understood
- [ ] Codebase analysis completed with specific file references
- [ ] External research completed with URLs and versions
- [ ] All similar patterns identified and documented
- [ ] Coding conventions documented
- [ ] Test patterns identified
- [ ] Implementation steps clearly defined
- [ ] Validation gates are executable (not pseudo-code)
- [ ] Error handling strategy documented
- [ ] Edge cases identified
- [ ] Success criteria defined
- [ ] Confidence score 7+ (if not, improve the PRP)
- [ ] No assumptions left undocumented
- [ ] Integration points clearly identified
- [ ] PRP saved to correct location

## Common Pitfalls to Avoid

1. **Vague References**
   - ❌ "There's a similar component somewhere"
   - ✅ "See UserProfile at src/components/UserProfile.tsx:45-67"

2. **Missing Version Information**
   - ❌ "Use React Query"
   - ✅ "Use @tanstack/react-query v5.28.0"

3. **Non-Executable Validation Gates**
   - ❌ "Run tests and make sure they pass"
   - ✅ "npm run test && npm run build"

4. **Generic Best Practices**
   - ❌ "Follow React best practices"
   - ✅ "Use named exports (see src/components/Button.tsx:1)"

5. **Incomplete Research**
   - ❌ Skipping codebase analysis
   - ✅ Thoroughly document existing patterns

6. **Missing Gotchas**
   - ❌ Assuming smooth implementation
   - ✅ Document known issues and edge cases

## Example Usage

**User Request**:
> "Create a PRP for adding dark mode support to the application"

**Your Response**:
1. Clarify: "Should dark mode preference persist across sessions? Should it respect system preferences?"
2. Research codebase for theme-related code
3. Research external resources (dark mode best practices, library options)
4. Ultra-think about implementation approach
5. Generate comprehensive PRP using template
6. Score the PRP
7. Save to `PRPs/dark-mode-support.md`
8. Deliver summary with confidence score

## Resources

### Template
- `assets/prp_template.md` - Base template for all PRPs

### References
- `references/research_methodology.md` - Detailed research guidance and best practices

## Notes

- **Research is mandatory**: Never skip codebase or external research
- **Be specific**: Always include file paths, line numbers, URLs, versions
- **Think deeply**: Phase 4 (Ultra-Thinking) is critical for success
- **Validate everything**: All validation gates must be executable
- **Score honestly**: If confidence is below 7, improve the PRP
- **Context is king**: The implementer only has what you put in the PRP
