# AGENTS.md

This file is the single source of truth for repository architecture, conventions, and AI instructions.

## Repository Purpose

This repository is a pnpm monorepo maintaining and publishing exactly two independent npm packages:
1. **`@area44/oxlint`**: A comprehensive, production-ready shareable configuration for Oxlint.
2. **`@area44/oxfmt`**: A comprehensive, production-ready shareable configuration for Oxfmt.

Both packages are based on upstream configurations from **Ultracite**, customized and composed with AREA44 conventions. At consumer runtime, both packages are completely self-contained and have zero runtime dependency on Ultracite.

## Architecture

```
packages/
  oxlint/
    src/
      upstream/       # Synchronized snapshots from Ultracite
      area44/         # AREA44 custom rules and plugins
      overrides/      # Framework-specific overrides (React, Vue, Vitest, Next.js)
      compose.ts      # Merging and composition logic
      index.ts        # Source entry point
    package.json
    rolldown.config.ts
    README.md

  oxfmt/
    src/
      upstream/       # Synchronized snapshots from Ultracite
      area44/         # AREA44 formatting preferences & import sorting
      compose.ts      # Oxfmt composition logic
      index.ts        # Source entry point
    package.json
    rolldown.config.ts
    README.md

internal/
  shared/             # Internal shared code (e.g. canonical ignore patterns)
    ignore-patterns.ts
    paths.ts
    index.ts

tests/
  fixtures/           # Linting and formatting fixtures
  integration/        # Integration tests and package tarball verifications

scripts/
  sync-ultracite.ts   # Upstream synchronization script
```

### Key Architectural Constraints
1. **Exactly Two Public Packages**: Only `packages/oxlint` and `packages/oxfmt` are publishable workspaces.
2. **Internal Shared Code Is Never Published**: `internal/shared` has no `package.json` and is never published as an npm package. Rolldown inlines the shared source code into each package's distribution bundle (`oxlint.config.mjs` and `oxfmt.config.mjs`).
3. **No External References in Published Artifacts**: Published packages must never reference files outside their package directory.
4. **Ultracite Is Build-Time Only**: Ultracite is installed as a root development dependency for syncing upstream configurations, never as a runtime dependency for published packages.

---

## Package APIs

### `@area44/oxlint`
Consumers import a single default configuration:
```javascript
import config from "@area44/oxlint";

export default config;
```
Or use the pre-generated JSON configuration:
```json
{
  "extends": ["./node_modules/@area44/oxlint/.oxlintrc.json"]
}
```
No separate framework imports (such as `@area44/oxlint/react` or `@area44/oxlint/vue`) are exposed. React, Vue, Vitest, and Next.js rules are integrated automatically via file-specific `overrides`.

### `@area44/oxfmt`
Consumers spread the single default configuration:
```javascript
import config from "@area44/oxfmt";

export default {
  ...config,
};
```
Or reference `.oxfmtrc.json` directly via the `-c` CLI flag. Oxfmt does not use Oxlint's `extends` schema; standard object spreading is used in JS/TS.

---

## AREA44 Conventions & Upstream Customizations

- **Ignore Patterns**: Canonical ignore list defined in `internal/shared/ignore-patterns.ts` covers build outputs (`dist`, `.next`, `.turbo`, etc.), generated artifacts, mobile build directories, lockfiles, and test coverage.
- **Import Sorting**: Oxfmt import sorting follows AREA44 group order:
  1. `type-import`
  2. `["value-builtin", "value-external"]`
  3. `type-internal`
  4. `value-internal`
  5. `["type-parent", "type-sibling", "type-index"]`
  6. `["value-parent", "value-sibling", "value-index"]`
  7. `unknown`
- **Formatting**: 2-space indentation (`tabWidth: 2`), `useTabs: false`, and standard semicolons.
- **Plugins**: Comprehensive native Oxlint plugins enabled: `eslint`, `typescript`, `unicorn`, `oxc`, `import`, `jsdoc`, `node`, `promise`, `react`, `react-perf`, `jsx-a11y`, `vitest`, `vue`, `nextjs`.

---

## Development Workflows

### Building
To build bundles (`.mjs`), JSON configurations (`.oxlintrc.json`, `.oxfmtrc.json`), and type definitions (`index.d.ts`):
```bash
pnpm build
```

### Testing
To run all integration tests and fixture tests:
```bash
pnpm test
```

### Linting & Formatting
```bash
pnpm lint
pnpm fmt
```

### Upstream Synchronization
To update upstream configurations from Ultracite:
```bash
pnpm upstream:sync
```
This script (`scripts/sync-ultracite.ts`):
1. Reads the installed Ultracite package metadata (`version` and `gitHead`).
2. Imports upstream presets for core, react, vue, vitest, next, and oxfmt.
3. Updates snapshots in `packages/oxlint/src/upstream/` and `packages/oxfmt/src/upstream/`.
4. Saves synchronization metadata to `upstream-meta.json`.

After syncing, rebuild (`pnpm build`) and run tests (`pnpm test`) to ensure compatibility.

---

## Releases & Changesets

Changesets manage independent versioning and releases for `@area44/oxlint` and `@area44/oxfmt`.
- To create a changeset: `pnpm changeset`
- Versioning script: `pnpm version-packages`
- Release script: `pnpm release`
- Independent releases ensure Oxlint changes only bump `@area44/oxlint`, and Oxfmt changes only bump `@area44/oxfmt`.
