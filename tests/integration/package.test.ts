import assert from "node:assert";
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

test("packages build, pack, and work independently outside monorepo", async (t) => {
  // 1. Pack packages
  const repoRoot = process.cwd();
  const oxlintDir = path.join(repoRoot, "packages/oxlint");
  const oxfmtDir = path.join(repoRoot, "packages/oxfmt");

  const oxlintPack = execSync("npm pack", { cwd: oxlintDir, encoding: "utf8" }).trim();
  const oxfmtPack = execSync("npm pack", { cwd: oxfmtDir, encoding: "utf8" }).trim();

  const oxlintTarball = path.join(oxlintDir, oxlintPack);
  const oxfmtTarball = path.join(oxfmtDir, oxfmtPack);

  assert.ok(fs.existsSync(oxlintTarball), "oxlint tarball exists");
  assert.ok(fs.existsSync(oxfmtTarball), "oxfmt tarball exists");

  // 2. Setup isolated consumer project
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

    // Install the packed archives into isolated project
    execSync(`npm install ${oxlintTarball} ${oxfmtTarball} oxlint@1.90.0 oxfmt@0.75.0`, {
      cwd: tmpDir,
      stdio: "pipe",
    });

    // 3. Test oxlint import
    const testOxlintJs = `
import config from "@area44/oxlint";
if (!config || !Array.isArray(config.plugins)) {
  throw new Error("Invalid oxlint config export");
}
console.log("Consumer oxlint plugins count:", config.plugins.length);
`;
    fs.writeFileSync(path.join(tmpDir, "test-oxlint.mjs"), testOxlintJs);
    const oxlintOut = execSync("node test-oxlint.mjs", { cwd: tmpDir, encoding: "utf8" });
    assert.match(oxlintOut, /Consumer oxlint plugins count:/);

    // 4. Test oxfmt import
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
    assert.match(oxfmtOut, /Consumer oxfmt tabWidth: 2/);

    // 5. Test CLI linting in consumer with .oxlintrc.json
    fs.writeFileSync(
      path.join(tmpDir, ".oxlintrc.json"),
      fs.readFileSync(path.join(tmpDir, "node_modules/@area44/oxlint/.oxlintrc.json"))
    );
    fs.writeFileSync(
      path.join(tmpDir, "sample.ts"),
      "export const answer = (): number => 42;\n"
    );
    const cliLintOut = execSync("npx oxlint -c .oxlintrc.json sample.ts", {
      cwd: tmpDir,
      encoding: "utf8",
    });
    assert.match(cliLintOut, /0 errors/);

    // 6. Test CLI formatting in consumer with .oxfmtrc.json
    fs.writeFileSync(
      path.join(tmpDir, ".oxfmtrc.json"),
      fs.readFileSync(path.join(tmpDir, "node_modules/@area44/oxfmt/.oxfmtrc.json"))
    );
    const cliFmtOut = execSync("npx oxfmt -c .oxfmtrc.json --check sample.ts", {
      cwd: tmpDir,
      encoding: "utf8",
    });
    assert.match(cliFmtOut, /All matched files use the correct format/);

  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.rmSync(oxlintTarball, { force: true });
    fs.rmSync(oxfmtTarball, { force: true });
  }
});
