# @area44/oxlint-config

Shareable oxlint configuration for AREA44.

## Installation

```bash
pnpm add -D oxlint @area44/oxlint-config
```

## Usage

### JSON Format

In your `.oxlintrc.json`:

```json
{
  "extends": ["./node_modules/@area44/oxlint-config/.oxlintrc.json"]
}
```

### TypeScript Format

In your `oxlint.config.ts`:

```typescript
import oxlintConfig from "@area44/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [oxlintConfig],
});
```
