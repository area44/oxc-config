# @area44/oxfmt

Comprehensive Ultracite-based shareable Oxfmt configuration for AREA44.

## Installation

```bash
pnpm add -D @area44/oxfmt oxfmt
```

## Usage

### JavaScript / TypeScript Configuration (`oxfmt.config.mjs`)

```javascript
import config from "@area44/oxfmt";

export default {
  ...config,
};
```

### Direct CLI Usage

```bash
oxfmt -c ./node_modules/@area44/oxfmt/.oxfmtrc.json
```

## Features

- **AREA44 Import Sorting**: Enforces structured import ordering across types, built-ins, externals, and internal modules.
- **Consistent Code Style**: 2-space indentation, standard quotes, semicolons, and tailwind class sorting.
- **Production Ready**: Independent, self-contained, zero runtime dependency on Ultracite.
