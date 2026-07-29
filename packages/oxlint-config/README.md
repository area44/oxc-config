# @area44/oxlint-config

Shareable [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) configuration for AREA44.

Optimized for speed and high-signal correctness, fully compatible with the official **Oxc** documents and **Ultracite** zero-config standards.

## Installation

```bash
pnpm add -D oxlint @area44/oxlint-config
```

## Usage

Depending on your toolchain, you can integrate this configuration using JSON, TypeScript/ESM, or unified Vite+/Ultracite config models.

### 1. Unified Vite.config.ts (Vite+ / Ultracite Model)

If you are using **Vite+** or **Ultracite**, you can define your configuration directly in your root `vite.config.ts` by importing our package:

```typescript
import { defineConfig } from "vite-plus";
import oxlintConfig from "@area44/oxlint-config";

export default defineConfig({
  lint: {
    ...oxlintConfig,
    // Add custom overrides if necessary
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
```

### 2. TypeScript / ES Module Format (Oxlint 1.x+)

In your project's `oxlint.config.mjs` or `oxlint.config.ts`:

```typescript
import { defineConfig } from "oxlint";
import oxlintConfig from "@area44/oxlint-config";

export default defineConfig({
  extends: [oxlintConfig],
  ignorePatterns: oxlintConfig.ignorePatterns,
});
```

### 3. JSON Format

In your `.oxlintrc.json` configuration file:

```json
{
  "extends": ["./node_modules/@area44/oxlint-config/.oxlintrc.json"]
}
```

---

## Aligning with Ultracite

To extend Ultracite rules alongside `@area44/oxlint-config`, define your `oxlint.config.ts` like so:

```typescript
import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import oxlintConfig from "@area44/oxlint-config";

export default defineConfig({
  extends: [
    core,
    react,
    oxlintConfig, // Overrides stylistic preferences
  ],
  ignorePatterns: oxlintConfig.ignorePatterns,
});
```
