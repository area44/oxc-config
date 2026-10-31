# @area44/oxc-config

AREA44's canonical shareable configurations for `Oxlint` and `Oxfmt`, based on Ultracite.

## Packages

This monorepo publishes exactly two independent npm packages:
- **`@area44/oxlint`**: Comprehensive, production-ready Oxlint configuration.
- **`@area44/oxfmt`**: Comprehensive, production-ready Oxfmt configuration.

Both packages are fully self-contained and have zero runtime dependency on Ultracite.

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
