import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.ts",
  output: {
    file: "oxfmt.config.mjs",
    format: "esm",
    comments: false,
  },
  resolve: {
    alias: {
      "@shared": resolve(__dirname, "../../internal/shared/index.ts"),
    },
  },
  plugins: [
    {
      name: "generate-artifacts",
      async writeBundle() {
        const modulePath = resolve(process.cwd(), "oxfmt.config.mjs");
        const module = await import(pathToFileURL(modulePath).href);
        const config = module.default;
        const output = {
          $schema: "./node_modules/oxfmt/configuration_schema.json",
          ...config,
        };
        writeFileSync(".oxfmtrc.json", JSON.stringify(output, null, 2) + "\n");
        console.log("Generated .oxfmtrc.json via Rolldown plugin");

        // Generate type definitions
        const dts = `declare const config: import("oxfmt").OxfmtConfig | Record<string, any>;
export default config;
`;
        writeFileSync("index.d.ts", dts);
        console.log("Generated index.d.ts");
      },
    },
  ],
});
