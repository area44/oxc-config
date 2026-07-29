# @area44/oxlint-config

Shareable [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) configuration for AREA44.

Optimized for speed and high-signal correctness, fully compatible with the official **Oxc** documents and guidelines.

## Installation

```bash
pnpm add -D oxlint @area44/oxlint-config
```

## Usage

Depending on your toolchain, you can integrate this configuration using JSON or TypeScript/ESM formats.

### 1. TypeScript / ES Module Format (Oxlint 1.x+)

In your project's `oxlint.config.mjs` or `oxlint.config.ts`:

```typescript
import { defineConfig } from "oxlint";
import oxlintConfig from "@area44/oxlint-config";

export default defineConfig({
  extends: [oxlintConfig],
});
```

### 2. JSON Format

In your `.oxlintrc.json` configuration file:

```json
{
  "extends": ["./node_modules/@area44/oxlint-config/.oxlintrc.json"]
}
```
