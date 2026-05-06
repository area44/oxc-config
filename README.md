# @area44/oxc-config

AREA44's shareable Oxc configurations for [oxlint](https://oxc.rs/docs/guide/usage/linter) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter).

## Packages

- [`@area44/oxlint-config`](./packages/oxlint-config): Shareable oxlint configuration.
- [`@area44/oxfmt-config`](./packages/oxfmt-config): Shareable oxfmt configuration.

## Usage

### oxlint

Create an `oxlint.config.mjs` or `oxlint.config.ts`:

```javascript
import oxlintConfig from "@area44/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [oxlintConfig],
});
```

Run with: `oxlint -c oxlint.config.mjs`

### oxfmt

**Note:** `oxfmt` does not currently support the `extends` property. Use object spreading instead.

Create an `oxfmt.config.mjs` or `oxfmt.config.ts`:

```javascript
import oxfmtConfig from "@area44/oxfmt-config";
import { defineConfig } from "oxfmt";

export default defineConfig({
  ...oxfmtConfig,
});
```

Run with: `oxfmt -c oxfmt.config.mjs`

## Important Notes

- **Configuration Discovery**: `oxlint` and `oxfmt` only automatically discover `.json` and `.jsonc` files. For `.mjs` or `.ts` files, you must use the `-c` or `--config` flag.
- **TypeScript Support**: Support for `.ts` configuration files is experimental and requires a Node.js environment capable of executing TypeScript.
