# Git Worktrees

Parallel development workflow using git worktrees for Claude Code - prepare isolated worktree directories and execute tasks across multiple workspaces.

## What's Included

### Skills (1)

- **git-worktrees** - Complete guide for parallel development with worktrees

## Installation

```bash
/plugin install git-worktrees@wookstar-claude-plugins
```

## Use Case

When you want to try multiple approaches to implementing a feature simultaneously:

1. Create isolated worktrees (each with a full codebase copy)
2. Launch parallel Claude agents (one per worktree)
3. Compare results and select the best implementation

## Usage Examples

```bash
# Prepare parallel workspaces
"Set up 3 git worktrees for parallel feature development"

# Execute in parallel
"Run the authentication refactor plan across all worktrees"

# Compare and select
"Compare the RESULTS.md files from each worktree"
```

## Workflow

### 1. Prepare Worktrees

```bash
mkdir -p trees
git worktree add -b feature-1 ./trees/feature-1
git worktree add -b feature-2 ./trees/feature-2
git worktree list
```

### 2. Execute in Parallel

Use the Task tool to launch agents that work in each worktree directory.

### 3. Cleanup

```bash
git worktree remove ./trees/feature-1
git worktree remove ./trees/feature-2
git worktree prune
```

## When to Use

- Comparing different implementation approaches
- A/B testing code changes
- Complex refactoring with multiple strategies
- Reducing iteration time on experimental features
