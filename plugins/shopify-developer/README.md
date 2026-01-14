# Shopify Developer Toolkit

Professional Shopify development toolkit with specialized skills for Liquid templating, theme customization, API integration, app development, and performance optimization.

## Overview

Complete toolkit for Shopify developers covering theme development, Liquid templating language, Shopify APIs (GraphQL/REST), custom app development, performance optimization, and debugging. Whether you're building custom themes, developing apps, or optimizing existing stores, this toolkit provides expert guidance for professional Shopify development.

## Status: Production Ready (v1.0.0)

This toolkit includes 6 comprehensive skills covering all aspects of Shopify development.

## Included Skills

### 1. **shopify-liquid** - Liquid Templating Language

Complete Liquid templating reference including syntax, filters, objects, control flow, loops, and conditionals.

**Use when:**
- Working with .liquid files
- Creating theme templates
- Implementing dynamic content
- Using Liquid filters to format data
- Accessing Shopify objects (product, collection, cart, customer)
- Debugging Liquid syntax errors

**Key Features:**
- Output, logic, and assignment syntax
- Control flow and conditionals
- Iteration and loops
- Essential filters (money, strings, arrays, dates, images)
- Key Shopify objects (product, collection, cart, customer)
- Template inclusion patterns

### 2. **shopify-theme-dev** - Theme Development

Theme development and customization including file structure, sections, snippets, and Dawn theme patterns.

**Use when:**
- Building custom Shopify themes
- Modifying existing themes
- Working with theme sections and blocks
- Implementing JSON templates
- Using Shopify CLI for theme development
- Customizing Dawn or other themes

**Key Features:**
- Theme file structure and organization
- Sections and snippets architecture
- JSON templates and schema
- Theme settings and configuration
- Shopify CLI workflow
- Dawn theme best practices

### 3. **shopify-api** - API Integration

GraphQL and REST API integration for Shopify stores including Admin API, Storefront API, and webhooks.

**Use when:**
- Integrating with Shopify Admin API
- Building headless storefronts with Storefront API
- Implementing custom checkout experiences
- Working with webhooks
- Bulk operations and data sync
- OAuth and API authentication

**Key Features:**
- GraphQL Admin API queries and mutations
- Storefront API for headless commerce
- REST API endpoints and methods
- Webhook setup and handling
- OAuth authentication flow
- Rate limiting and best practices

### 4. **shopify-app-dev** - Custom App Development

Custom Shopify app development including embedded apps, OAuth, App Bridge, and Polaris components.

**Use when:**
- Building custom Shopify apps
- Creating embedded admin apps
- Implementing OAuth authentication
- Using App Bridge for embedded experiences
- Designing with Polaris UI components
- Deploying apps to Shopify App Store

**Key Features:**
- Shopify App CLI setup
- Embedded app architecture
- OAuth and session management
- App Bridge integration
- Polaris component library
- App Store submission guidelines

### 5. **shopify-performance** - Performance Optimization

Speed and Core Web Vitals optimization for Shopify stores including image optimization, JavaScript, CSS, and liquid performance.

**Use when:**
- Optimizing page load times
- Improving Core Web Vitals scores
- Reducing JavaScript and CSS bloat
- Implementing lazy loading
- Optimizing Liquid code performance
- Improving mobile performance

**Key Features:**
- Core Web Vitals optimization (LCP, FID, CLS)
- Image optimization strategies
- JavaScript and CSS minification
- Liquid code optimization
- Lazy loading patterns
- Performance monitoring tools

### 6. **shopify-debugging** - Troubleshooting & Testing

Debugging tools and techniques for Shopify theme and app development including theme check, console debugging, and testing strategies.

**Use when:**
- Debugging Liquid template errors
- Troubleshooting JavaScript issues
- Testing theme changes
- Using Shopify CLI for debugging
- Inspecting network requests
- Validating theme code

**Key Features:**
- Theme Check linting tool
- Browser developer tools
- Liquid error debugging
- JavaScript console debugging
- Network request inspection
- Testing workflows

## Installation

```bash
/plugin install shopify-developer@wookstar
```

This installs all 6 Shopify development skills as a complete toolkit.

## Common Workflows

### Building a Custom Theme

1. **shopify-theme-dev** - Set up theme structure and sections
2. **shopify-liquid** - Implement dynamic templates with Liquid
3. **shopify-performance** - Optimize for speed and Core Web Vitals
4. **shopify-debugging** - Test and debug theme implementation

### Creating a Headless Storefront

1. **shopify-api** - Set up Storefront API integration
2. **shopify-liquid** - Reference Shopify objects and data structures
3. **shopify-performance** - Implement performance best practices
4. **shopify-debugging** - Test API integration and data flow

### Developing a Custom App

1. **shopify-app-dev** - Set up app structure and OAuth
2. **shopify-api** - Integrate with Admin API
3. **shopify-debugging** - Test app functionality
4. **shopify-performance** - Optimize app performance

## Prerequisites

- Basic knowledge of HTML, CSS, and JavaScript
- Shopify Partner account (for app development)
- Shopify CLI installed (recommended)
- Node.js and npm/yarn (for app development)
- Familiarity with Liquid templating (for theme development)

## Environment Setup

### Shopify CLI Installation

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Authenticate
shopify auth login

# Start development
shopify theme dev --store your-store.myshopify.com
```

### Required Tools

- **Shopify CLI** - Theme and app development
- **Node.js** - App development and build tools
- **Git** - Version control
- **Code Editor** - VS Code with Liquid extension recommended

## Key Resources

**Official Documentation:**
- [Shopify Developer Docs](https://shopify.dev/)
- [Liquid Reference](https://shopify.dev/docs/api/liquid)
- [Theme Development](https://shopify.dev/docs/themes)
- [App Development](https://shopify.dev/docs/apps)
- [Storefront API](https://shopify.dev/docs/api/storefront)
- [Admin API](https://shopify.dev/docs/api/admin)

**Developer Tools:**
- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli)
- [Theme Check](https://shopify.dev/docs/themes/tools/theme-check)
- [Polaris](https://polaris.shopify.com/) - Shopify's design system
- [App Bridge](https://shopify.dev/docs/apps/tools/app-bridge)

## Support and Community

- **Shopify Community** - community.shopify.com
- **GitHub** - github.com/Shopify
- **Discord** - Shopify Devs Discord server

## Version

Current version: **1.0.0**

## Category

Development / E-commerce

---

**Created by:** Henrik Soederlund ([@henkisdabro](https://github.com/henkisdabro))
**Part of:** Claude Code Plugin Marketplace
**License:** Follow Shopify's terms of service for API usage
