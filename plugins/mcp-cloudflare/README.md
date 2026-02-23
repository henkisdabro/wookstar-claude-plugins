# Cloudflare API (MCP)

Official Cloudflare MCP server covering the entire Cloudflare API - 2,500+ endpoints exposed through just 2 tools using Code Mode, consuming only ~1k tokens of context.

## What's Included

- **cloudflare-api** - Official Cloudflare MCP server with full API coverage via Code Mode

## How It Works

This server uses Cloudflare's Code Mode pattern rather than traditional per-endpoint MCP tools. Instead of registering thousands of individual tool schemas (which would consume 585% of a 200k context window), Code Mode exposes just 2 tools at ~1k tokens total - a 1000x reduction. The server generates the correct API calls on demand.

## Capabilities

Covers the entire Cloudflare API surface (2,500+ endpoints), including:

- Workers - deploy and manage serverless functions
- Pages - static site and full-stack deployments
- D1 - serverless SQL databases
- KV - key-value storage
- R2 - object storage
- DNS - zone and record management
- Zones - domain configuration
- WAF, Load Balancing, Tunnels, Images, Stream, and everything else in the Cloudflare platform

## Installation

```bash
/plugin install mcp-cloudflare@wookstar-claude-plugins
```

## Authentication

Uses OAuth authentication. On first use, you will be prompted to authenticate through your browser.

## Usage Examples

```bash
# Manage Workers
"List my Cloudflare Workers"
"Deploy this script to Cloudflare Workers"

# Database operations
"Create a new D1 database called my-app-db"
"Run this SQL query on my D1 database"

# DNS management
"List DNS records for example.com"
"Add an A record for api.example.com"

# Storage
"Create a new R2 bucket for uploads"
"List objects in my KV namespace"

# Any Cloudflare API endpoint
"Show my Cloudflare Tunnel configurations"
"List WAF rules for my zone"
```
