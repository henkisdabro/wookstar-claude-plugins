#!/bin/bash
#
# Claude Code Plugin Installation Script
# Automatically installs all marketplaces and plugins for fresh Linux installations
#
# Author: Henrik Soederlund
# Repository: https://github.com/henkisdabro/wookstar-claude-code-plugins
#
# Usage:
#   chmod +x install-claude-plugins.sh
#   ./install-claude-plugins.sh
#
# Or run directly:
#   curl -fsSL https://raw.githubusercontent.com/henkisdabro/wookstar-claude-code-plugins/main/scripts/install-claude-plugins.sh | bash
#

set -e

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Colour

# Print functions
print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if Claude Code is installed
check_claude_installed() {
    if ! command -v claude &> /dev/null; then
        print_error "Claude Code is not installed or not in PATH"
        echo ""
        echo "Please install Claude Code first:"
        echo "  npm install -g @anthropic-ai/claude-code"
        echo ""
        echo "Or visit: https://claude.ai/code"
        exit 1
    fi
    print_success "Claude Code is installed"
}

# Create .claude directory if it doesn't exist
ensure_claude_dir() {
    if [ ! -d "$HOME/.claude" ]; then
        mkdir -p "$HOME/.claude"
        print_success "Created ~/.claude directory"
    fi
}

# ============================================================================
# MARKETPLACE DEFINITIONS
# ============================================================================

# Define marketplaces to install
# Format: "marketplace_name|source_type|source_value"
MARKETPLACES=(
    "claude-code-plugins|github|anthropics/claude-code"
    "wookstar-claude-code-plugins|github|henkisdabro/wookstar-claude-code-plugins"
    "claude-scientific-skills|github|K-Dense-AI/claude-scientific-skills"
    "claude-skills|git|https://github.com/jezweb/claude-skills.git"
)

# ============================================================================
# PLUGIN DEFINITIONS
# ============================================================================

# Plugins to enable after installation
# Format: "plugin_name@marketplace_name"
#
# NOTE: Some plugins from claude-skills have bugs (missing skill files)
# These are commented out but left for reference

PLUGINS_TO_ENABLE=(
    # =========================================================================
    # Anthropic Official Plugins (claude-code-plugins)
    # =========================================================================
    "agent-sdk-dev@claude-code-plugins"
    "commit-commands@claude-code-plugins"
    "feature-dev@claude-code-plugins"
    "frontend-design@claude-code-plugins"
    "code-review@claude-code-plugins"
    "security-guidance@claude-code-plugins"

    # =========================================================================
    # Wookstar Plugins (wookstar-claude-code-plugins)
    # =========================================================================
    # Toolkits (set to false by default - enable as needed)
    # "productivity-toolkit@wookstar-claude-code-plugins"
    # "developer-toolkit@wookstar-claude-code-plugins"
    # "documents-toolkit@wookstar-claude-code-plugins"
    # "claudecode-toolkit@wookstar-claude-code-plugins"
    # "finance-toolkit@wookstar-claude-code-plugins"
    # "ai-toolkit@wookstar-claude-code-plugins"
    # "gtm-suite@wookstar-claude-code-plugins"
    # "ga-suite@wookstar-claude-code-plugins"
    # "shopify-developer@wookstar-claude-code-plugins"
    # "google-apps-ads-script@wookstar-claude-code-plugins"

    # Individual MCP servers
    "mcp-fetch@wookstar-claude-code-plugins"
    # "mcp-google-workspace@wookstar-claude-code-plugins"
    # "mcp-mikrotik@wookstar-claude-code-plugins"
    # "mcp-n8n@wookstar-claude-code-plugins"
    # "mcp-notion@wookstar-claude-code-plugins"
    # "mcp-open-meteo@wookstar-claude-code-plugins"

    # =========================================================================
    # Scientific Skills (claude-scientific-skills)
    # =========================================================================
    "scientific-skills@claude-scientific-skills"

    # =========================================================================
    # Claude Skills (claude-skills) - jezweb/claude-skills
    # NOTE: Some bundled plugins have missing skills - individual plugins work
    # =========================================================================

    # Working individual plugins (not bundles)
    "cloudflare-worker-base@claude-skills"
    "cloudflare-d1@claude-skills"
    "cloudflare-r2@claude-skills"
    "cloudflare-kv@claude-skills"
    "cloudflare-workers-ai@claude-skills"
    "cloudflare-vectorize@claude-skills"
    "cloudflare-queues@claude-skills"
    "cloudflare-workflows@claude-skills"
    "cloudflare-durable-objects@claude-skills"
    "cloudflare-agents@claude-skills"
    "cloudflare-mcp-server@claude-skills"
    "cloudflare-hyperdrive@claude-skills"
    "cloudflare-images@claude-skills"
    "cloudflare-browser-rendering@claude-skills"
    "cloudflare-turnstile@claude-skills"

    # Frontend & UI
    "tailwind-v4-shadcn@claude-skills"
    "react-hook-form-zod@claude-skills"
    "tanstack-query@claude-skills"
    "zustand-state-management@claude-skills"
    "nextjs@claude-skills"
    "hono-routing@claude-skills"

    # AI & LLM
    "claude-api@claude-skills"
    "claude-agent-sdk@claude-skills"

    # Auth
    "clerk-auth@claude-skills"
    "better-auth@claude-skills"

    # CMS
    "tinacms@claude-skills"
    "sveltia-cms@claude-skills"

    # Tooling
    "fastmcp@claude-skills"
    "project-planning@claude-skills"
    "project-session-management@claude-skills"

    # -------------------------------------------------------------------------
    # BUGGY BUNDLES (marketplace.json references non-existent skills)
    # These cause "skills path not found" errors
    # Uncomment if/when the marketplace author fixes them
    # -------------------------------------------------------------------------
    # "cloudflare-skills@claude-skills"      # Missing: cloudflare-sandbox, etc.
    # "frontend-skills@claude-skills"        # Missing: firecrawl-scraper
    # "tooling-skills@claude-skills"         # Missing: gemini-cli, hugo, etc.
    # "ai-skills@claude-skills"              # May have issues
    # "auth-skills@claude-skills"            # May have issues
)

# ============================================================================
# INSTALLATION FUNCTIONS
# ============================================================================

install_marketplaces() {
    print_header "Installing Marketplaces"

    for marketplace_def in "${MARKETPLACES[@]}"; do
        IFS='|' read -r name source_type source_value <<< "$marketplace_def"

        print_info "Adding marketplace: $name"

        # Check if marketplace already exists
        if claude plugin marketplace list 2>/dev/null | grep -q "$name"; then
            print_warning "Marketplace '$name' already exists, updating..."
            claude plugin marketplace update "$name" 2>/dev/null || true
        else
            # Add marketplace based on source type
            case "$source_type" in
                github)
                    claude plugin marketplace add "github:$source_value" 2>/dev/null && \
                        print_success "Added marketplace: $name" || \
                        print_error "Failed to add marketplace: $name"
                    ;;
                git)
                    claude plugin marketplace add "$source_value" 2>/dev/null && \
                        print_success "Added marketplace: $name" || \
                        print_error "Failed to add marketplace: $name"
                    ;;
                *)
                    print_error "Unknown source type: $source_type"
                    ;;
            esac
        fi
    done
}

install_plugins() {
    print_header "Installing Plugins"

    for plugin in "${PLUGINS_TO_ENABLE[@]}"; do
        print_info "Installing: $plugin"
        claude plugin install "$plugin" 2>/dev/null && \
            print_success "Installed: $plugin" || \
            print_warning "Could not install: $plugin (may already exist or have issues)"
    done
}

show_summary() {
    print_header "Installation Complete"

    echo "Installed Marketplaces:"
    claude plugin marketplace list 2>/dev/null || echo "  (run 'claude plugin marketplace list' to see)"

    echo ""
    echo "To see installed plugins:"
    echo "  claude plugin list"
    echo ""
    echo "To enable/disable plugins:"
    echo "  claude plugin enable <plugin-name>@<marketplace>"
    echo "  claude plugin disable <plugin-name>@<marketplace>"
    echo ""
    echo "To update marketplaces:"
    echo "  claude plugin marketplace update <marketplace-name>"
    echo ""

    print_warning "Note: Some plugins from 'claude-skills' marketplace have bugs"
    echo "      (missing skill files). Avoid bundled plugins like:"
    echo "      - cloudflare-skills, frontend-skills, tooling-skills"
    echo "      Use individual plugins instead."
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    print_header "Claude Code Plugin Installer"
    echo "This script will install marketplaces and plugins for Claude Code."
    echo ""

    # Pre-flight checks
    check_claude_installed
    ensure_claude_dir

    # Install
    install_marketplaces
    install_plugins

    # Summary
    show_summary
}

# Run main function
main "$@"
