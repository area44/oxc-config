import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig } from "rolldown";

export default defineConfig({
  input: "index.ts",
  output: {
    file: "oxfmt.config.mjs",
    format: "esm",
  },
  plugins: [
    {
      name: "generate-json",
      async writeBundle() {
        const modulePath = resolve(process.cwd(), "oxfmt.config.mjs");
        const module = await import(pathToFileURL(modulePath).href);
        const config = module.default;
        const output = {
          $schema: "../../node_modules/oxfmt/configuration_schema.json",
          ...config,
        };
        writeFileSync(".oxfmtrc.json", JSON.stringify(output, null, 2) + "\n");
        console.log("Generated .oxfmtrc.json via Rolldown plugin");
      },
    },
  ],
});
