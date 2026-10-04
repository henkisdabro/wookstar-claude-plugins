# Tampermonkey

Write Tampermonkey userscripts for browser automation, page modification, and web enhancement with Claude Code.

## What's Included

### Skills (1)

- **tampermonkey** - Userscript development guide with API reference. Claude loads it automatically only while working with `*.user.js` files; elsewhere, invoke it with `/tampermonkey`.

## Installation

```bash
/plugin install tampermonkey@wookstar-claude-plugins
```

## Coverage

- **Userscript headers** - @match, @grant, @require, @resource
- **GM_* APIs** - Storage, XHR, styling, notifications
- **DOM manipulation** - Page modification patterns
- **Cross-origin requests** - GM_xmlhttpRequest usage
- **Value storage** - GM_setValue/getValue persistence
- **UI injection** - Adding custom interfaces to pages

## Usage Examples

```bash
# Page enhancement
"Write a userscript to add dark mode to a website"

# Automation
"Create a script that auto-fills forms on a specific site"

# Data extraction
"Build a userscript to scrape and export data from a web page"
```

## Reference Materials

The skill includes 19 reference files covering:

- All Tampermonkey APIs and their usage
- Greasemonkey compatibility
- Security best practices
- Cross-browser considerations, including the Chrome/Edge "Allow User Scripts" permission that Manifest V3 requires before any script runs
