# @area44/oxc-config

AREA44's canonical shareable configurations for `Oxlint` and `Oxfmt`.

This monorepo is configured with modern, next-generation web tooling, featuring **Rolldown** for lightning-fast builds and bundle inlining.

## Workspace Overview

- **`@area44/oxc-shared-config`** (Private): Contains the canonical `ignorePatterns` used across both formatters and linters.
- **`@area44/oxfmt-config`**: Shareable Oxfmt formatter configuration.
- **`@area44/oxlint-config`**: Shareable Oxlint linter configuration.

## Toolchain & Configuration

This project standardizes on the following tooling:
- **Build / Bundling**: Powered by **Rolldown** (`rolldown.config.ts`), inlining local packages to generate static, self-contained ES Module (`.mjs`) and JSON (`.json`) configs.
- **Code Quality**: Designed to align perfectly with the official `Oxc` guidelines.

## Development Workflows

### Building Configurations
To build all packages using Rolldown:
```bash
pnpm build
```

### Formatting
To format the repository:
```bash
pnpm fmt
```

### Linting
To lint the repository:
```bash
pnpm lint
```
