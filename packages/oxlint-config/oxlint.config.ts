import { defineConfig } from "oxlint";

import { ignorePatterns } from "../../utils/oxc-shared-config/index.js";

export default defineConfig({
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
});
