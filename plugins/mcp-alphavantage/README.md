# MCP AlphaVantage

Stock market data, company information and financial indicators via Alpha Vantage's hosted MCP server.

## What it can do

Alpha Vantage's hosted server: stock, ETF, FX and crypto time series, company fundamentals, earnings, news sentiment, economic indicators and technical indicators. It is read-only, and requests count against your Alpha Vantage plan's rate limit.

The server lists about 120 tools - one per Alpha Vantage API function, over 50 of them technical indicators - plus three legacy discovery tools. It offers no way to load fewer: its `?categories=` filter was removed in 0.3.0. Every session with the plugin enabled carries all those names, so disable it when you are not doing market research.

Try: *"Compare the last five years of revenue and free cash flow for two companies, from their filings data."*

## Installation

```bash
/plugin install mcp-alphavantage@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install mcp-alphavantage --marketplace henkisdabro/wookstar-claude-plugins`

## Authentication

The server uses OAuth. On first use, run `/mcp`, select `alphavantage` and complete the browser sign-in. No API key sits in your config or shell environment.

Since 2.0.0 the `ALPHAVANTAGEAPIKEY` environment variable is no longer read - it used to travel in the URL query string, where proxies and logs could capture it. You can unset it.
