---
name: execute-prp
description: Implement a feature from a PRP file (written by prp-generator) and drive it until every validation gate passes.
disable-model-invocation: true
argument-hint: "[path to PRP file, e.g. PRPs/dark-mode.md]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - WebSearch
  - WebFetch
  - Bash(npm *)
  - Bash(pnpm *)
  - Bash(bun *)
  - Bash(uv *)
  - Bash(python *)
  - Bash(pytest *)
  - Bash(go *)
---

# Execute PRP

PRP file: $ARGUMENTS

PRPs written by the prp-generator skill follow its `assets/prp_template.md`. The sections this skill leans on are **Implementation Blueprint** (Prerequisites, Implementation Steps, Error Handling Strategy, Edge Cases), **Validation Gates** and **Success Criteria**. A hand-written PRP may differ - map its sections onto these before step 2.

## 1. Load

Read the whole PRP. Open every file it cites with a `path:line` reference and fetch every documentation URL listed under Research Findings that touches code you will write. Where a reference is stale (file moved, API changed), find the current equivalent and note the difference.

Done when every cited file and URL has been opened, and every Prerequisite is either satisfied or listed as a blocker for the user.

## 2. Plan

Turn the Implementation Steps into a task list, one task per step, in the PRP's order. Add a final task per Validation Gate. For each task, name the existing file whose pattern it follows.

Done when the task list covers every Implementation Step and every Validation Gate.

## 3. Implement

Work the tasks in order. After each step, run the narrowest gate that covers it (the step's own test, a type-check, or a lint on the touched files) and fix failures before moving on. Apply the PRP's Error Handling Strategy and Edge Cases as you go, rather than after.

Done when every implementation task is complete and its narrow check passes.

## 4. Validate

Run every command under Validation Gates exactly as written, in order. On failure, read the error, check the PRP's gotchas and error-handling notes, fix, and re-run that gate and every gate after it.

Done when every gate exits 0 in a single uninterrupted pass.

## 5. Close out

Re-read the PRP top to bottom and tick each Success Criteria item against the code, with the file or test that proves it.

Report to the user: which criteria are met (with evidence), any gate or criterion you could not satisfy and why, and every place you departed from the PRP. Done when every Success Criteria item is accounted for in that report.
