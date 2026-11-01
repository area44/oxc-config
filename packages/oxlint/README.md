# @area44/oxlint

Comprehensive Ultracite-based shareable Oxlint configuration.

## Installation

Install `@area44/oxlint` and `oxlint` as development dependencies:

```bash
pnpm add -D @area44/oxlint oxlint
```

or with npm / yarn:

```bash
npm install --save-dev @area44/oxlint oxlint
# or
yarn add -D @area44/oxlint oxlint
```

## Configuration

### JavaScript / TypeScript Configuration (`oxlint.config.mjs`)

Create an `oxlint.config.mjs` (or `.ts`) file in the root of your project:

```javascript
import config from "@area44/oxlint";

export default config;
```

Run oxlint pointing to your config:

```bash
oxlint -c oxlint.config.mjs
```

### JSON Configuration (`.oxlintrc.json`)

Create an `.oxlintrc.json` file in the root of your project:

```json
{
  "extends": ["./node_modules/@area44/oxlint/.oxlintrc.json"]
}
```

Run oxlint:

```bash
oxlint -c .oxlintrc.json
```

_Note on JSON Configuration:_ Oxlint automatically discovers `.oxlintrc.json` in project directories. The `extends` field must point to the relative path of the packaged `.oxlintrc.json` file inside `node_modules`. Overrides and custom rules can be appended directly to the configuration object.

## Features

- **Ultracite Core & Framework Presets**: Pre-configured with native plugins (`eslint`, `typescript`, `unicorn`, `oxc`, `import`, `jsdoc`, `node`, `promise`, `react`, `react-perf`, `jsx-a11y`, `vitest`, `vue`).
- **File-Specific Overrides**: Framework and test rules apply automatically to relevant files (React in `**/*.{jsx,tsx}`, Vue in `**/*.vue`, Vitest in test files) without requiring separate preset imports.
- **Production Ready**: Independent, self-contained, zero runtime dependency on Ultracite.
