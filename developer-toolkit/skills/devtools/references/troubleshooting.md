# Chrome DevTools MCP Troubleshooting Guide

## General Tips

1. **Test MCP server independently:**
   ```bash
   npx chrome-devtools-mcp@latest --help
   ```

2. **Ensure npm/node versions match:**
   Make sure the MCP client uses the same npm and node version as the terminal.

3. **Use --yes flag for npx:**
   When configuring MCP client, use `--yes` to auto-accept installation prompts:
   ```bash
   npx --yes chrome-devtools-mcp@latest
   ```

4. **Check IDE output logs:**
   If the client is an IDE, look for specific errors in the Output pane.

## Debugging with Logs

### Enable Debug Mode

Start the MCP server with debugging enabled:

```bash
DEBUG=* npx chrome-devtools-mcp@latest --log-file=/tmp/chrome-devtools-mcp.log
```

### Debug Configuration in .mcp.json

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--log-file",
        "/tmp/chrome-devtools-mcp.log"
      ],
      "env": {
        "DEBUG": "*"
      }
    }
  }
}
```

### View Logs

```bash
# Follow log file in real-time
tail -f /tmp/chrome-devtools-mcp.log

# View last 50 lines
tail -50 /tmp/chrome-devtools-mcp.log
```

## Specific Problems

### Error: `Cannot find module ...` (ERR_MODULE_NOT_FOUND)

**Cause:** Non-supported Node version or corrupted npm/npx cache.

**Solution:**
```bash
# Clear npx cache (NOTE: may remove other npx executables)
rm -rf ~/.npm/_npx

# Clear npm cache
npm cache clean --force

# Reinstall
npx chrome-devtools-mcp@latest --help
```

### Error: "Target closed"

**Cause:** Browser could not be started or closed unexpectedly.

**Solutions:**
1. Close all existing Chrome instances:
   ```bash
   # Linux/WSL2
   pkill -f chrome

   # Windows
   taskkill /F /IM chrome.exe
   ```

2. Ensure latest stable Chrome is installed

3. Check system meets Chrome requirements: https://support.google.com/chrome/a/answer/7100626

4. Restart Chrome with debugging:
   ```bash
   google-chrome --headless --remote-debugging-port=9222 --no-first-run --user-data-dir=/tmp/chrome-mcp &
   ```

### Error: Connection Refused

**Cause:** Chrome not running with remote debugging enabled.

**Solutions:**
1. Verify Chrome is running with debugging:
   ```bash
   curl -s http://127.0.0.1:9222/json/version
   ```

2. Check if port 9222 is in use:
   ```bash
   # Linux/WSL2
   ss -tuln | grep 9222
   lsof -i :9222

   # Windows (PowerShell)
   netstat -ano | findstr 9222
   ```

3. Kill process using the port and restart Chrome:
   ```bash
   fuser -k 9222/tcp
   ```

### Error: Port Already in Use

**Cause:** Another process (often previous Chrome instance) is using port 9222.

**Solution:**
```bash
# Find and kill process on port
fuser -k 9222/tcp

# Or use different port
google-chrome --remote-debugging-port=9223 ...

# Update MCP config to match
claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest --browserUrl http://127.0.0.1:9223
```

### WSL2: Remote Debugging Between VM and Host

**Cause:** Host header validation blocks connections from VM to host Chrome.

**Solution:** Tunnel the port over SSH:

```bash
# In WSL2, run:
ssh -N -L 127.0.0.1:9222:127.0.0.1:9222 <user>@<host-ip>

# Then configure MCP to connect to localhost
claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest --browserUrl http://127.0.0.1:9222
```

### Chrome Won't Start in Headless Mode

**Cause:** Missing dependencies or sandbox issues.

**Solutions:**

1. Install missing dependencies (Linux):
   ```bash
   sudo apt install -y \
     libnss3 \
     libnspr4 \
     libatk1.0-0 \
     libatk-bridge2.0-0 \
     libcups2 \
     libdrm2 \
     libxkbcommon0 \
     libxcomposite1 \
     libxdamage1 \
     libxfixes3 \
     libxrandr2 \
     libgbm1 \
     libasound2
   ```

2. Try with sandbox disabled (testing only):
   ```bash
   google-chrome --headless --no-sandbox --remote-debugging-port=9222 ...
   ```

### MCP Server Not Responding

**Diagnostic steps:**

1. Check if server is running:
   ```bash
   pgrep -f chrome-devtools-mcp
   ```

2. Check Claude MCP status:
   ```bash
   claude mcp list
   ```

3. Remove and re-add MCP server:
   ```bash
   claude mcp remove chrome-devtools
   claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest --browserUrl http://127.0.0.1:9222
   ```

4. Restart Claude Code session

## Verification Commands

### Check Chrome is Listening

```bash
curl -s http://127.0.0.1:9222/json/version
```

Expected output:
```json
{
   "Browser": "Chrome/xxx.x.xxxx.xx",
   "Protocol-Version": "1.3",
   ...
}
```

### List Available Pages

```bash
curl -s http://127.0.0.1:9222/json/list
```

### Check MCP Configuration

```bash
claude mcp list
cat ~/.mcp.json
```

## Quick Recovery Script

If everything is broken, run this to reset:

```bash
#!/bin/bash
# Reset Chrome DevTools MCP setup

# Kill all Chrome
pkill -9 -f chrome || true

# Clear temp data
rm -rf /tmp/chrome-mcp

# Clear npx cache
rm -rf ~/.npm/_npx

# Remove MCP config
claude mcp remove chrome-devtools 2>/dev/null || true

# Wait
sleep 2

# Start fresh Chrome
google-chrome --headless --remote-debugging-port=9222 --no-first-run --user-data-dir=/tmp/chrome-mcp &

# Wait for startup
sleep 3

# Re-add MCP
claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest --browserUrl http://127.0.0.1:9222

echo "Done. Restart Claude Code session."
```

## Resources

- **GitHub Repository:** https://github.com/ChromeDevTools/chrome-devtools-mcp
- **Chrome DevTools Protocol:** https://chromedevtools.github.io/devtools-protocol/
- **Chrome System Requirements:** https://support.google.com/chrome/a/answer/7100626
