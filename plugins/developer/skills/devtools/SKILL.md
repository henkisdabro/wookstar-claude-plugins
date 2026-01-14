---
name: devtools
description: This skill helps launch and configure the Chrome DevTools MCP server, giving Claude visual access to a live browser for debugging and automation. Use when the user asks to set up browser debugging, launch Chrome with DevTools, configure chrome-devtools-mcp, see what my app looks like, take screenshots of my web application, check the browser console, debug console errors, inspect network requests, analyse API responses, measure Core Web Vitals or page performance, run a Lighthouse audit, test button clicks or form submissions, automate browser interactions, fill out forms programmatically, simulate user actions, emulate mobile devices or slow networks, capture DOM snapshots, execute JavaScript in the browser, or troubleshoot Chrome DevTools MCP connection issues. Supports Windows, Linux, and WSL2 environments.
---

# Chrome DevTools MCP Setup

## Overview

This skill automates the setup and launch of Chrome with remote debugging for use with the chrome-devtools-mcp server. It handles environment detection, Chrome installation verification, MCP configuration, and browser launch across Windows, Linux, and WSL2.

**GitHub Repository:** https://github.com/ChromeDevTools/chrome-devtools-mcp

## Why Give Claude Browser Access?

Without browser access, Claude is "coding blindfolded" - making changes without seeing the results. The Chrome DevTools MCP server provides **26 specialised tools** that give Claude eyes into your running application:

| Category | Capabilities |
|----------|--------------|
| **Visual Inspection** | Take screenshots, capture DOM snapshots, see rendered output |
| **Console & Logging** | Read console messages, catch JavaScript errors, debug issues |
| **Network Analysis** | Inspect API requests/responses, analyse headers, debug fetch calls |
| **Performance** | Record traces, measure Core Web Vitals (LCP, CLS, TBT), identify bottlenecks |
| **User Simulation** | Click elements, fill forms, drag-and-drop, handle dialogs |
| **Device Emulation** | Simulate mobile viewports, throttle CPU/network, test responsive design |

This enables Claude to:
- **Verify changes visually** instead of guessing if CSS/layout is correct
- **Debug runtime errors** by reading actual console output
- **Test user flows** by simulating clicks and form submissions
- **Identify performance issues** with real Core Web Vitals data
- **Catch regressions** by comparing screenshots before/after changes

## Quick Start Workflow

Execute these steps in order:

### Step 1: Detect Environment

Run the environment detection script to determine the platform:

```bash
bash scripts/detect_environment.sh
```

The script returns one of: `windows`, `linux`, or `wsl2`

### Step 2: Verify Chrome Installation

Run the Chrome check script with the detected environment:

```bash
bash scripts/check_chrome.sh <environment>
```

The script outputs `status:installed` or `status:not_installed`. If Chrome is not installed, the script provides detailed installation instructions. See the **Chrome Installation** section below for manual installation options.

**IMPORTANT:** Do not proceed to later steps until Chrome is installed and verified.

### Step 3: Check MCP Server Status

Verify if chrome-devtools-mcp is configured:

```bash
claude mcp list | grep -i chrome
```

If not installed, install with:

```bash
claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest --browserUrl http://127.0.0.1:9222
```

### Step 4: Detect Running Dev Server

Check for running dev servers on common ports:

```bash
bash scripts/detect_dev_server.sh
```

This checks ports 5173, 5174, 5175, 3000, 3001, 8080, and 8000.

If no dev server is running and one is needed, offer to start it:
- For Vite projects: `npm run dev`
- For Next.js: `npm run dev` or `npx next dev`
- For React CRA: `npm start`

### Step 5: Launch Chrome with Debugging

Launch Chrome with remote debugging enabled:

```bash
bash scripts/launch_chrome.sh <environment> <url> [headed]
```

**Arguments:**
- `<environment>`: `windows`, `linux`, or `wsl2`
- `<url>`: Target URL (e.g., `http://localhost:5173`)
- `[headed]`: Optional - pass `headed` for visible browser, omit for headless (default)

**Examples:**
```bash
# Headless (default)
bash scripts/launch_chrome.sh wsl2 http://localhost:5173

# Headed (visible browser)
bash scripts/launch_chrome.sh wsl2 http://localhost:5173 headed
```

## Platform-Specific Commands

### WSL2 / Linux

```bash
# Headless
google-chrome --headless --remote-debugging-port=9222 --no-first-run --user-data-dir=/tmp/chrome-mcp http://localhost:5173 &

# Headed
google-chrome --remote-debugging-port=9222 --no-first-run --user-data-dir=/tmp/chrome-mcp http://localhost:5173 &
```

### Windows (CMD/PowerShell)

```cmd
REM Headless
start chrome.exe --headless --remote-debugging-port=9222 --no-first-run --user-data-dir=%TEMP%\chrome-mcp http://localhost:5173

REM Headed
start chrome.exe --remote-debugging-port=9222 --no-first-run --user-data-dir=%TEMP%\chrome-mcp http://localhost:5173
```

## Chrome Installation

If Chrome is not detected, install it using one of these methods:

### Linux / WSL2

**Option 1: Direct download (recommended)**
```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./google-chrome-stable_current_amd64.deb
```

**Option 2: Add Google's repository**
```bash
# Add signing key
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg

# Add repository
echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main' | sudo tee /etc/apt/sources.list.d/google-chrome.list

# Install
sudo apt update
sudo apt install -y google-chrome-stable
```

**Option 3: Chromium (open-source alternative)**
```bash
sudo apt update
sudo apt install -y chromium-browser
```

### Windows

**Option 1: Download from Google**
Visit https://www.google.com/chrome/ and run the installer.

**Option 2: Using winget**
```powershell
winget install Google.Chrome
```

**Option 3: Using Chocolatey**
```powershell
choco install googlechrome
```

**Option 4: PowerShell direct download**
```powershell
$installer = "$env:TEMP\chrome_installer.exe"
Invoke-WebRequest -Uri "https://dl.google.com/chrome/install/latest/chrome_installer.exe" -OutFile $installer
Start-Process -FilePath $installer -Args "/silent /install" -Wait
Remove-Item $installer
```

### Verify Installation

After installation, verify with:
```bash
bash scripts/check_chrome.sh <environment>
```

## MCP Configuration

### Quick Install

```bash
claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest --browserUrl http://127.0.0.1:9222
```

### Configuration Reference

All flags can be passed via the `args` array in `.mcp.json`:

| Flag | Description | Default |
|------|-------------|---------|
| `--browserUrl`, `-u` | Connect to running Chrome (e.g., `http://127.0.0.1:9222`) | - |
| `--autoConnect` | Auto-connect to Chrome 145+ with remote debugging enabled | `false` |
| `--headless` | Run in headless (no UI) mode | `false` |
| `--isolated` | Use temporary user-data-dir, auto-cleaned on close | `false` |
| `--channel` | Chrome channel: `stable`, `canary`, `beta`, `dev` | `stable` |
| `--viewport` | Initial viewport size (e.g., `1280x720`, max `3840x2160` headless) | - |
| `--executablePath`, `-e` | Path to custom Chrome executable | - |
| `--userDataDir` | Custom user data directory | `~/.cache/chrome-devtools-mcp/chrome-profile` |
| `--wsEndpoint`, `-w` | WebSocket endpoint (alternative to `--browserUrl`) | - |
| `--wsHeaders` | Custom WebSocket headers as JSON (use with `--wsEndpoint`) | - |
| `--proxyServer` | Proxy server for Chrome | - |
| `--acceptInsecureCerts` | Ignore self-signed/expired certificate errors | `false` |
| `--chromeArg` | Additional Chrome launch arguments (array) | - |
| `--logFile` | Debug log file path (set `DEBUG=*` for verbose) | - |
| `--categoryEmulation` | Include emulation tools | `true` |
| `--categoryPerformance` | Include performance tools | `true` |
| `--categoryNetwork` | Include network tools | `true` |

### Basic Configuration

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--browserUrl",
        "http://127.0.0.1:9222"
      ]
    }
  }
}
```

### Headless with Isolated Profile

Best for CI/CD or automated testing - uses a temporary profile that's cleaned up automatically:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--headless",
        "--isolated"
      ]
    }
  }
}
```

### Custom Viewport for Mobile Testing

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--browserUrl=http://127.0.0.1:9222",
        "--viewport=390x844"
      ]
    }
  }
}
```

### Using Chrome Canary/Beta

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--channel=canary",
        "--headless",
        "--isolated"
      ]
    }
  }
}
```

### With Debug Logging

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--browserUrl=http://127.0.0.1:9222",
        "--logFile=/tmp/chrome-devtools-mcp.log"
      ],
      "env": {
        "DEBUG": "*"
      }
    }
  }
}
```

### WebSocket Connection with Auth Headers

For connecting to remote Chrome instances with authentication:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--wsEndpoint=ws://127.0.0.1:9222/devtools/browser/<id>",
        "--wsHeaders={\"Authorization\":\"Bearer YOUR_TOKEN\"}"
      ]
    }
  }
}
```

To get the WebSocket endpoint, visit `http://127.0.0.1:9222/json/version` and look for `webSocketDebuggerUrl`.

## Connection Methods

### Method 1: Manual Connection (Recommended)

Start Chrome yourself with remote debugging, then connect via `--browserUrl`. This is the approach used in the Quick Start Workflow above.

**When to use:**
- Running Claude in a sandboxed environment
- Need full control over Chrome launch options
- Working with self-signed certificates

### Method 2: Auto-Connect (Chrome 145+)

Let chrome-devtools-mcp automatically connect to a running Chrome instance.

**Step 1:** Enable remote debugging in Chrome:
1. Navigate to `chrome://inspect/#remote-debugging`
2. Follow the dialog to allow debugging connections

**Step 2:** Configure MCP with `--autoConnect`:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest", "--autoConnect"]
    }
  }
}
```

**When to use:**
- Sharing state between manual testing and Claude-driven testing
- Avoiding WebDriver sign-in blocks (some sites block automated browsers)
- Want Chrome to prompt for permission before Claude connects

### Method 3: Let MCP Launch Chrome

If you omit `--browserUrl` and `--autoConnect`, the MCP server will launch its own Chrome instance.

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest", "--headless", "--isolated"]
    }
  }
}
```

**When to use:**
- Fully automated workflows
- No need to maintain browser state
- CI/CD pipelines

## User Data Directory

By default, chrome-devtools-mcp uses a persistent profile at:
- **Linux/macOS:** `$HOME/.cache/chrome-devtools-mcp/chrome-profile-$CHANNEL`
- **Windows:** `%HOMEPATH%/.cache/chrome-devtools-mcp/chrome-profile-$CHANNEL`

This profile is shared across all MCP sessions, preserving cookies, local storage, and login state.

Use `--isolated` for a fresh, temporary profile that's automatically cleaned up when the browser closes.

## Troubleshooting

For detailed troubleshooting steps, read `references/troubleshooting.md`.

### Quick Checks

1. **Test MCP server runs:**
   ```bash
   npx chrome-devtools-mcp@latest --help
   ```

2. **Verify Chrome is listening:**
   ```bash
   curl -s http://127.0.0.1:9222/json/version
   ```

3. **Check for existing Chrome processes:**
   ```bash
   # Linux/WSL2
   pgrep -a chrome

   # Windows
   tasklist | findstr chrome
   ```

### Common Issues

| Issue | Solution |
|-------|----------|
| "Target closed" error | Close all Chrome instances, restart with debugging |
| Module not found | Clear npm cache: `rm -rf ~/.npm/_npx && npm cache clean --force` |
| Connection refused | Ensure Chrome launched with `--remote-debugging-port=9222` |
| Port already in use | Kill existing Chrome or use different port |
| Chrome won't start in sandbox | Use `--browserUrl` to connect to manually-started Chrome |
| WebDriver sign-in blocked | Use `--autoConnect` to connect to your normal browser session |
| VM-to-host connection fails | See `references/troubleshooting.md` for port forwarding guidance |

## Known Limitations

### Operating System Sandboxes

Some MCP clients sandbox the server using macOS Seatbelt or Linux containers. In sandboxed environments, chrome-devtools-mcp cannot start Chrome (which requires its own sandbox permissions).

**Workarounds:**
1. Disable sandboxing for chrome-devtools-mcp in your MCP client
2. Use `--browserUrl` to connect to a Chrome instance started outside the sandbox

### Security Considerations

The remote debugging port exposes your browser to any application on your machine. When debugging is enabled:
- Avoid browsing sensitive sites (banking, email with sensitive data)
- Use `--isolated` for a separate profile
- Close Chrome when done debugging

## Verification

After setup, verify the connection works:

1. Chrome should be running with remote debugging
2. MCP server should connect to `http://127.0.0.1:9222`
3. Test with `mcp__chrome-devtools__list_pages` tool
