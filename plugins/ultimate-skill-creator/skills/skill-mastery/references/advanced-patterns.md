# Advanced Skill Patterns

Production-tested patterns from real-world skill collections.

## THE EXACT PROMPT Pattern

Encode reproducible prompts for agent-to-agent handoff or automation.

**Why it works:**
- Copy-paste ready (Stream Deck, scripts, macros)
- No ambiguity about phrasing
- Enables cross-model workflows (GPT -> Claude)
- Self-documenting

**Implementation:**
```markdown
## THE EXACT PROMPT - Feature Planning

Carefully review this feature request and create a comprehensive
implementation plan covering:

1. Architecture decisions with trade-offs
2. Files to create/modify with specific changes
3. Testing strategy for each component
4. Potential edge cases and mitigations
5. Dependencies that need updating

Output as a numbered checklist I can track progress against.
Use ultrathink.
```

**Usage in workflows:**
```markdown
## Planning Workflow

1. User describes feature
2. Run THE EXACT PROMPT - Feature Planning
3. Review plan, iterate if needed
4. Run THE EXACT PROMPT - Implementation Start
```

---

## "Why This Exists" Section

Front-load motivation before instructions to help Claude understand context.

**Pattern:**
```markdown
## Why This Exists

[Problem statement - what pain does this solve?]

- **Pain Point 1**: Specific description
- **Pain Point 2**: Specific description
- **Pain Point 3**: Specific description

[Tool name] solves these by [brief solution].
```

**Example:**
```markdown
## Why This Exists

Managing multiple AI coding agents is painful:

- **Window chaos**: Each agent needs its own terminal
- **Context switching**: Jumping between windows breaks flow
- **No orchestration**: Same prompt to multiple agents = manual copy-paste

NTM solves all of this with tmux-based session management and
cross-agent communication protocols.
```

**Why it works:** Claude uses this to determine when the skill is relevant beyond just keyword matching.

---

## Risk Tiering Tables

For safety-critical skills, make risk levels explicit.

**Pattern:**
```markdown
## Risk Classification

| Tier | Human Approval | Auto-approve | Examples |
|------|----------------|--------------|----------|
| **CRITICAL** | 2+ | Never | `rm -rf /`, `DROP DATABASE`, push --force to main |
| **DANGEROUS** | 1 | Never | `git reset --hard`, `DELETE FROM`, deploy to prod |
| **CAUTION** | 0 | After 30s delay | `rm file.txt`, schema migration |
| **SAFE** | 0 | Immediately | `rm *.log`, `git stash`, local dev operations |
```

**Extended pattern with override mechanisms:**
```markdown
## Override Mechanisms

| Tier | Override Flag | Audit |
|------|---------------|-------|
| CRITICAL | Not possible | Full log + notification |
| DANGEROUS | `--i-really-mean-it` | Logged |
| CAUTION | `--yes` | Logged |
| SAFE | None needed | None |
```

---

## Robot Mode / Machine-Readable Output

For orchestration tools, document JSON/NDJSON APIs.

**Pattern:**
```markdown
## Robot Mode (AI Automation)

All commands support `--robot` flag for machine-readable output.

### Status Query
tool --robot-status

**Output:**
{
  "type": "status",
  "sessions": [{"id": "abc", "state": "running"}],
  "timestamp": "2025-01-16T10:30:00Z"
}

### Event Stream
tool --robot-events

**Output (NDJSON):**
{"type": "event", "name": "task_started", "task_id": "123"}
{"type": "event", "name": "task_completed", "task_id": "123", "result": "success"}
```

**Why it works:** Enables AI agents to programmatically interact with tools without parsing human-readable output.

---

## Exit Code Standardisation

Document exit codes for script integration.

**Pattern:**
```markdown
## Exit Codes

| Code | Meaning | Action |
|------|---------|--------|
| `0` | Success | Continue |
| `1` | General error | Check stderr |
| `2` | Invalid arguments | Fix command |
| `3` | Not found | Check inputs |
| `4` | Permission denied | Check auth |
| `5` | Timeout | Retry or increase limit |
| `10+` | Tool-specific | See tool docs |
```

---

## ASCII State Diagrams

Visualise complex flows in terminal-friendly format.

**Pattern:**
```markdown
## Processing Pipeline

┌─────────────────┐
│   User Input    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Validate     │──── Invalid ───▶ Error Response
└────────┬────────┘
         │ Valid
         ▼
┌─────────────────┐
│    Process      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Store Result  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Respond      │
└─────────────────┘
```

**Box characters reference:**
```
Corners: ┌ ┐ └ ┘
Lines:   │ ─
Arrows:  ▼ ▲ ◀ ▶ ←
T-joins: ├ ┤ ┬ ┴ ┼
```

---

## Hierarchical Configuration

Document configuration precedence clearly.

**Pattern:**
```markdown
## Configuration Precedence

Configuration loads in this order (later overrides earlier):

1. **Built-in defaults** - Hardcoded in tool
2. **System config** - `/etc/tool/config.toml`
3. **User config** - `~/.config/tool/config.toml`
4. **Project config** - `.tool/config.toml`
5. **Environment variables** - `TOOL_*`
6. **Command-line flags** - `--option=value`

### Environment Variables

| Variable | Config Equivalent | Default |
|----------|-------------------|---------|
| `TOOL_DEBUG` | `debug = true` | `false` |
| `TOOL_TIMEOUT` | `timeout = 30` | `60` |
```

---

## "Use ultrathink" Convention

Signal to Claude to use extended thinking for complex analysis.

**Usage:**
```markdown
## Complex Analysis Prompt

Analyse this codebase architecture and identify:
1. Coupling between modules
2. Potential circular dependencies
3. Opportunities for abstraction
4. Performance bottlenecks

Provide specific file:line references for each finding.

Use ultrathink.
```

**When to use:**
- Multi-factor analysis
- Architectural decisions
- Security audits
- Complex debugging

---

## Iteration Protocols

For refinement workflows, specify iteration expectations.

**Pattern:**
```markdown
## Refinement Workflow

### Expected Iterations

| Round | Focus | Duration |
|-------|-------|----------|
| 1-2 | Major structural issues | High value |
| 3-4 | Edge cases, polish | Medium value |
| 5+ | Diminishing returns | Stop here |

### Iteration Protocol

1. Start fresh conversation for each round (context reset)
2. Apply all previous feedback first
3. Run THE EXACT PROMPT - Review
4. Collect feedback, categorise by severity
5. If only minor suggestions remain, iteration complete

### Completion Criteria

Stop iterating when:
- [ ] All critical issues resolved
- [ ] No new major issues found in last round
- [ ] Suggestions are purely stylistic
```

---

## Integration Sections

Document how skill connects to ecosystem.

**Pattern:**
```markdown
## Integration with Other Tools

| Tool | Integration | Setup Required |
|------|-------------|----------------|
| **Git** | Auto-commit on success | None |
| **CI/CD** | Trigger via webhook | `WEBHOOK_URL` env |
| **Slack** | Notifications | `SLACK_TOKEN` env |
| **Monitoring** | Metrics export | Enable in config |

### Git Integration Example

# After successful operation, auto-commit
tool process --auto-commit --message "Processed by tool"

### CI/CD Webhook

tool process --notify-webhook=$WEBHOOK_URL
```

---

## Quick Reference: All Patterns

| Pattern | Use When |
|---------|----------|
| THE EXACT PROMPT | Reproducible prompts needed |
| Why This Exists | Context improves triggering |
| Risk Tiering | Safety-critical operations |
| Robot Mode | Automation/orchestration |
| Exit Codes | Script integration |
| ASCII Diagrams | Complex flows |
| Config Hierarchy | Multiple config sources |
| Use ultrathink | Deep analysis needed |
| Iteration Protocols | Refinement workflows |
| Integration Sections | Ecosystem connectivity |
