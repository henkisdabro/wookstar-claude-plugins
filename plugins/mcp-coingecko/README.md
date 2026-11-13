# MCP CoinGecko

Cryptocurrency prices, market data and historical trends via CoinGecko (read-only tools).

## What it can do

The server runs in code mode: two tools, `search_docs` to look up the CoinGecko API and `execute` to run a request against it. This plugin limits it to read operations on coins, global market data, search and simple prices, so it cannot change anything. A demo key is rate-limited by CoinGecko.

Try: *"What are the top ten coins by market cap today, and their 7-day change?"*

## Installation

```bash
/plugin install mcp-coingecko@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install mcp-coingecko --marketplace henkisdabro/wookstar-claude-plugins`

Claude Code prompts for your CoinGecko demo API key when you enable the plugin and stores it in your system keychain. Get a free demo key at https://www.coingecko.com/en/api.

Since 2.0.0 the `COINGECKO_DEMO_API_KEY` shell variable is no longer read - enter the key at the prompt instead.
