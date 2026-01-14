#!/bin/bash
# Check if Chrome is installed for the given environment
# Usage: check_chrome.sh <environment>
# Returns: 0 if installed, 1 if not installed

ENVIRONMENT="${1:-linux}"

check_chrome_linux() {
    # Check common Chrome binary names
    if command -v google-chrome &>/dev/null; then
        echo "status:installed"
        echo "path:$(which google-chrome)"
        echo "version:$(google-chrome --version 2>/dev/null)"
        return 0
    elif command -v google-chrome-stable &>/dev/null; then
        echo "status:installed"
        echo "path:$(which google-chrome-stable)"
        echo "version:$(google-chrome-stable --version 2>/dev/null)"
        return 0
    elif command -v chromium-browser &>/dev/null; then
        echo "status:installed"
        echo "path:$(which chromium-browser)"
        echo "version:$(chromium-browser --version 2>/dev/null)"
        return 0
    elif command -v chromium &>/dev/null; then
        echo "status:installed"
        echo "path:$(which chromium)"
        echo "version:$(chromium --version 2>/dev/null)"
        return 0
    fi

    echo "status:not_installed"
    echo ""
    echo "============================================"
    echo "  CHROME NOT FOUND - Installation Required"
    echo "============================================"
    echo ""
    echo "Option 1: Download and install directly (recommended)"
    echo "  wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb"
    echo "  sudo apt install -y ./google-chrome-stable_current_amd64.deb"
    echo ""
    echo "Option 2: Add Google's repository first"
    echo "  # Add Google's signing key"
    echo "  wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg"
    echo ""
    echo "  # Add the repository"
    echo "  echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main' | sudo tee /etc/apt/sources.list.d/google-chrome.list"
    echo ""
    echo "  # Install Chrome"
    echo "  sudo apt update"
    echo "  sudo apt install -y google-chrome-stable"
    echo ""
    echo "Option 3: Install Chromium (open-source alternative)"
    echo "  sudo apt update"
    echo "  sudo apt install -y chromium-browser"
    echo ""
    echo "After installation, run this check again to verify."
    return 1
}

check_chrome_windows() {
    # Check common Windows Chrome paths (from WSL2)
    CHROME_PATHS=(
        "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
        "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"
    )

    for path in "${CHROME_PATHS[@]}"; do
        if [[ -f "$path" ]]; then
            echo "status:installed"
            echo "path:$path"
            # Try to get version
            "$path" --version 2>/dev/null || true
            return 0
        fi
    done

    # Check Windows environment variables if running natively
    if [[ -n "$LOCALAPPDATA" ]]; then
        local win_path="$LOCALAPPDATA/Google/Chrome/Application/chrome.exe"
        if [[ -f "$win_path" ]]; then
            echo "status:installed"
            echo "path:$win_path"
            return 0
        fi
    fi

    # Try which/where for PATH-based detection
    if command -v chrome.exe &>/dev/null; then
        echo "status:installed"
        echo "path:$(which chrome.exe)"
        return 0
    fi

    echo "status:not_installed"
    echo ""
    echo "============================================"
    echo "  CHROME NOT FOUND - Installation Required"
    echo "============================================"
    echo ""
    echo "Option 1: Download from Google (recommended)"
    echo "  Visit: https://www.google.com/chrome/"
    echo "  Download and run the installer"
    echo ""
    echo "Option 2: Using winget (Windows Package Manager)"
    echo "  winget install Google.Chrome"
    echo ""
    echo "Option 3: Using Chocolatey"
    echo "  choco install googlechrome"
    echo ""
    echo "Option 4: Using PowerShell (direct download)"
    echo '  $installer = "$env:TEMP\chrome_installer.exe"'
    echo '  Invoke-WebRequest -Uri "https://dl.google.com/chrome/install/latest/chrome_installer.exe" -OutFile $installer'
    echo '  Start-Process -FilePath $installer -Args "/silent /install" -Wait'
    echo '  Remove-Item $installer'
    echo ""
    echo "After installation, run this check again to verify."
    return 1
}

# Main execution
echo "Checking Chrome installation for environment: $ENVIRONMENT"
echo ""

case "$ENVIRONMENT" in
    linux|wsl2)
        check_chrome_linux
        ;;
    windows)
        check_chrome_windows
        ;;
    *)
        echo "Unknown environment: $ENVIRONMENT"
        echo "Supported: linux, wsl2, windows"
        exit 1
        ;;
esac
