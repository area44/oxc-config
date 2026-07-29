import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig } from "rolldown";

export default defineConfig({
  input: "index.ts",
  output: {
    file: "oxlint.config.mjs",
    format: "esm",
  },
  plugins: [
    {
      name: "generate-json",
      async writeBundle() {
        const modulePath = resolve(process.cwd(), "oxlint.config.mjs");
        const module = await import(pathToFileURL(modulePath).href);
        const config = module.default;
        const output = {
          $schema: "../../node_modules/oxlint/configuration_schema.json",
          ...config,
        };
        writeFileSync(".oxlintrc.json", JSON.stringify(output, null, 2) + "\n");
        console.log("Generated .oxlintrc.json via Rolldown plugin");
      },
    },
  ],
});
