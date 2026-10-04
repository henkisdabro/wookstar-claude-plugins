# MCP AlphaVantage

Stock market data, company information and financial indicators via Alpha Vantage's hosted MCP server.

## Installation

```bash
/plugin install mcp-alphavantage@wookstar-claude-plugins
```

## Authentication

The server uses OAuth. On first use, run `/mcp`, select `alphavantage` and complete the browser sign-in. No API key sits in your config or shell environment.

Since 2.0.0 the `ALPHAVANTAGEAPIKEY` environment variable is no longer read - it used to travel in the URL query string, where proxies and logs could capture it. You can unset it.
