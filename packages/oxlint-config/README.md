# @area44/oxlint-config

Shareable oxlint configuration for area44.

## Installation

```bash
pnpm add -D oxlint @area44/oxlint-config
```

## Usage

In your `.oxlintrc.json`:

### Base (Core)

```json
{
  "extends": ["@area44/oxlint-config"]
}
```

### TypeScript

```json
{
  "extends": ["@area44/oxlint-config/typescript.json"]
}
```

### React

```json
{
  "extends": ["@area44/oxlint-config/react.json"]
}
```
