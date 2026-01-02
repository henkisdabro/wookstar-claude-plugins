#!/bin/bash
# Detect the current operating environment: windows, linux, or wsl2

detect_environment() {
    # Check for WSL2 first (most specific)
    if grep -qiE "(microsoft|wsl)" /proc/version 2>/dev/null; then
        echo "wsl2"
        return 0
    fi

    # Check for Windows (Git Bash, MSYS, Cygwin)
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ -n "$WINDIR" ]]; then
        echo "windows"
        return 0
    fi

    # Check uname for additional Windows detection
    case "$(uname -s)" in
        MINGW*|MSYS*|CYGWIN*)
            echo "windows"
            return 0
            ;;
        Linux)
            # Double-check it's not WSL
            if [[ -f /proc/version ]] && grep -qiE "(microsoft|wsl)" /proc/version; then
                echo "wsl2"
            else
                echo "linux"
            fi
            return 0
            ;;
        Darwin)
            echo "macos"
            return 0
            ;;
        *)
            echo "unknown"
            return 1
            ;;
    esac
}

# Run detection
detect_environment
