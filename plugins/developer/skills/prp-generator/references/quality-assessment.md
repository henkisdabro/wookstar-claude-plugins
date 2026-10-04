# Quality Assessment for PRP Generation

Questions for step 4 (stress-test the plan) and the checklist to run before delivering a PRP.

## Stress-test questions

### 1. Integration Analysis

- How does the new feature connect to existing code?
- What existing patterns should be followed?
- Where might conflicts arise?
- What files will need to be created vs modified?

### 2. Implementation Path Planning

- What is the logical order of implementation steps?
- What are the dependencies between steps?
- Where are the potential roadblocks?
- What edge cases need handling?

### 3. Validation Strategy

- What can be validated automatically?
- What requires manual testing?
- How can the implementer verify each step?
- What are the success criteria?

### 4. Context Completeness Check

Ask yourself:

- Could an AI agent implement this without asking questions?
- Are all integration points documented?
- Are all necessary examples included?
- Are gotchas and warnings clearly stated?
- Are validation gates executable?
- Is the implementation path clear and logical?

### 5. Quality Assessment

- Is this PRP comprehensive enough for one-pass implementation?
- What could cause the implementation to fail?
- What additional context would be helpful?
- Are all assumptions documented?

## Quality Checklist

Before delivering the PRP, verify every item:

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
