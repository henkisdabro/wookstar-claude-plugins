# MCP Perplexity

Perplexity AI-powered search and information retrieval.

## What it can do

Four tools: `perplexity_search` (ranked web results), `perplexity_ask` (a cited answer), `perplexity_research` (a longer multi-source report) and `perplexity_reason` (step-by-step reasoning over sources). All are read-only, and each call is billed to your Perplexity API key - research calls cost the most.

Try: *"Use Perplexity to research what changed in the EU's cookie consent guidance this year, with sources."*

## Installation

```bash
/plugin install mcp-perplexity@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install mcp-perplexity --marketplace henkisdabro/wookstar-claude-plugins`

Claude Code prompts for your Perplexity API key when you enable the plugin and stores it in your system keychain. Get a key at https://www.perplexity.ai/settings/api.

Since 2.0.0 the `PERPLEXITY_API_KEY` shell variable is no longer read - enter the key at the prompt instead.
