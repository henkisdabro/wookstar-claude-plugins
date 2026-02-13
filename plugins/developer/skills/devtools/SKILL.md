---
name: devtools
description: This skill helps launch and configure the Chrome DevTools MCP server, giving Claude visual access to a live browser for debugging and automation. Use when the user asks to set up browser debugging, launch Chrome with DevTools, configure chrome-devtools-mcp, see what my app looks like, take screenshots of my web application, check the browser console, debug console errors, inspect network requests, analyse API responses, measure Core Web Vitals or page performance, run a Lighthouse audit, test button clicks or form submissions, automate browser interactions, fill out forms programmatically, simulate user actions, emulate mobile devices or slow networks, capture DOM snapshots, execute JavaScript in the browser, or troubleshoot Chrome DevTools MCP connection issues. Supports Windows, Linux, and WSL2 environments.
---

# Chrome DevTools MCP

**GitHub Repository:** https://github.com/ChromeDevTools/chrome-devtools-mcp

Without browser access, Claude is "coding blindfolded" - making changes without seeing results. The Chrome DevTools MCP server provides **26 specialised tools** across these categories:

| Category | Capabilities |
|----------|--------------|
| **Visual Inspection** | Take screenshots, capture DOM snapshots, see rendered output |
| **Console & Logging** | Read console messages, catch JavaScript errors, debug issues |
| **Network Analysis** | Inspect API requests/responses, analyse headers, debug fetch calls |
| **Performance** | Record traces, measure Core Web Vitals (LCP, CLS, TBT), identify bottlenecks |
| **User Simulation** | Click elements, fill forms, drag-and-drop, handle dialogs |
| **Device Emulation** | Simulate mobile viewports, throttle CPU/network, test responsive design |

## Quick Start Workflow

Execute these steps in order:

### Step 1: Detect Environment

```bash
bash scripts/detect_environment.sh
```

Returns one of: `windows`, `linux`, or `wsl2`

### Step 2: Verify Chrome Installation

```bash
bash scripts/check_chrome.sh <environment>
```

Outputs `status:installed` or `status:not_installed`. If not installed, see [references/chrome-installation.md](references/chrome-installation.md) for installation options.

**IMPORTANT:** Do not proceed until Chrome is installed and verified.

### Step 3: Check MCP Server Status

```bash
claude mcp list | grep -i chrome
```

If not installed:

```bash
claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest --browserUrl http://127.0.0.1:9222
```

For advanced configuration options and alternative connection methods, see [references/mcp-configuration.md](references/mcp-configuration.md).

### Step 4: Detect Running Dev Server

```bash
bash scripts/detect_dev_server.sh
```

Checks ports 5173, 5174, 5175, 3000, 3001, 8080, and 8000. If no dev server is running and one is needed, offer to start it.

### Step 5: Launch Chrome with Debugging

```bash
bash scripts/launch_chrome.sh <environment> <url> [headed]
```

- `<environment>`: `windows`, `linux`, or `wsl2`
- `<url>`: Target URL (e.g., `http://localhost:5173`)
- `[headed]`: Optional - pass `headed` for visible browser, omit for headless (default)

### Step 6: Verify Connection

```bash
curl -s http://127.0.0.1:9222/json/version
```

Once connected, test with the `mcp__chrome-devtools__list_pages` tool.

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Target closed" error | Close all Chrome instances, restart with debugging |
| Module not found | Clear npm cache: `rm -rf ~/.npm/_npx && npm cache clean --force` |
| Connection refused | Ensure Chrome launched with `--remote-debugging-port=9222` |
| Port already in use | Kill existing Chrome or use different port |
| Chrome won't start in sandbox | Use `--browserUrl` to connect to manually-started Chrome |
| WebDriver sign-in blocked | Use `--autoConnect` to connect to your normal browser session |

For detailed troubleshooting steps, see [references/troubleshooting.md](references/troubleshooting.md).

## References

- **Chrome Installation:** [references/chrome-installation.md](references/chrome-installation.md) - platform-specific installation options
- **MCP Configuration:** [references/mcp-configuration.md](references/mcp-configuration.md) - all configuration flags, JSON examples, connection methods, platform commands, and known limitations
- **Troubleshooting:** [references/troubleshooting.md](references/troubleshooting.md) - detailed error resolution, debugging with logs, and recovery scripts
