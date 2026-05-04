# @area44/oxfmt-config

Shareable oxfmt configuration for AREA44.

## Installation

```bash
pnpm add -D oxfmt @area44/oxfmt-config
```

## Usage

### JSON Format

Oxfmt currently searches for configuration files upward. You can use this by creating an `.oxfmtrc.json` that extends this or by copying the settings.

_Note: Oxfmt's "extends" support is evolving. Check the latest oxfmt documentation for the most current way to use shared configs._

### TypeScript Format

In your `oxfmt.config.ts`:

```typescript
import oxfmtConfig from "@area44/oxfmt-config";
import { defineConfig } from "oxfmt";

export default defineConfig({
  extends: [oxfmtConfig],
});
```
