#!/bin/bash
# validate-test-output.sh
# Analyses test output from Bash tool and returns hook decision JSON
# Used by validation-gates agent PostToolUse hook

# Read hook input from stdin
INPUT=$(cat)

# Extract tool output from JSON input
TOOL_OUTPUT=$(echo "$INPUT" | jq -r '.tool_output // empty' 2>/dev/null)

# If jq fails or no tool_output, approve by default
if [ -z "$TOOL_OUTPUT" ]; then
  echo '{"decision": "approve", "reason": "No test output to analyse"}'
  exit 0
fi

# Check for common test failure patterns
if echo "$TOOL_OUTPUT" | grep -qiE "(FAIL|FAILED|ERROR|AssertionError|Test failed|Tests failed|npm ERR!|pytest.*failed|go test.*FAIL)"; then
  # Count failures
  FAIL_COUNT=$(echo "$TOOL_OUTPUT" | grep -ciE "(FAIL|failed|error)" 2>/dev/null || echo "0")

  # Extract first few failure lines for context
  FAILURE_SUMMARY=$(echo "$TOOL_OUTPUT" | grep -iE "(FAIL|ERROR|failed)" | head -3 | tr '\n' ' ' | cut -c1-200)

  echo "{\"decision\": \"block\", \"reason\": \"Test failures detected ($FAIL_COUNT issues found)\", \"systemMessage\": \"Tests failed. Summary: $FAILURE_SUMMARY\"}"
  exit 0
fi

# Check for successful test patterns
if echo "$TOOL_OUTPUT" | grep -qiE "(All tests passed|Tests:.*passed|passed.*tests|OK|PASS|success)"; then
  echo '{"decision": "approve", "reason": "Tests passed successfully"}'
  exit 0
fi

# Default: approve if no clear failure pattern
echo '{"decision": "approve", "reason": "No test failures detected"}'
