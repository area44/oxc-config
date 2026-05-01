import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "import", "unicorn", "react"],
  rules: {
    eqeqeq: "error",
    "no-unused-vars": "warn",
  },
  ignorePatterns: [
    "**/node_modules/**",
    "**/dist/**",
    "**/.next/**",
    "**/.nuxt/**",
    "**/.svelte-kit/**",
  ],
});
