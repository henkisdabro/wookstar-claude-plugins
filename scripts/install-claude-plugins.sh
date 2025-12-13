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
# Format: "marketplace_name|source"
# Source can be: owner/repo (GitHub) or full URL (git)
MARKETPLACES=(
    "claude-code-plugins|anthropics/claude-code"
    "wookstar-claude-code-plugins|henkisdabro/wookstar-claude-code-plugins"
    "claude-scientific-skills|K-Dense-AI/claude-scientific-skills"
    "claude-skills|https://github.com/jezweb/claude-skills.git"
)

# ============================================================================
# PLUGIN DEFINITIONS
# ============================================================================

# Plugins to enable after installation
# Format: "plugin_name@marketplace_name"
#
# NOTE: The claude-skills marketplace (jezweb) is currently broken.
# It only offers bundled plugins that reference non-existent skill files.
# Individual plugins no longer exist - only bundles with missing paths.
# All claude-skills plugins are disabled until the maintainer fixes them.

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
    # Toolkits (disabled by default - enable as needed)
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
    # STATUS: BROKEN - All bundles reference non-existent skill paths
    # Individual plugins no longer exist, only bundles which have bugs
    # Check https://github.com/jezweb/claude-skills for updates
    # =========================================================================
    # "cloudflare-skills@claude-skills"   # BROKEN: Missing cloudflare-sandbox, etc.
    # "ai-skills@claude-skills"           # BROKEN: Missing thesys-generative-ui, etc.
    # "frontend-skills@claude-skills"     # BROKEN: Missing firecrawl-scraper
    # "auth-skills@claude-skills"         # BROKEN: May have issues
    # "cms-skills@claude-skills"          # BROKEN: May have issues
    # "tooling-skills@claude-skills"      # BROKEN: Missing gemini-cli, hugo, etc.
)

# ============================================================================
# INSTALLATION FUNCTIONS
# ============================================================================

install_marketplaces() {
    print_header "Installing Marketplaces"

    for marketplace_def in "${MARKETPLACES[@]}"; do
        IFS='|' read -r name source <<< "$marketplace_def"

        print_info "Adding marketplace: $name"

        # Check if marketplace already exists
        if claude plugin marketplace list 2>/dev/null | grep -q "$name"; then
            print_warning "Marketplace '$name' already exists, updating..."
            claude plugin marketplace update "$name" 2>/dev/null || true
        else
            # Add marketplace (source can be owner/repo or full URL)
            if claude plugin marketplace add "$source" 2>/dev/null; then
                print_success "Added marketplace: $name"
            else
                print_error "Failed to add marketplace: $name"
            fi
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

    print_warning "Note: The 'claude-skills' marketplace (jezweb) is currently broken"
    echo "      All bundles reference non-existent skill files."
    echo "      The marketplace is installed but no plugins are enabled."
    echo "      Check https://github.com/jezweb/claude-skills for updates."
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
