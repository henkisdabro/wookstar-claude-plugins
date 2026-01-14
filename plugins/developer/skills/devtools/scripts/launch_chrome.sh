#!/bin/bash
# Launch Chrome with remote debugging enabled
# Usage: launch_chrome.sh <environment> <url> [headed]
# Arguments:
#   environment: linux, wsl2, or windows
#   url: Target URL (e.g., http://localhost:5173)
#   headed: Optional - pass "headed" for visible browser, omit for headless

ENVIRONMENT="${1:-linux}"
URL="${2:-http://localhost:5173}"
MODE="${3:-headless}"

DEBUG_PORT=9222
USER_DATA_DIR="/tmp/chrome-mcp"

# Determine headless flag
if [[ "$MODE" == "headed" ]]; then
    HEADLESS_FLAG=""
else
    HEADLESS_FLAG="--headless"
fi

# Kill any existing Chrome debug sessions
kill_existing_chrome() {
    echo "Checking for existing Chrome debug sessions on port $DEBUG_PORT..."

    # Check if port is in use
    if lsof -i :$DEBUG_PORT &>/dev/null || ss -tuln | grep -q ":$DEBUG_PORT "; then
        echo "Port $DEBUG_PORT is in use. Attempting to free it..."

        # Try to kill Chrome processes using that port
        if command -v fuser &>/dev/null; then
            fuser -k $DEBUG_PORT/tcp 2>/dev/null || true
        fi

        sleep 1
    fi
}

launch_linux() {
    local chrome_bin=""

    # Find Chrome binary
    if command -v google-chrome &>/dev/null; then
        chrome_bin="google-chrome"
    elif command -v google-chrome-stable &>/dev/null; then
        chrome_bin="google-chrome-stable"
    elif command -v chromium-browser &>/dev/null; then
        chrome_bin="chromium-browser"
    elif command -v chromium &>/dev/null; then
        chrome_bin="chromium"
    else
        echo "ERROR: Chrome not found. Install with:"
        echo "  wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb"
        echo "  sudo apt install -y ./google-chrome-stable_current_amd64.deb"
        exit 1
    fi

    kill_existing_chrome

    echo "Launching Chrome ($chrome_bin) in ${MODE} mode..."
    echo "  URL: $URL"
    echo "  Debug port: $DEBUG_PORT"
    echo "  User data dir: $USER_DATA_DIR"

    # Launch Chrome
    $chrome_bin $HEADLESS_FLAG \
        --remote-debugging-port=$DEBUG_PORT \
        --no-first-run \
        --disable-background-timer-throttling \
        --disable-backgrounding-occluded-windows \
        --disable-renderer-backgrounding \
        --user-data-dir="$USER_DATA_DIR" \
        "$URL" &

    CHROME_PID=$!
    echo ""
    echo "Chrome launched with PID: $CHROME_PID"

    # Wait a moment and verify
    sleep 2
    if curl -s "http://127.0.0.1:$DEBUG_PORT/json/version" &>/dev/null; then
        echo "Chrome DevTools available at: http://127.0.0.1:$DEBUG_PORT"
        curl -s "http://127.0.0.1:$DEBUG_PORT/json/version" | head -5
    else
        echo "WARNING: Chrome may not be ready yet. Check with:"
        echo "  curl -s http://127.0.0.1:$DEBUG_PORT/json/version"
    fi
}

launch_windows() {
    # Find Chrome executable
    local chrome_exe=""

    CHROME_PATHS=(
        "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
        "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"
    )

    for path in "${CHROME_PATHS[@]}"; do
        if [[ -f "$path" ]]; then
            chrome_exe="$path"
            break
        fi
    done

    if [[ -z "$chrome_exe" ]]; then
        echo "ERROR: Chrome not found at standard Windows paths"
        exit 1
    fi

    echo "Launching Chrome ($chrome_exe) in ${MODE} mode..."
    echo "  URL: $URL"
    echo "  Debug port: $DEBUG_PORT"

    # Use Windows temp directory
    WIN_USER_DATA_DIR="%TEMP%\\chrome-mcp"

    # Launch via cmd.exe for proper Windows execution
    cmd.exe /c start "" "$chrome_exe" $HEADLESS_FLAG \
        --remote-debugging-port=$DEBUG_PORT \
        --no-first-run \
        --user-data-dir="$WIN_USER_DATA_DIR" \
        "$URL"

    echo ""
    echo "Chrome launched. DevTools should be available at: http://127.0.0.1:$DEBUG_PORT"
}

case "$ENVIRONMENT" in
    linux|wsl2)
        launch_linux
        ;;
    windows)
        launch_windows
        ;;
    *)
        echo "Unknown environment: $ENVIRONMENT"
        echo "Supported: linux, wsl2, windows"
        exit 1
        ;;
esac
