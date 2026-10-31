# @area44/oxlint

Comprehensive Ultracite-based shareable Oxlint configuration for AREA44.

## Installation

```bash
pnpm add -D @area44/oxlint oxlint
```

## Usage

### JavaScript / TypeScript Configuration (`oxlint.config.mjs`)

```javascript
import config from "@area44/oxlint";

export default config;
```

### JSON Configuration (`.oxlintrc.json`)

```json
{
  "extends": ["./node_modules/@area44/oxlint/.oxlintrc.json"]
}
```

## Features

- **Comprehensive Default**: Pre-configured with native plugins (`eslint`, `typescript`, `unicorn`, `oxc`, `import`, `jsdoc`, `node`, `promise`, `react`, `react-perf`, `jsx-a11y`, `vitest`, `vue`, `nextjs`).
- **File-Specific Overrides**: Framework and test rules apply automatically to relevant files (React in `**/*.{jsx,tsx}`, Vue in `**/*.vue`, Vitest in test files, Next.js in route files) without requiring separate preset imports.
- **Production Ready**: Independent, self-contained, zero runtime dependency on Ultracite.
