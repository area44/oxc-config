import assert from "node:assert";
import { execSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("oxlint and oxfmt fixtures", () => {
  const repoRoot = process.cwd();
  const oxlintrc = path.join(repoRoot, "packages/oxlint/.oxlintrc.json");
  const oxfmtrc = path.join(repoRoot, "packages/oxfmt/.oxfmtrc.json");

  it("valid fixtures pass oxlint with 0 errors", () => {
    const validFiles = [
      path.join(repoRoot, "tests/fixtures/oxlint/valid/valid.ts"),
      path.join(repoRoot, "tests/fixtures/oxlint/valid/valid-react.tsx"),
      path.join(repoRoot, "tests/fixtures/oxlint/valid/valid-vue.vue"),
      path.join(repoRoot, "tests/fixtures/oxlint/valid/valid.test.ts"),
    ];
    const validCmd = `npx oxlint -c ${oxlintrc} ${validFiles.join(" ")}`;
    const validOut = execSync(validCmd, { encoding: "utf8" });
    expect(validOut).toMatch(/0 errors/);
  });

  it("invalid fixtures fail oxlint checks", () => {
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
      expect(err.stdout).toMatch(/debugger/);
      expect(err.stdout).toMatch(/button-has-type/);
    }
    expect(failed).toBe(true);
  });

  it("oxfmt check verifies correctly formatted fixtures and detects unformatted ones", () => {
    const formattedFile = path.join(repoRoot, "tests/fixtures/oxfmt/valid/formatted.ts");
    const checkOut = execSync(`npx oxfmt -c ${oxfmtrc} --check ${formattedFile}`, {
      encoding: "utf8",
    });
    expect(checkOut).toMatch(/All matched files use the correct format/);

    const unformattedFile = path.join(repoRoot, "tests/fixtures/oxfmt/unformatted/unformatted.ts");
    let failed = false;
    try {
      execSync(`npx oxfmt -c ${oxfmtrc} --check ${unformattedFile}`, {
        encoding: "utf8",
      });
    } catch (err: any) {
      failed = true;
      expect(err.stdout).toMatch(/Format issues found/);
    }
    expect(failed).toBe(true);
  });
});
