# MCP Open-Meteo

Weather and climate data from Open-Meteo API.

## What it can do

Seventeen read-only tools over the free Open-Meteo APIs: forecasts (global, plus the national models from DWD, NOAA, Meteo-France, ECMWF, JMA, MET Norway and Canada), historical weather, air quality, marine conditions, flood forecasts, seasonal and ensemble forecasts, climate projections, elevation and place-name lookup. It needs no key and changes nothing.

Try: *"What is the swell and wind forecast for Bondi Beach this weekend?"* or *"How did last July's rainfall in Auckland compare with the ten-year average?"*

## Installation

```bash
/plugin install mcp-open-meteo@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install mcp-open-meteo --marketplace henkisdabro/wookstar-claude-plugins`

## Description

Provides access to weather forecasts, air quality data, marine data, historical weather archives, seasonal forecasts, ensemble predictions, and geocoding.

## Configuration

No API key required. Uses the free Open-Meteo API endpoints.

Uses `npx open-meteo-mcp-server` command.
