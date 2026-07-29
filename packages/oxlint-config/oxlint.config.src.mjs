import { ignorePatterns } from "@area44/oxc-shared-config";

export default {
  plugins: [
    "typescript",
    "unicorn",
    "react",
    "react-perf",
    "import",
    "jsx-a11y",
    "node",
    "promise",
    "vitest",
    "vue",
  ],
  ignorePatterns,
};
