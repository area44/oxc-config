export { ignorePatterns } from "@shared";

// Custom project rules
// Note: Core linting rules (such as no-debugger, no-console, etc.) are inherited
// directly from Ultracite core preset. Only project-specific deviations belong here.
export const customRules: Record<string, unknown> = {};

// Plugins required for core and framework overrides
export const customPlugins: string[] = [
  "eslint",
  "typescript",
  "unicorn",
  "oxc",
  "import",
  "jsdoc",
  "node",
  "promise",
  "react",
  "react-perf",
  "jsx-a11y",
  "vitest",
  "vue",
];
