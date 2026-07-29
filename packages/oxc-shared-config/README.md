# @area44/oxc-shared-config

Canonical ignore patterns shared across all linters, formatters, and compilers in the AREA44 workspace.

This is a private helper workspace package and is inlined directly during build time by `@area44/oxlint-config` and `@area44/oxfmt-config` to provide fully self-contained published artifacts.

## Contained Ignore Categories

- **Build & Framework outputs**: `dist`, `build`, `.next`, `.nuxt`, `.output`, etc.
- **Generated code**: Minified files, maps, codegen, schema files, etc.
- **Test coverage**: `coverage`, `.nyc_output`
- **Mobile development**: Expo artifacts, iOS/Android build folders
- **Lockfiles**: lockfiles from `npm`, `yarn`, `pnpm`, and `bun`
- **Framework type definitions**: `next-env.d.ts`, etc.
