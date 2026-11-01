import assert from "node:assert";
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("package integration, ignore patterns, and framework isolation", () => {
  const repoRoot = process.cwd();
  const oxlintDir = path.join(repoRoot, "packages/oxlint");
  const oxfmtDir = path.join(repoRoot, "packages/oxfmt");

  // Read tool versions dynamically from package.json
  const rootPkg = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")
  );
  const oxlintVersion = rootPkg.dependencies.oxlint.replace(/[\^~>=<]/g, "");
  const oxfmtVersion = rootPkg.dependencies.oxfmt.replace(/[\^~>=<]/g, "");

  it("packages build, pack, and work independently in an isolated consumer project", () => {
    const oxlintPack = execSync("npm pack", { cwd: oxlintDir, encoding: "utf8" }).trim();
    const oxfmtPack = execSync("npm pack", { cwd: oxfmtDir, encoding: "utf8" }).trim();

    const oxlintTarball = path.join(oxlintDir, oxlintPack);
    const oxfmtTarball = path.join(oxfmtDir, oxfmtPack);

    expect(fs.existsSync(oxlintTarball)).toBe(true);
    expect(fs.existsSync(oxfmtTarball)).toBe(true);

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "area44-consumer-"));

    try {
      const consumerPkg = {
        name: "consumer-project",
        version: "1.0.0",
        type: "module",
      };
      fs.writeFileSync(
        path.join(tmpDir, "package.json"),
        JSON.stringify(consumerPkg, null, 2)
      );

      // Install the packed archives and pinned tool versions into isolated project
      execSync(
        `npm install ${oxlintTarball} ${oxfmtTarball} oxlint@${oxlintVersion} oxfmt@${oxfmtVersion}`,
        {
          cwd: tmpDir,
          stdio: "pipe",
        }
      );

      // 1. Verify default oxlint ESM import
      const testOxlintJs = `
import config from "@area44/oxlint";
if (!config || !Array.isArray(config.plugins)) {
  throw new Error("Invalid oxlint config export");
}
console.log("Consumer oxlint plugins count:", config.plugins.length);
`;
      fs.writeFileSync(path.join(tmpDir, "test-oxlint.mjs"), testOxlintJs);
      const oxlintOut = execSync("node test-oxlint.mjs", { cwd: tmpDir, encoding: "utf8" });
      expect(oxlintOut).toMatch(/Consumer oxlint plugins count:/);

      // 2. Verify default oxfmt ESM import and spread usage
      const testOxfmtJs = `
import config from "@area44/oxfmt";
const finalConfig = { ...config };
if (!finalConfig || !finalConfig.sortImports) {
  throw new Error("Invalid oxfmt config export");
}
console.log("Consumer oxfmt tabWidth:", finalConfig.tabWidth);
`;
      fs.writeFileSync(path.join(tmpDir, "test-oxfmt.mjs"), testOxfmtJs);
      const oxfmtOut = execSync("node test-oxfmt.mjs", { cwd: tmpDir, encoding: "utf8" });
      expect(oxfmtOut).toMatch(/Consumer oxfmt tabWidth: 2/);

      // 3. Verify .oxlintrc.json and .oxfmtrc.json are valid and copyable
      fs.writeFileSync(
        path.join(tmpDir, ".oxlintrc.json"),
        fs.readFileSync(path.join(tmpDir, "node_modules/@area44/oxlint/.oxlintrc.json"))
      );
      fs.writeFileSync(
        path.join(tmpDir, ".oxfmtrc.json"),
        fs.readFileSync(path.join(tmpDir, "node_modules/@area44/oxfmt/.oxfmtrc.json"))
      );

      // 4. Test .github ignore behavior in both Oxlint and Oxfmt
      fs.mkdirSync(path.join(tmpDir, ".github/workflows"), { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, ".github/workflows/bad.js"),
        "debugger;\nconst x=1\n"
      );
      fs.writeFileSync(
        path.join(tmpDir, ".github/script.js"),
        "debugger;\nconst y=2\n"
      );

      // Oxlint should ignore .github/
      const oxlintFiles = execSync("npx oxlint -c .oxlintrc.json --debug=files", {
        cwd: tmpDir,
        encoding: "utf8",
      });
      expect(oxlintFiles).not.toMatch(/\.github/);

      // Oxfmt should ignore .github/
      let oxfmtExcluded = false;
      try {
        execSync("npx oxfmt -c .oxfmtrc.json --check .github", {
          cwd: tmpDir,
          encoding: "utf8",
        });
      } catch (err: any) {
        const out = `${err.stdout || ""} ${err.stderr || ""}`;
        if (/excluded by ignore rules/.test(out)) {
          oxfmtExcluded = true;
        }
      }
      expect(oxfmtExcluded).toBe(true);

      // 5. Test hand-written .d.ts files vs generated .d.ts files
      fs.mkdirSync(path.join(tmpDir, "src"), { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, "src/types.d.ts"),
        "export type CustomType = string;\n"
      );
      fs.writeFileSync(
        path.join(tmpDir, "src/schema.d.ts"),
        "export type SchemaType = number;\n"
      );

      const oxlintFilesTypes = execSync("npx oxlint -c .oxlintrc.json --debug=files", {
        cwd: tmpDir,
        encoding: "utf8",
      });
      expect(oxlintFilesTypes).toMatch(/types\.d\.ts/);
      expect(oxlintFilesTypes).not.toMatch(/schema\.d\.ts/);

      // 6. Test Next.js rules active in route and application files
      fs.mkdirSync(path.join(tmpDir, "src/components"), { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, "src/components/my-component.tsx"),
        "export const MyComponent = () => <img src='/img.png' alt='test' />;\n"
      );
      let nextError = false;
      try {
        execSync("npx oxlint -c .oxlintrc.json src/components/my-component.tsx", {
          cwd: tmpDir,
          encoding: "utf8",
        });
      } catch (err: any) {
        nextError = true;
        expect(err.stdout).toMatch(/next\(no-img-element\)/);
      }
      expect(nextError).toBe(true);

      // 7. Test generic React projects outside Next.js paths do NOT receive Next.js rules
      fs.mkdirSync(path.join(tmpDir, "external-react"), { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, "external-react/generic-button.tsx"),
        "export const GenericButton = () => <img src='/img.png' alt='test' />;\n"
      );
      const reactOut = execSync("npx oxlint -c .oxlintrc.json external-react/generic-button.tsx", {
        cwd: tmpDir,
        encoding: "utf8",
      });
      expect(reactOut).toMatch(/0 errors/);
      expect(reactOut).not.toMatch(/next\(no-img-element\)/);

    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      fs.rmSync(oxlintTarball, { force: true });
      fs.rmSync(oxfmtTarball, { force: true });
    }
  });
});
