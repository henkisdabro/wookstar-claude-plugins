# Shopify Developer

Shopify reference for Liquid, Online Store 2.0 themes, theme performance, debugging, Hydrogen, apps and Functions. Live API work - exact GraphQL fields, schema lookups, query and Liquid validation - is handed to Shopify's official tooling, which tracks each quarterly API release.

## Installation

```bash
/plugin install shopify-developer@wookstar-claude-plugins
```

Recommended alongside it, for live schema and validation:

```bash
claude plugin install shopify-ai-toolkit@claude-plugins-official
# or just the MCP server
claude mcp add --transport stdio shopify-dev-mcp -- npx -y @shopify/dev-mcp@latest
```

Current setup instructions: <https://shopify.dev/docs/apps/build/devmcp>.

## How it works

One skill, `shopify-developer`, with a short SKILL.md that routes each task to the reference files it needs.

The skill never names an API version as current. Shopify releases one every quarter (`YYYY-01/04/07/10`), each supported for at least 12 months, and the skill looks up the latest stable at <https://shopify.dev/docs/api/usage/versioning> whenever code needs one.

```
skills/shopify-developer/
├── SKILL.md
└── references/
    ├── liquid-syntax.md       # Tags, control flow, iteration, LiquidDoc
    ├── liquid-filters.md      # Filter catalogue, including image_url / image_tag
    ├── liquid-objects.md      # Shopify objects and properties
    ├── theme-development.md   # OS 2.0, sections, blocks, JSON templates, settings schema
    ├── performance.md         # Images, JS, CSS, fonts, Core Web Vitals
    ├── debugging.md           # Symptom tables: Liquid, theme editor, cart, GraphQL, webhooks, Hydrogen
    ├── api.md                 # API orientation: versioning, cost limits, webhooks, Ajax cart API
    ├── app-development.md     # React Router app template, Polaris web components, extensions
    ├── functions.md           # Function APIs, limits, CLI workflow, rebuilding retired Scripts
    └── hydrogen.md            # Hydrogen on React Router 7, 2026.4 upgrade notes, Oxygen
```

## Coverage notes

- **Shopify Scripts** stopped executing on 30 June 2026; Functions are the only path.
- **Hydrogen 2026.4** made the Storefront API proxy mandatory and switched consent to backend mode, replacing the `_tracking_consent` cookie.
- **Apps** start from the React Router template (`@shopify/shopify-app-react-router`); the admin UI uses Polaris web components (`s-` elements), as Polaris React is deprecated.
- **Images** use `image_url` and `image_tag`; `img_url` is deprecated.

## Key resources

- [Shopify developer docs](https://shopify.dev/)
- [API versioning](https://shopify.dev/docs/api/usage/versioning)
- [Liquid reference](https://shopify.dev/docs/api/liquid)
- [Hydrogen changelog](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/CHANGELOG.md)
- [Polaris web components](https://shopify.dev/docs/api/app-home/polaris-web-components)

---

**Created by:** [@henkisdabro](https://github.com/henkisdabro)
