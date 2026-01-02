# Product Requirement Plan: [Feature Name]

## Metadata

- **Feature**: [Feature name]
- **Target Completion**: [Timeline estimate]
- **Confidence Score**: [1-10] - Likelihood of one-pass implementation success
- **Created**: [Date]

## Executive Summary

[2-3 sentences describing what this feature does and why it's valuable]

## Research Findings

### Codebase Analysis

#### Similar Patterns Found

[List similar features or patterns discovered in the codebase with file references]

- **Pattern**: [Pattern name]
  - **Location**: `path/to/file.ts:line`
  - **Description**: [What this pattern does]
  - **Relevance**: [Why this is useful for the current feature]

#### Existing Conventions

[List coding conventions, architectural patterns, and style guidelines to follow]

- **Convention**: [Convention name]
  - **Example**: [Code snippet or file reference]
  - **Application**: [How to apply this to the new feature]

#### Test Patterns

[Document existing test patterns and validation approaches]

- **Test Framework**: [Framework name and version]
- **Pattern**: [Test pattern to follow]
- **Location**: `path/to/test.spec.ts`

### External Research

#### Documentation References

[List all relevant documentation with specific URLs and sections]

- **Resource**: [Library/Framework name]
  - **URL**: [Specific URL to docs]
  - **Key Sections**: [Relevant sections to read]
  - **Version**: [Specific version]
  - **Gotchas**: [Known issues or quirks]

#### Implementation Examples

[List real-world examples and references]

- **Example**: [Title/Description]
  - **Source**: [GitHub/StackOverflow/Blog URL]
  - **Relevance**: [What to learn from this]
  - **Cautions**: [What to avoid]

#### Best Practices

[Document industry best practices and common pitfalls]

- **Practice**: [Best practice name]
  - **Why**: [Rationale]
  - **How**: [Implementation approach]
  - **Warning**: [What to avoid]

## Technical Specification

### Architecture Overview

[High-level architecture diagram or description]

```
[ASCII diagram or description of component interactions]
```

### Component Breakdown

#### Component 1: [Name]

- **Purpose**: [What this component does]
- **Location**: `path/to/component`
- **Dependencies**: [List dependencies]
- **Interface**: [API or props interface]

#### Component 2: [Name]

[Repeat for each major component]

### Data Models

[Define all data structures, types, and schemas]

```typescript
// Example: Define interfaces/types
interface FeatureData {
  // ...
}
```

### API Endpoints (if applicable)

[Document any new API endpoints]

- **Endpoint**: `POST /api/feature`
  - **Purpose**: [What it does]
  - **Request**: [Request schema]
  - **Response**: [Response schema]
  - **Authentication**: [Auth requirements]

## Implementation Blueprint

### Prerequisites

[List any setup steps, dependencies to install, or environment configuration needed]

1. [Prerequisite 1]
2. [Prerequisite 2]

### Implementation Steps (in order)

#### Step 1: [Step Name]

**Goal**: [What this step accomplishes]

**Pseudocode Approach**:
```
// High-level pseudocode showing the approach
function stepOne() {
  // ...
}
```

**Files to Create/Modify**:
- `path/to/file1.ts` - [What changes]
- `path/to/file2.ts` - [What changes]

**Reference Pattern**: See `existing/pattern/file.ts:123` for similar implementation

**Validation**: [How to verify this step works]

#### Step 2: [Step Name]

[Repeat for each implementation step]

### Error Handling Strategy

[Document how errors should be handled]

- **Client-side errors**: [Approach]
- **Server-side errors**: [Approach]
- **Validation errors**: [Approach]
- **Network errors**: [Approach]

### Edge Cases

[List all edge cases to handle]

1. **Edge Case**: [Description]
   - **Solution**: [How to handle]

## Testing Strategy

### Unit Tests

[Describe unit test approach]

- **Coverage Target**: [Percentage or scope]
- **Key Test Cases**: [List critical test scenarios]
- **Mock Strategy**: [What to mock and why]

### Integration Tests

[Describe integration test approach]

- **Test Scenarios**: [List integration test cases]
- **Setup Required**: [Test environment setup]

### Manual Testing Checklist

- [ ] [Test scenario 1]
- [ ] [Test scenario 2]
- [ ] [Edge case 1]
- [ ] [Edge case 2]

## Validation Gates

### Pre-Implementation Validation

```bash
# Ensure development environment is ready
[Commands to verify environment setup]
```

### During Implementation Validation

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Unit tests (watch mode during development)
npm run test:watch
```

### Post-Implementation Validation

```bash
# Full test suite
npm run test

# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build

# E2E tests (if applicable)
npm run test:e2e
```

### Manual Validation Steps

1. [Manual test step 1]
2. [Manual test step 2]
3. [Verify in browser/UI]

## Dependencies

### New Dependencies (if any)

```json
{
  "dependencies": {
    "package-name": "^version"
  },
  "devDependencies": {
    "test-package": "^version"
  }
}
```

**Justification**: [Why each dependency is needed]

### Version Compatibility

- **Node**: [Version requirement]
- **Framework**: [Version requirement]
- **Other**: [Version requirements]

## Migration & Rollout

### Database Migrations (if applicable)

[Document any database schema changes]

### Feature Flags (if applicable)

[Document feature flag strategy]

### Rollout Plan

1. [Rollout step 1]
2. [Rollout step 2]

## Success Criteria

- [ ] All validation gates pass
- [ ] All test cases pass (unit, integration, manual)
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Build succeeds
- [ ] Feature works as specified
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] Code follows existing conventions
- [ ] Documentation updated

## Known Limitations

[Document any known limitations or future enhancements]

## References

### Internal Documentation

- [Link to internal docs]

### External Resources

- [Link to external resources used during research]

## Appendix

### Code Snippets from Research

[Include any useful code snippets discovered during research]

```typescript
// Example from existing codebase
```

### Additional Notes

[Any additional context that doesn't fit elsewhere]
