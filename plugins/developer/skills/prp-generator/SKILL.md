---
name: prp-generator
description: Generate comprehensive Product Requirement Plans (PRPs) for feature implementation with thorough codebase analysis and external research. Use when the user requests a PRP, PRD, or detailed implementation plan for a new feature. Conducts systematic research, identifies patterns, and creates executable validation gates for one-pass implementation success. Do NOT use for client discovery, requirements gathering, or scope definition - use scope-clarifier for those.
context: fork
agent: Plan
---

# PRP Generator

## Overview

Generates comprehensive Product Requirement Plans (PRPs) that enable AI agents to implement features in a single pass. Combines systematic codebase analysis with external research to create detailed, context-rich implementation blueprints.

## When to Use

- User requests a PRP, PRD, or detailed implementation plan
- User asks to "plan out" or "design" a complex feature
- Beginning significant feature development that benefits from structured planning
- User provides a feature description file and asks for implementation guidance

## Core Principle

**Context is Everything**: The implementing agent only receives the PRP content, training data knowledge, codebase access, and WebSearch. Your PRP must be self-contained with all necessary context, specific references, and executable validation gates.

## Workflow

### Phase 1: Understand the Feature

1. **Read the feature request** - if a file path is given, read it completely; if verbal, clarify requirements
2. **Clarify ambiguities** - use AskUserQuestion for unclear requirements, confirm tech stack, verify integration points
3. **Identify the core problem** being solved and acceptance criteria

### Phase 2: Codebase Analysis (Mandatory)

**Goal**: Understand existing patterns, conventions, and integration points.

Systematically analyse the codebase across five dimensions:

| Area | What to Capture |
|------|----------------|
| Similar features | File paths, line numbers, code snippets, adaptations needed |
| Architecture | Directory conventions, component organisation, state management, API patterns |
| Coding conventions | TypeScript usage, component patterns, styling, import ordering, naming |
| Test patterns | Framework, file naming, mock strategies, coverage expectations |
| Configuration | Dependencies, build setup, path aliases, TypeScript settings |

For detailed sub-steps, examples, and documentation templates, see [references/codebase-analysis-guide.md](references/codebase-analysis-guide.md).

Also refer to [references/research_methodology.md](references/research_methodology.md) for the full research process.

### Phase 3: External Research (Mandatory)

**Goal**: Find best practices, documentation, examples, and gotchas.

Research across four areas:

| Area | Key Actions |
|------|------------|
| Library documentation | Find official docs for the SPECIFIC version from package.json; note version-specific gotchas |
| Implementation examples | Search GitHub, StackOverflow, official examples; prefer recent, production-grade code |
| Best practices | Search "[technology] best practices [current year]"; check OWASP for security |
| Performance and security | Bundle size implications, runtime patterns, vulnerabilities, accessibility |

Always document exact URLs, versions, and specific sections. See [references/research_methodology.md](references/research_methodology.md) for detailed guidance.

### Phase 4: Ultra-Thinking (Critical)

**STOP AND THINK DEEPLY BEFORE WRITING THE PRP.**

Analyse integration points, implementation ordering, validation strategy, and context completeness. Verify the PRP will enable one-pass implementation without questions.

For the full set of analysis questions and the quality checklist, see [references/quality-assessment.md](references/quality-assessment.md).

### Phase 5: Generate the PRP

Use [assets/prp_template.md](assets/prp_template.md) as the base structure. Populate all sections:

1. **Metadata** - feature name, timeline, confidence score (1-10), date
2. **Executive Summary** - 2-3 sentences with core value proposition
3. **Research Findings** - codebase analysis (file:line refs) and external research (URLs, versions)
4. **Technical Specification** - architecture, components, data models, API endpoints
5. **Implementation Blueprint** - prerequisites, step-by-step with pseudocode, file changes, error handling, edge cases
6. **Testing Strategy** - unit, integration, and manual testing approaches
7. **Validation Gates** - must be EXECUTABLE commands (e.g. `npm run test && npm run build`)
8. **Success Criteria** - clear, measurable checklist

### Phase 6: Quality Scoring

Score the PRP for one-pass implementation success:

| Score | Meaning |
|-------|---------|
| 9-10 | Exceptionally detailed, all context included, clear path, executable gates |
| 7-8 | Very good, minor gaps, mostly clear implementation path |
| 5-6 | Adequate, some ambiguity, may require clarification |
| 3-4 | Incomplete research, missing context, unclear path |
| 1-2 | Insufficient for implementation |

**If score is below 7**: Go back and improve the PRP before delivering.

### Phase 7: Save and Deliver

1. **Save** the PRP to `PRPs/[feature-name].md` (kebab-case, create directory if needed)
2. **Deliver summary** to user with: brief feature summary, file location, confidence score with rationale, and next steps

## Common Pitfalls

| Pitfall | Bad | Good |
|---------|-----|------|
| Vague references | "There's a similar component somewhere" | "See UserProfile at src/components/UserProfile.tsx:45-67" |
| Missing versions | "Use React Query" | "Use @tanstack/react-query v5.28.0" |
| Non-executable gates | "Run tests and make sure they pass" | `npm run test && npm run build` |
| Generic advice | "Follow React best practices" | "Use named exports (see src/components/Button.tsx:1)" |
| Incomplete research | Skipping codebase analysis | Thoroughly document existing patterns |
| Missing gotchas | Assuming smooth implementation | Document known issues and edge cases |

## Example Usage

**User**: "Create a PRP for adding dark mode support to the application"

1. Clarify: "Should dark mode preference persist across sessions? Should it respect system preferences?"
2. Research codebase for theme-related code
3. Research external resources (dark mode best practices, library options)
4. Ultra-think about implementation approach
5. Generate comprehensive PRP using template
6. Score the PRP
7. Save to `PRPs/dark-mode-support.md`
8. Deliver summary with confidence score

## Resources

| Resource | Description |
|----------|------------|
| [assets/prp_template.md](assets/prp_template.md) | Base template for all PRPs |
| [references/research_methodology.md](references/research_methodology.md) | Detailed research guidance and best practices |
| [references/codebase-analysis-guide.md](references/codebase-analysis-guide.md) | Detailed codebase analysis sub-steps and examples |
| [references/quality-assessment.md](references/quality-assessment.md) | Ultra-thinking analysis questions and quality checklist |

## Key Reminders

- **Research is mandatory** - never skip codebase or external research
- **Be specific** - always include file paths, line numbers, URLs, versions
- **Think deeply** - Phase 4 (Ultra-Thinking) is critical for success
- **Validate everything** - all validation gates must be executable
- **Score honestly** - if confidence is below 7, improve the PRP
- **Context is king** - the implementer only has what you put in the PRP
