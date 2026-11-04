# @area44/oxc-config

Canonical shareable configurations for `Oxlint` and `Oxfmt`, based on Ultracite.

## Packages

This monorepo publishes exactly two independent npm packages:
- **`@area44/oxlint-config`**: Comprehensive, production-ready Oxlint configuration.
- **`@area44/oxfmt-config`**: Comprehensive, production-ready Oxfmt configuration.

Both packages are fully self-contained and have zero runtime dependency on Ultracite.

## Installation & Usage

### `@area44/oxlint-config`

```bash
pnpm add -D @area44/oxlint-config oxlint
```

In `oxlint.config.mjs`:
```javascript
import config from "@area44/oxlint-config";

export default config;
```

Or via `.oxlintrc.json`:
```json
{
  "extends": ["./node_modules/@area44/oxlint-config/.oxlintrc.json"]
}
```

### `@area44/oxfmt-config`

```bash
pnpm add -D @area44/oxfmt-config oxfmt
```

In `oxfmt.config.mjs`:
```javascript
import config from "@area44/oxfmt-config";

export default {
  ...config,
};
```

Or via CLI flag referencing the packaged JSON config:
```bash
oxfmt -c ./node_modules/@area44/oxfmt-config/.oxfmtrc.json
```

## Development Workflows

### Building Configurations
Build packages, JSON configs, and type definitions using Rolldown:
```bash
pnpm build
```

### Running Tests
Run all fixture and package integration tests:
```bash
pnpm test
```

### Formatting
Format the repository:
```bash
pnpm fmt
```

### Linting
Lint the repository:
```bash
pnpm lint
```

### Upstream Synchronization
Sync upstream configurations from Ultracite:
```bash
pnpm upstream:sync
```

For detailed architectural guidelines and conventions, see [AGENTS.md](./AGENTS.md).
