---
name: shopify-developer
description: Shopify theme, Liquid, Hydrogen and app development reference, with live API lookups handed to Shopify's own tooling. Use when editing .liquid files, building OS 2.0 sections, blocks or JSON templates, wiring theme cart behaviour with the Ajax API, speeding up a slow Shopify storefront, debugging Liquid or theme editor errors, building or upgrading a Hydrogen storefront, scaffolding a Shopify app or extension, writing Shopify Functions, or picking a Shopify API version. Do NOT use for WooCommerce, Magento, BigCommerce or other platforms - answer from general knowledge; Do NOT use for exact GraphQL field or schema lookups - use the shopify-ai-toolkit plugin or @shopify/dev-mcp.
---

# Shopify Developer

Knowledge for Liquid themes, Hydrogen and Shopify apps. Exact API schemas change every quarter, so this skill carries orientation and gotchas; Shopify's own tooling carries the live schema.

## Workflow

1. **Pick the branch** from the table below and read only those reference files. Done when you have read every file the task's branch lists.
2. **Pin the API version.** Any code that names a version (`api_version` in a TOML file, an endpoint URL, `ApiVersion.*`) takes the latest stable version from <https://shopify.dev/docs/api/usage/versioning>, or the version the project already pins if the task is not an upgrade. Done when every version string you write was read from that page or the project, never from memory.
3. **Validate against the live schema** when the change touches GraphQL (Admin, Storefront, Customer Account, Function input queries) or Liquid you are unsure of: use the `shopify-ai-toolkit` plugin or `@shopify/dev-mcp` (setup below). If neither is installed, tell the user, give them the install command, and mark the GraphQL as unvalidated. Done when each query or mutation was validated, or flagged as unvalidated in your reply.
4. **Run the project's own check** - `shopify theme check` for themes, `shopify app build` or the project's typecheck for apps and Hydrogen. Done when it passes or the remaining failures are reported.

## Branches

| Task | Read |
|------|------|
| Writing or fixing `.liquid` | [liquid-syntax.md](references/liquid-syntax.md), then [liquid-filters.md](references/liquid-filters.md) or [liquid-objects.md](references/liquid-objects.md) as needed |
| Sections, blocks, JSON templates, settings schema, theme structure | [theme-development.md](references/theme-development.md) |
| Theme cart (`/cart/*.js`), calling any Shopify API, rate limits, webhooks | [api.md](references/api.md) |
| Slow storefront, Core Web Vitals, image sizing | [performance.md](references/performance.md) |
| Something broken: Liquid errors, theme editor, cart, API or webhook failures | [debugging.md](references/debugging.md) |
| Headless storefront, Hydrogen upgrade, Oxygen | [hydrogen.md](references/hydrogen.md) |
| New or existing Shopify app, extensions, admin UI | [app-development.md](references/app-development.md) |
| Discounts, delivery/payment customisation, cart validation, anything that used to be a Script | [functions.md](references/functions.md) |

## Live schema and docs: Shopify's tooling

For field names, argument shapes, deprecations and validation, defer to Shopify's official tooling instead of the reference files:

```bash
# Claude Code plugin (skills plus the Dev MCP server)
claude plugin install shopify-ai-toolkit@claude-plugins-official

# Dev MCP server on its own
claude mcp add --transport stdio shopify-dev-mcp -- npx -y @shopify/dev-mcp@latest
```

Both validate GraphQL against Shopify's schemas and validate Liquid. Check <https://shopify.dev/docs/apps/build/devmcp> if a command fails - the install line is Shopify's to change.

## API versioning rule

Shopify releases an API version every quarter, named `YYYY-01`, `YYYY-04`, `YYYY-07`, `YYYY-10`, each supported for at least 12 months. A request for an unsupported version is served by the oldest supported one, which silently changes behaviour. There is no permanent "current" version to remember: look it up at <https://shopify.dev/docs/api/usage/versioning> each time.

## Retired platform features

| Gone | Use instead |
|------|-------------|
| Shopify Scripts - stopped executing 30 June 2026 | Shopify Functions ([functions.md](references/functions.md)) |
| `checkout.liquid` | Checkout UI extensions and Functions |
| REST Admin API for new work | GraphQL Admin API |
| Polaris React (`@shopify/polaris`, deprecated on npm) | Polaris web components (`<s-page>`, `<s-button>`) |
| Shopify Remix app template | React Router app template (`@shopify/shopify-app-react-router`) |
| `img_url` filter | `image_url` plus `image_tag` |
| `{% include %}` | `{% render %}` |

## Liquid at a glance

```liquid
{{ product.title | escape }}
{%- if product.available -%}In stock{%- endif -%}
{% render 'product-card', product: product %}
{{ product.featured_image | image_url: width: 800 | image_tag: loading: 'lazy' }}
```
