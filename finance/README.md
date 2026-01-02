# Finance Toolkit

Real-time financial market data for stocks and cryptocurrencies.

## What's Included

### MCP Servers (3)
- **alphavantage** - Stock market data, company information, financial indicators
- **coingecko** - Cryptocurrency prices, market data, historical trends
- **currency-conversion** - Real-time currency exchange rates and conversion (no API key required)

## Installation

```bash
/plugin install finance-toolkit@wookstar
```

## Required Environment Variables

Create a `.env` file in your project root:

```bash
# AlphaVantage (required)
ALPHAVANTAGEAPIKEY=your_key_here

# CoinGecko (required)
COINGECKO_DEMO_API_KEY=your_key_here
```

## API Keys

- **AlphaVantage**: Get free API key at https://www.alphavantage.co/support/#api-key
- **CoinGecko**: Get demo API key at https://www.coingecko.com/en/api

## Usage Examples

```bash
# Stock market queries
"What's the current price of AAPL?"
"Show me Tesla's stock performance this month"
"Get quarterly earnings for Microsoft"

# Cryptocurrency queries
"What's the Bitcoin price?"
"Compare Ethereum and Solana market caps"
"Show me top 10 cryptocurrencies by volume"
"Track Cardano's price over the last week"
```

## When to Use

This toolkit is ideal for:
- Financial analysis and research
- Stock portfolio tracking
- Cryptocurrency market monitoring
- Investment research
- Market trend analysis
- Building financial dashboards
