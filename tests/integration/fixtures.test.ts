import assert from "node:assert";
import { execSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

test("oxlint fixture tests: valid fixtures pass and invalid fixtures fail", () => {
  const repoRoot = process.cwd();
  const oxlintrc = path.join(repoRoot, "packages/oxlint/.oxlintrc.json");

  // Valid files should pass with 0 errors
  const validFiles = [
    path.join(repoRoot, "tests/fixtures/oxlint/valid/valid.ts"),
    path.join(repoRoot, "tests/fixtures/oxlint/valid/valid-react.tsx"),
    path.join(repoRoot, "tests/fixtures/oxlint/valid/valid.test.ts"),
  ];
  const validCmd = `npx oxlint -c ${oxlintrc} ${validFiles.join(" ")}`;
  const validOut = execSync(validCmd, { encoding: "utf8" });
  assert.match(validOut, /0 errors/);

  // Invalid files should fail
  const invalidFiles = [
    path.join(repoRoot, "tests/fixtures/oxlint/invalid/invalid-debugger.ts"),
    path.join(repoRoot, "tests/fixtures/oxlint/invalid/invalid-react.tsx"),
  ];
  const invalidCmd = `npx oxlint -c ${oxlintrc} ${invalidFiles.join(" ")}`;
  let failed = false;
  try {
    execSync(invalidCmd, { encoding: "utf8" });
  } catch (err: any) {
    failed = true;
    assert.match(err.stdout, /debugger/);
    assert.match(err.stdout, /button-has-type/);
  }
  assert.ok(failed, "invalid files failed lint checks as expected");
});

test("oxfmt fixture tests: check and formatting idempotence", () => {
  const repoRoot = process.cwd();
  const oxfmtrc = path.join(repoRoot, "packages/oxfmt/.oxfmtrc.json");

  // Valid formatted file should pass check
  const formattedFile = path.join(repoRoot, "tests/fixtures/oxfmt/valid/formatted.ts");
  const checkOut = execSync(`npx oxfmt -c ${oxfmtrc} --check ${formattedFile}`, {
    encoding: "utf8",
  });
  assert.match(checkOut, /All matched files use the correct format/);

  // Unformatted file should fail check
  const unformattedFile = path.join(repoRoot, "tests/fixtures/oxfmt/unformatted/unformatted.ts");
  let failed = false;
  try {
    execSync(`npx oxfmt -c ${oxfmtrc} --check ${unformattedFile}`, {
      encoding: "utf8",
    });
  } catch (err: any) {
    failed = true;
    assert.match(err.stdout, /Format issues found/);
  }
  assert.ok(failed, "unformatted file failed check as expected");
});
