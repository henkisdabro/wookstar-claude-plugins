# Shopify Developer Toolkit

Complete Shopify development reference for building custom themes, headless storefronts, and Shopify apps - API version **2026-01**.

## Overview

Single unified skill with a lean router SKILL.md and 11 reference files loaded on demand via progressive disclosure. Covers Liquid templating, theme development (OS 2.0), GraphQL/REST APIs, custom app development, Shopify Functions, Hydrogen, performance optimisation, and debugging.

## Architecture

```
plugins/shopify-developer/
├── .claude-plugin/plugin.json
├── README.md
└── skills/
    └── shopify-developer/
        ├── SKILL.md                    # Router (~130 lines)
        └── references/
            ├── liquid-syntax.md        # Tags, control flow, iteration, LiquidDoc
            ├── liquid-filters.md       # All filter categories
            ├── liquid-objects.md       # Shopify objects and properties
            ├── theme-development.md   # OS 2.0, sections, blocks, settings schema
            ├── api-admin.md           # GraphQL Admin, REST (legacy), OAuth, webhooks
            ├── api-storefront.md      # Storefront API, Ajax API, cart operations
            ├── app-development.md     # CLI, extensions, Polaris Web Components
            ├── functions.md           # Shopify Functions (replacing Scripts)
            ├── hydrogen.md            # Hydrogen + React Router 7
            ├── performance.md         # Images, JS, CSS, fonts, Core Web Vitals
            └── debugging.md           # Troubleshooting for Liquid, JS, API, webhooks
```

## How It Works

1. **Auto-invocation**: The single skill triggers on any Shopify-related prompt
2. **Router loads first**: The lean SKILL.md (~130 lines) provides essentials and routing
3. **References on demand**: Claude reads specific reference files only when needed
4. **Reduced token usage**: No unnecessary content loaded for unrelated subtopics

## Coverage

| Area | Reference File | Key Topics |
|------|---------------|------------|
| Liquid | liquid-syntax, liquid-filters, liquid-objects | Tags, filters, objects, LiquidDoc |
| Themes | theme-development | OS 2.0, sections, blocks, JSON templates, settings schema |
| Admin API | api-admin | GraphQL (primary), REST (legacy), OAuth, webhooks, rate limiting |
| Storefront | api-storefront | Storefront API, Ajax API, Customer Account API |
| Apps | app-development | Shopify CLI, React Router 7, Polaris Web Components, extensions |
| Functions | functions | Wasm runtime, Rust/JS targets, Scripts migration |
| Hydrogen | hydrogen | Headless storefronts, React Router 7, Oxygen deployment |
| Performance | performance | Images, JS, CSS, fonts, Liquid, Core Web Vitals |
| Debugging | debugging | Liquid errors, API errors, cart issues, webhook failures |

## What's New in v2.0.0

- **Consolidated architecture**: 6 separate skills merged into 1 unified skill
- **Progressive disclosure**: Lean router + 11 reference files loaded on demand
- **API version 2026-01**: All examples updated to latest stable API
- **Shopify Functions**: New reference covering Wasm-based backend logic
- **Hydrogen**: New reference for headless storefronts with React Router 7
- **Polaris Web Components**: Updated from Polaris React to `<ui-*>` elements
- **LiquidDoc**: Documentation format for snippet parameters
- **Deprecation notices**: Scripts, checkout.liquid, REST API, legacy custom apps

## Installation

```bash
/plugin install shopify-developer@wookstar-claude-plugins
```

## Prerequisites

- Basic knowledge of HTML, CSS, and JavaScript
- Shopify Partner account (for app development)
- Shopify CLI (`npm install -g @shopify/cli`)
- Node.js 22+ (for app development)

## Key Resources

- [Shopify Developer Docs](https://shopify.dev/)
- [Liquid Reference](https://shopify.dev/docs/api/liquid)
- [GraphQL Admin API](https://shopify.dev/docs/api/admin-graphql)
- [Storefront API](https://shopify.dev/docs/api/storefront)
- [Hydrogen](https://hydrogen.shopify.dev/)
- [Polaris](https://polaris.shopify.com/)

## Version

Current version: **2.0.0**

## Category

Development / E-commerce

---

**Created by:** Henrik Soederlund ([@henkisdabro](https://github.com/henkisdabro))
**Part of:** Claude Code Plugin Marketplace
