import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("package integration, ignore patterns, and framework isolation", () => {
  const repoRoot = process.cwd();
  const oxlintDir = path.join(repoRoot, "packages/oxlint");
  const oxfmtDir = path.join(repoRoot, "packages/oxfmt");

  // Read tool versions dynamically from package metadata
  const oxlintPkg = JSON.parse(
    fs.readFileSync(path.join(oxlintDir, "package.json"), "utf-8")
  );
  const oxfmtPkg = JSON.parse(
    fs.readFileSync(path.join(oxfmtDir, "package.json"), "utf-8")
  );
  const [oxlintVersion] = (
    oxlintPkg.peerDependencies?.oxlint || "1.90.0"
  ).replaceAll(/[\^~>=<]/gu, "").trim().split(" ");
  const [oxfmtVersion] = (
    oxfmtPkg.peerDependencies?.oxfmt || "0.75.0"
  ).replaceAll(/[\^~>=<]/gu, "").trim().split(" ");

  it("packages build, pack, and work independently in an isolated consumer project", () => {
    const oxlintPack = execSync("npm pack", { cwd: oxlintDir, encoding: "utf-8" }).trim();
    const oxfmtPack = execSync("npm pack", { cwd: oxfmtDir, encoding: "utf-8" }).trim();

    const oxlintTarball = path.join(oxlintDir, oxlintPack);
    const oxfmtTarball = path.join(oxfmtDir, oxfmtPack);

    expect(fs.existsSync(oxlintTarball)).toBeTruthy();
    expect(fs.existsSync(oxfmtTarball)).toBeTruthy();

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "area44-consumer-"));

    try {
      const consumerPkg = {
        name: "consumer-project",
        type: "module",
        version: "1.0.0",
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
import config from "@area44/oxlint-config";
if (!config || !Array.isArray(config.plugins)) {
  throw new Error("Invalid oxlint config export");
}
console.log("Consumer oxlint plugins count:", config.plugins.length);
`;
      fs.writeFileSync(path.join(tmpDir, "test-oxlint.mjs"), testOxlintJs);
      const oxlintOut = execSync("node test-oxlint.mjs", { cwd: tmpDir, encoding: "utf-8" });
      expect(oxlintOut).toMatch(/Consumer oxlint plugins count:/u);

      // 2. Verify default oxfmt ESM import and spread usage
      const testOxfmtJs = `
import config from "@area44/oxfmt-config";
const finalConfig = { ...config };
if (!finalConfig || !finalConfig.sortImports) {
  throw new Error("Invalid oxfmt config export");
}
console.log("Consumer oxfmt tabWidth:", finalConfig.tabWidth);
`;
      fs.writeFileSync(path.join(tmpDir, "test-oxfmt.mjs"), testOxfmtJs);
      const oxfmtOut = execSync("node test-oxfmt.mjs", { cwd: tmpDir, encoding: "utf-8" });
      expect(oxfmtOut).toMatch(/Consumer oxfmt tabWidth: 2/u);

      // 3. Verify .oxlintrc.json and .oxfmtrc.json are valid and usable
      fs.writeFileSync(
        path.join(tmpDir, ".oxlintrc.json"),
        fs.readFileSync(path.join(tmpDir, "node_modules/@area44/oxlint-config/.oxlintrc.json"))
      );
      fs.writeFileSync(
        path.join(tmpDir, ".oxfmtrc.json"),
        fs.readFileSync(path.join(tmpDir, "node_modules/@area44/oxfmt-config/.oxfmtrc.json"))
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
        encoding: "utf-8",
      });
      expect(oxlintFiles).not.toMatch(/\.github/u);

      // Oxfmt should ignore .github/
      let oxfmtExcluded = false;
      try {
        execSync("npx oxfmt -c .oxfmtrc.json --check .github", {
          cwd: tmpDir,
          encoding: "utf-8",
        });
      } catch (error: unknown) {
        const execError = error as { stdout?: string; stderr?: string };
        const out = `${execError.stdout || ""} ${execError.stderr || ""}`;
        if (/excluded by ignore rules/u.test(out)) {
          oxfmtExcluded = true;
        }
      }
      expect(oxfmtExcluded).toBeTruthy();

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
        encoding: "utf-8",
      });
      expect(oxlintFilesTypes).toMatch(/types\.d\.ts/u);
      expect(oxlintFilesTypes).not.toMatch(/schema\.d\.ts/u);

      // 6. Test that conventional framework directories (app, pages, components, hooks, lib)
      // do NOT trigger Next.js rules
      fs.mkdirSync(path.join(tmpDir, "src/app"), { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, "src/app/page.tsx"),
        "export const Page = () => <img src='/img.png' alt='test' />;\n"
      );
      fs.mkdirSync(path.join(tmpDir, "src/components"), { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, "src/components/generic-button.tsx"),
        "export const GenericButton = () => <img src='/img.png' alt='test' />;\n"
      );

      const appOut = execSync("npx oxlint -c .oxlintrc.json src/app/page.tsx", {
        cwd: tmpDir,
        encoding: "utf-8",
      });
      expect(appOut).toMatch(/0 errors/u);
      expect(appOut).not.toMatch(/next\(/u);

      const reactOut = execSync("npx oxlint -c .oxlintrc.json src/components/generic-button.tsx", {
        cwd: tmpDir,
        encoding: "utf-8",
      });
      expect(reactOut).toMatch(/0 errors/u);
      expect(reactOut).not.toMatch(/next\(/u);
    } finally {
      fs.rmSync(tmpDir, { force: true, recursive: true });
      fs.rmSync(oxlintTarball, { force: true });
      fs.rmSync(oxfmtTarball, { force: true });
    }
  });
});
