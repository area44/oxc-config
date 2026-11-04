# @area44/oxfmt-config

Comprehensive Ultracite-based shareable Oxfmt configuration.

## Installation

Install `@area44/oxfmt-config` and `oxfmt` as development dependencies:

```bash
pnpm add -D @area44/oxfmt-config oxfmt
```

or with npm / yarn:

```bash
npm install --save-dev @area44/oxfmt-config oxfmt
# or
yarn add -D @area44/oxfmt-config oxfmt
```

## Configuration

### JavaScript / TypeScript Configuration (`oxfmt.config.mjs`)

Create an `oxfmt.config.mjs` (or `.ts`) file in the root of your project:

```javascript
import config from "@area44/oxfmt-config";

export default {
  ...config,
};
```

Run oxfmt pointing to your config:

```bash
oxfmt -c oxfmt.config.mjs
```

### JSON Configuration (`.oxfmtrc.json`)

Oxfmt supports JSON configuration via `.oxfmtrc.json`. Because Oxfmt does not have an `extends` property in its configuration schema, copy or reference the provided `.oxfmtrc.json`:

```bash
oxfmt -c ./node_modules/@area44/oxfmt-config/.oxfmtrc.json
```

Or copy the pre-compiled `.oxfmtrc.json` from the package into your project root:

```bash
cp ./node_modules/@area44/oxfmt-config/.oxfmtrc.json .oxfmtrc.json
```

_Note on JSON Configuration:_ Unlike Oxlint, Oxfmt does not resolve an `extends` property. For composable shared configs in JavaScript/TypeScript, use the object spread syntax (`{ ...config }`).

## Features

- **Structured Import Sorting**: Enforces structured import ordering across types, built-ins, externals, and internal modules.
- **Consistent Code Style**: 2-space indentation, standard quotes, semicolons, and tailwind class sorting.
- **Production Ready**: Independent, self-contained, zero runtime dependency on Ultracite.
