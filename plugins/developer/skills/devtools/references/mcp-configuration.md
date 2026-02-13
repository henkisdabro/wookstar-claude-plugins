# Chrome DevTools MCP Configuration Reference

**GitHub Repository:** https://github.com/ChromeDevTools/chrome-devtools-mcp

## Quick Install

```bash
claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest --browserUrl http://127.0.0.1:9222
```

## Configuration Flags

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

## Configuration Examples

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

Start Chrome yourself with remote debugging, then connect via `--browserUrl`. This is the approach used in the Quick Start Workflow.

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

## Platform-Specific Launch Commands

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
