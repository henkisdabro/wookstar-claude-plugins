---
name: git-worktrees
description: "Parallel development workflow using git worktrees. Prepare isolated worktree directories and execute tasks across multiple workspaces for concurrent feature development."
---

# Git Worktrees - Parallel Development Workflow

Enable parallel feature development by creating isolated git worktree directories, then executing the same plan across multiple workspaces simultaneously.

## Workflow Overview

### Phase 1: Prepare Worktrees

Create N isolated worktrees for parallel development:

```bash
# Create worktree directory
mkdir -p trees

# Create worktrees (example: 3 parallel workspaces)
git worktree add -b feature-1 ./trees/feature-1
git worktree add -b feature-2 ./trees/feature-2
git worktree add -b feature-3 ./trees/feature-3

# Verify worktrees
git worktree list
```

Each worktree is a complete, isolated copy of the codebase. All worktrees share git history but have independent working directories.

### Phase 2: Execute Tasks in Parallel

Launch N subagents (one per worktree) using the Task tool:

1. Each agent independently implements the plan in their workspace
2. Agents produce RESULTS.md summarising their changes
3. Compare results and cherry-pick the best implementation

**Example Task invocation:**

```
Use the Task tool to launch a general-purpose agent with:
- prompt: "Working in trees/feature-1, implement [plan]. Write a RESULTS.md summarising changes."
- run_in_background: true (for parallel execution)
```

## When to Use

- **Experimental implementations** - Compare different approaches
- **A/B testing code changes** - Try multiple solutions simultaneously
- **Reducing iteration time** - Run multiple attempts in parallel
- **Complex refactoring** - Test different strategies concurrently

## Best Practices

1. **Keep worktree count reasonable** (2-4) to manage cognitive load
2. **Focus on code changes only** - No tests during parallel execution
3. **Clean up worktrees** after selecting the winning implementation:
   ```bash
   git worktree remove ./trees/feature-1
   git worktree prune
   ```
4. **Cherry-pick the winner** to your main branch:
   ```bash
   git cherry-pick feature-2
   # or merge the branch
   git merge feature-2
   ```

## Directory Structure

```
project/
├── trees/
│   ├── feature-1/     # Worktree 1 (full codebase copy)
│   │   └── RESULTS.md
│   ├── feature-2/     # Worktree 2 (full codebase copy)
│   │   └── RESULTS.md
│   └── feature-3/     # Worktree 3 (full codebase copy)
│       └── RESULTS.md
└── (main working directory)
```

## RESULTS.md Template

Each agent should produce a summary in this format:

```markdown
# Results - [Feature Name]

## Changes Made
- List of files modified/created
- Summary of approach taken

## Key Decisions
- Design choices made
- Trade-offs considered

## Testing Notes
- How to verify the implementation
- Known limitations
```
