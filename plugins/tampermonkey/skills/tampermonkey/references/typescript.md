# TypeScript Userscript Development

Writing Tampermonkey userscripts in TypeScript with full type safety.

---

## Setup

### Install Type Definitions

```bash
npm install --save-dev @types/tampermonkey
# or
pnpm add -D @types/tampermonkey
```

Current version: `@types/tampermonkey@5.0.5` (updated October 2025, maintained on DefinitelyTyped).

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "types": ["tampermonkey"],
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"]
}
```

---

## Bundler Setup

Tampermonkey requires a single `.user.js` file. Use a bundler to compile TypeScript into one output.

### esbuild (recommended - fastest)

```bash
pnpm add -D esbuild
```

```json
// package.json
{
  "scripts": {
    "build": "esbuild src/index.ts --bundle --outfile=dist/script.user.js --platform=browser",
    "watch": "esbuild src/index.ts --bundle --outfile=dist/script.user.js --platform=browser --watch"
  }
}
```

### Vite with vite-plugin-monkey

```bash
pnpm add -D vite vite-plugin-monkey
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'My Script',
        namespace: 'https://example.com/',
        match: ['https://example.com/*'],
        grant: ['GM.getValue', 'GM.setValue'],
      },
    }),
  ],
});
```

---

## Writing TypeScript Userscripts

### Full Template

```typescript
// ==UserScript==
// @name         My TypeScript Script
// @namespace    https://example.com/scripts/
// @version      1.0.0
// @description  Brief description
// @author       Your Name
// @match        https://example.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @connect      api.example.com
// @run-at       document-idle
// ==/UserScript==

(async () => {
    'use strict';

    // GM_info is always available, no @grant needed
    const info: Tampermonkey.ScriptInfo = GM_info;
    console.log('Script version:', info.script.version);

    // Type-safe storage
    const theme = await GM.getValue<string>('theme', 'dark');
    await GM.setValue('lastRun', Date.now());

    // Type-safe HTTP request
    const response = await GM.xmlHttpRequest({
        method: 'GET',
        url: 'https://api.example.com/data',
    });
    const data: ApiResponse = JSON.parse(response.responseText);
})();

interface ApiResponse {
    items: string[];
    total: number;
}
```

### Key Type Definitions

```typescript
// Script info
GM_info: Tampermonkey.ScriptInfo
GM_info.script: Tampermonkey.ScriptMetaStr
GM_info.sandboxMode: 'raw' | 'javascript' | 'dom'

// Storage (generic type parameter)
GM.getValue<T>(key: string, defaultValue: T): Promise<T>
GM.setValue<T>(key: string, value: T): Promise<void>
GM.getValues<T extends Record<string, unknown>>(defaults: T): Promise<T>
GM.setValues(values: Record<string, unknown>): Promise<void>

// HTTP request
GM.xmlHttpRequest(details: Tampermonkey.Request): Promise<Tampermonkey.Response<unknown>>

// Notification
GM.notification(details: Tampermonkey.NotificationDetails): Promise<boolean>
```

---

## Handling the Userscript Header in TypeScript

The `// ==UserScript==` block must appear in the final compiled output. With most bundlers, put it as a comment at the top of your entry file - esbuild and Vite preserve leading comments.

Alternatively, use `vite-plugin-monkey` or `webpack-tampermonkey` which inject the header automatically from configuration.

---

## Common TypeScript Patterns

### Type-Safe Settings Object

```typescript
interface Settings {
    theme: 'light' | 'dark';
    fontSize: number;
    enabled: boolean;
}

const defaultSettings: Settings = {
    theme: 'dark',
    fontSize: 14,
    enabled: true,
};

// Load all settings at once (v5.3+)
const settings = await GM.getValues<Settings>(defaultSettings);
```

### Type-Safe Cross-Origin Fetch

```typescript
async function fetchJson<T>(url: string): Promise<T> {
    const response = await GM.xmlHttpRequest({
        method: 'GET',
        url,
        responseType: 'json',
    });
    return response.response as T;
}

interface User {
    id: number;
    name: string;
}

const user = await fetchJson<User>('https://api.example.com/user/1');
console.log(user.name);
```

### DOM Utilities with Types

```typescript
function waitForElement<T extends Element>(selector: string, timeout = 10000): Promise<T> {
    return new Promise((resolve, reject) => {
        const el = document.querySelector<T>(selector);
        if (el) return resolve(el);

        const observer = new MutationObserver((_, obs) => {
            const found = document.querySelector<T>(selector);
            if (found) {
                obs.disconnect();
                resolve(found);
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Timeout: ${selector}`));
        }, timeout);
    });
}

// Usage with type inference
const button = await waitForElement<HTMLButtonElement>('#submit-btn');
button.click();
```

---

## Notes

- The `@types/tampermonkey` package covers both GM_* and GM.* APIs
- `GM_info` is typed as `Tampermonkey.ScriptInfo` and available without `@grant`
- For `unsafeWindow`, cast carefully: `(unsafeWindow as Window & { myLib: MyLib }).myLib`
- When using `@grant none`, the sandbox is disabled and `GM_*` functions are unavailable — TypeScript won't catch this at compile time
