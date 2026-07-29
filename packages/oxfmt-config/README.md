# @area44/oxfmt-config

Shareable [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) configuration for AREA44.

An ultra-fast, Prettier-compatible formatting standard designed to align with official **Oxc** guidelines and the **Ultracite** formatter settings.

## Installation

```bash
pnpm add -D oxfmt @area44/oxfmt-config
```

## Usage

Depending on your toolchain, you can integrate this configuration using the spread operator for TypeScript/ESM formats, unified Vite+/Ultracite configurations, or JSON format.

### 1. Unified Vite.config.ts (Vite+ / Ultracite Model)

If you are using **Vite+** or **Ultracite**, define your formatting configurations directly under the `fmt` block in `vite.config.ts`:

```typescript
import { defineConfig } from "vite-plus";
import oxfmtConfig from "@area44/oxfmt-config";

export default defineConfig({
  fmt: {
    ...oxfmtConfig,
  },
});
```

### 2. TypeScript / ES Module Format (Oxfmt 1.x+)

> ⚠️ **Note**: Oxfmt does not natively support the `extends` property in its configuration schema. When using JS/TS config files, inherited configurations should be composed using the ES6 spread operator (`...`).

In your `oxfmt.config.mjs` or `oxfmt.config.ts`:

```typescript
import { defineConfig } from "oxfmt";
import oxfmtConfig from "@area44/oxfmt-config";

export default defineConfig({
  ...oxfmtConfig,
  // Add project-specific formatter overrides here
});
```

### 3. JSON Format

Oxfmt automatically searches for configurations upward. To use the pre-compiled JSON settings, copy or link `.oxfmtrc.json` or configure your editor settings:

For VS Code configuration:

```json
{
  "oxc.fmt.configPath": "./node_modules/@area44/oxfmt-config/.oxfmtrc.json"
}
```

---

## Aligning with Ultracite Settings

This configuration matches Ultracite's standard formatting defaults:

- **Indentation**: 2 spaces (`tabWidth: 2`, `useTabs: false`)
- **Semicolons**: Required
- **Quotes**: Double quotes
- **Trailing Commas**: ES5 style
- **Arrow Parentheses**: Always include
