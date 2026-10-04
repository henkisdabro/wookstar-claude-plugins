---
name: prp-generator
description: Writes a Product Requirement Plan (PRP) - a researched, self-contained implementation blueprint with executable validation gates, saved to PRPs/. Use when the user asks for a PRP or PRD, wants an implementation plan for a feature, says "plan out" or "spec out" a feature before coding, hands over a feature description file to turn into a plan, wants a one-pass implementation brief for another agent, or wants an existing plan researched and tightened. Do NOT use for client discovery, requirements gathering or scope definition - run a clarification pass first; do NOT use for implementing an existing PRP - use /execute-prp; do NOT use for cloud-native architecture review - use fifteen-factor-app.
---

# PRP Generator

The implementing agent receives only the PRP, its training data, the codebase and web search - not this conversation. Everything it needs to finish in one pass goes into the PRP: file paths with line numbers, documentation URLs with versions, gotchas, and validation gates it can run.

## 1. Understand the feature

Read the feature request in full (the file, if a path was given). Ask the user about anything unclear with AskUserQuestion: tech stack, integration points, persistence, acceptance criteria.

Done when you can state the problem and its acceptance criteria in two sentences the user has not contradicted.

## 2. Analyse the codebase

Capture each of these, with `path:line` references:

| Area | What to capture |
|------|----------------|
| Similar features | File paths, line ranges, snippets, adaptations needed |
| Architecture | Directory conventions, component organisation, state management, API patterns |
| Coding conventions | Language idioms, component patterns, styling, import ordering, naming |
| Test patterns | Framework, file naming, mock strategy, coverage expectations |
| Configuration | Dependencies and their installed versions, build setup, path aliases |

Sub-steps and documentation templates: [references/codebase-analysis-guide.md](references/codebase-analysis-guide.md).

Done when every row has at least one concrete reference, or a note that the codebase has nothing relevant.

## 3. Research externally

| Area | Key actions |
|------|------------|
| Library documentation | Official docs for the version installed in the project; version-specific gotchas |
| Implementation examples | GitHub, official examples, recent production code |
| Best practices | Current guidance for the stack; OWASP for anything security-touching |
| Performance and security | Bundle size, runtime cost, known vulnerabilities, accessibility |

Search strategies and how to judge sources: [references/research_methodology.md](references/research_methodology.md).

Done when each library the feature touches has a documentation URL and version recorded.

## 4. Stress-test the plan

Before writing, work through integration points, step ordering, validation strategy and context completeness using the questions in [references/quality-assessment.md](references/quality-assessment.md).

Done when you can answer "could an agent implement this without asking a question?" with yes, or you have gone back to steps 1-3 to close the gap.

## 5. Write the PRP

Fill [assets/prp_template.md](assets/prp_template.md). Every section is populated or removed with a reason; in particular:

- **Research Findings** - `path:line` references and URLs with versions from steps 2-3.
- **Implementation Blueprint** - ordered steps with pseudocode, files to create or modify, error handling, edge cases.
- **Validation Gates** - commands that run as written, using the project's real scripts (e.g. `pnpm test && pnpm build`).
- **Success Criteria** - measurable checklist items.

Done when no `[placeholder]` text remains in the file.

## 6. Score

| Score | Meaning |
|-------|---------|
| 9-10 | All context included, clear path, executable gates |
| 7-8 | Minor gaps, mostly clear path |
| 5-6 | Some ambiguity, implementer may need to ask |
| 3-4 | Incomplete research, unclear path |
| 1-2 | Not implementable |

Done when the score is 7 or higher - below that, return to the weakest step and improve the PRP.

## 7. Save and hand off

Save to `PRPs/<feature-name>.md` (kebab-case; create the directory if needed). Tell the user the path, the confidence score with its rationale, and that `/execute-prp PRPs/<feature-name>.md` implements it.

## Common pitfalls

| Pitfall | Weak | Strong |
|---------|-----|------|
| Vague references | "There's a similar component somewhere" | "See UserProfile at src/components/UserProfile.tsx:45-67" |
| Missing versions | "Use React Query" | "Use @tanstack/react-query at the version in package.json (v5)" |
| Non-executable gates | "Run tests and make sure they pass" | `pnpm test && pnpm build` |
| Generic advice | "Follow React best practices" | "Use named exports (see src/components/Button.tsx:1)" |
| Missing gotchas | Assuming a smooth implementation | Known issues and edge cases listed per step |
