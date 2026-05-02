/**
 * Canonical ignore patterns shared across all linters and formatters.
 */
export const ignorePatterns = [
  // Build and Framework output
  "**/dist",
  "**/build",
  "**/out",
  "**/.next",
  "**/.open-next",
  "**/.nuxt",
  "**/.output",
  "**/.svelte-kit",
  "**/.vitepress/cache",
  "**/.vitepress/dist",
  "**/.turbo",
  "**/.vercel",
  "**/.netlify",
  "**/.docusaurus",
  "**/.cache",
  "**/.parcel-cache",
  "**/.vite",
  "**/.astro",
  "**/.github",
  "**/_astro",
  "**/public",
  "**/public/build",
  "**/storybook-static",

  // Generated code
  "*.min.*",
  "*.map",
  "**/_generated",
  "**/*.gen.*",
  "**/*.generated.*",
  "**/*.auto.*",
  "**/generated",
  "**/auto-generated",
  "**/codegen",
  "**/__generated__",
  "**/graphql-types.*",
  "**/schema.d.ts",
  "**/schema.graphql.d.ts",
  "**/*.d.ts.map",

  // Test coverage
  "**/coverage",
  "**/.nyc_output",

  // Mobile
  "**/.expo",
  "**/.expo-shared",
  "**/android/build",
  "**/ios/build",
  "**/DerivedData/**/*",

  // Lock files
  "**/bun.lock",
  "**/bun.lockb",
  "**/package-lock.json",
  "**/yarn.lock",
  "**/pnpm-lock.yaml",

  // Framework type definitions
  "**/next-env.d.ts",
  "**/worker-configuration.d.ts",
];
