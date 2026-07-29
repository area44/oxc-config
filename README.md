# @area44/oxc-config

A production-grade, high-performance shareable configuration preset for **Oxlint** and **Oxfmt**.

These packages leverage the ultra-fast, Rust-powered Oxc ecosystem to run checks and format your code in milliseconds.

---

## Packages Included

1. **[`@area44/oxlint-config`](./packages/oxlint-config)**: Shareable linting rules and presets for `oxlint`.
2. **[`@area44/oxfmt-config`](./packages/oxfmt-config)**: Shareable formatting preferences and configurations for `oxfmt` (uses 2-space indentation, no tabs).
3. **[`@area44/oxc-shared-config`](./packages/oxc-shared-config)**: Canonical ignore patterns shared across all linters and formatters.

---

## Installation

Install the packages in your project using your preferred package manager along with `oxlint` and `oxfmt`:

### PNPM
```bash
pnpm add -D @area44/oxlint-config @area44/oxfmt-config oxlint oxfmt
```

### NPM
```bash
npm install -D @area44/oxlint-config @area44/oxfmt-config oxlint oxfmt
```

### Yarn
```bash
yarn add -D @area44/oxlint-config @area44/oxfmt-config oxlint oxfmt
```

### Bun
```bash
bun add -D @area44/oxlint-config @area44/oxfmt-config oxlint oxfmt
```

---

## Usage

You can use these shareable configs either with modern JavaScript/TypeScript configurations or with standard JSON files.

### 1. Modern JavaScript / TypeScript (Recommended)

Create `oxlint.config.ts` and `oxfmt.config.ts` in the root of your project:

#### `oxlint.config.ts`
```typescript
import { defineConfig } from "oxlint";
import oxlintConfig from "@area44/oxlint-config";

export default defineConfig({
  ...oxlintConfig,
  // Add project-specific custom overrides/rules here
});
```

#### `oxfmt.config.ts`
> **Note**: Oxfmt does not support the `extends` property in its configuration schema. Shared settings must be inherited using the object spread operator.

```typescript
import { defineConfig } from "oxfmt";
import oxfmtConfig from "@area44/oxfmt-config";

export default defineConfig({
  ...oxfmtConfig,
  // Add project-specific custom overrides/rules here
});
```

### 2. JSON Configuration Files

Alternatively, create `.oxlintrc.json` and `.oxfmtrc.json` in the root of your project:

#### `.oxlintrc.json`
```json
{
  "extends": [
    "@area44/oxlint-config"
  ]
}
```

#### `.oxfmtrc.json`
```json
{
  "$schema": "https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxfmt/configuration_schema.json",
  "sortImports": {
    "groups": [
      "type-import",
      ["value-builtin", "value-external"],
      "type-internal",
      "value-internal",
      ["type-parent", "type-sibling", "type-index"],
      ["value-parent", "value-sibling", "value-index"],
      "unknown"
    ]
  },
  "ignorePatterns": [
    "**/dist",
    "**/build",
    "**/out",
    "**/.next",
    "**/node_modules"
  ]
}
```

---

## Running Linting & Formatting

Add the following scripts to your project's `package.json`:

```json
{
  "scripts": {
    "lint": "oxlint -c oxlint.config.ts",
    "fmt": "oxfmt -c oxfmt.config.ts"
  }
}
```

Then run them using your package manager:
```bash
pnpm lint
pnpm fmt
```

---

## License

MIT © area44
