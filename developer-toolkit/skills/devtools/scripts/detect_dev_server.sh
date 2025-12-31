#!/bin/bash
# Detect running development servers on common ports
# Returns the first available dev server URL or "none"

COMMON_PORTS=(5173 5174 5175 3000 3001 8080 8000 4200 4000)

check_port() {
    local port=$1

    # Try curl first (most reliable)
    if curl -s --max-time 1 "http://localhost:$port" &>/dev/null; then
        return 0
    fi

    # Fallback to checking if something is listening
    if command -v ss &>/dev/null; then
        if ss -tuln | grep -q ":$port "; then
            return 0
        fi
    elif command -v netstat &>/dev/null; then
        if netstat -tuln | grep -q ":$port "; then
            return 0
        fi
    elif command -v lsof &>/dev/null; then
        if lsof -i :$port &>/dev/null; then
            return 0
        fi
    fi

    return 1
}

get_process_on_port() {
    local port=$1

    if command -v lsof &>/dev/null; then
        lsof -i :$port -sTCP:LISTEN 2>/dev/null | tail -1 | awk '{print $1}'
    elif command -v ss &>/dev/null; then
        ss -tulnp | grep ":$port " | grep -oP 'users:\(\("\K[^"]+' 2>/dev/null
    fi
}

echo "Checking for running dev servers..."
echo ""

FOUND_SERVERS=()

for port in "${COMMON_PORTS[@]}"; do
    if check_port $port; then
        process=$(get_process_on_port $port)
        FOUND_SERVERS+=("$port")
        echo "  [FOUND] http://localhost:$port (process: ${process:-unknown})"
    fi
done

echo ""

if [[ ${#FOUND_SERVERS[@]} -eq 0 ]]; then
    echo "result:none"
    echo ""
    echo "No dev servers detected. To start one:"
    echo "  Vite:    npm run dev"
    echo "  Next.js: npm run dev"
    echo "  CRA:     npm start"
else
    # Return the first found server (usually the most common dev port)
    echo "result:http://localhost:${FOUND_SERVERS[0]}"
fi
