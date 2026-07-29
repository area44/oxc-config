# @area44/oxc-config

AREA44's canonical shareable configurations for `Oxlint` and `Oxfmt`.

This monorepo is configured with modern, next-generation web tooling, featuring **Vite**, **Rolldown**, and **Vitest (Vite Test)** for lightning-fast builds, bundle inlining, and automated testing.

## Workspace Overview

- **`@area44/oxc-shared-config`** (Private): Contains the canonical `ignorePatterns` used across both formatters and linters.
- **`@area44/oxfmt-config`**: Shareable Oxfmt formatter configuration.
- **`@area44/oxlint-config`**: Shareable Oxlint linter configuration.

## Toolchain & Configuration

This project standardizes on the VoidZero/Vite ecosystem:
- **Build / Bundling**: Powered by **Rolldown** (`rolldown.config.ts`), inlining local packages to generate static, self-contained ES Module (`.mjs`) and JSON (`.json`) configs.
- **Testing**: Powered by **Vitest (Vite Test)** (`vite.config.ts`) to verify configuration schemas and ensure build outputs are synchronized.
- **Code Quality**: Designed to align perfectly with **Ultracite** and official `Oxc` guidelines.

## Development Workflows

### Building Configurations
To build all packages using Rolldown:
```bash
pnpm build
```

### Running Tests
To execute the test suite via Vitest / `vite test`:
```bash
pnpm test
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

## Alignment with Ultracite

The configurations in this monorepo are optimized for teams using standard Oxc/ESlint setups, as well as the **Ultracite** zero-config toolchain. Check out the package-level READMEs for framework presets and usage examples!
