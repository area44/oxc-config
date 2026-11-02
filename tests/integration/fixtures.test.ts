import { execSync } from "node:child_process";
import fs from "node:fs";
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
    const validOut = execSync(validCmd, { encoding: "utf-8" });
    expect(validOut).toMatch(/0 errors/u);
  });

  it("invalid fixtures fail oxlint checks", () => {
    const invalidFiles = [
      path.join(repoRoot, "tests/fixtures/oxlint/invalid/invalid-debugger.ts"),
      path.join(repoRoot, "tests/fixtures/oxlint/invalid/invalid-react.tsx"),
    ];
    const invalidCmd = `npx oxlint -c ${oxlintrc} ${invalidFiles.join(" ")}`;
    let failedOutput = "";
    try {
      execSync(invalidCmd, { encoding: "utf-8" });
    } catch (error: unknown) {
      const execError = error as { stdout?: string; stderr?: string };
      failedOutput = `${execError.stdout || ""} ${execError.stderr || ""}`;
    }
    expect(failedOutput).toMatch(/debugger/u);
    expect(failedOutput).toMatch(/button-has-type/u);
  });

  it("generic React fixtures with conventional directories do not receive Next.js diagnostics", () => {
    const genericDir = path.join(
      repoRoot,
      "tests/fixtures/frameworks/generic-react"
    );
    fs.copyFileSync(oxlintrc, path.join(genericDir, ".oxlintrc.json"));
    try {
      const files =
        "app/page.tsx components/button.tsx hooks/use-status.ts lib/format.ts pages/generic-page.tsx";
      const out = execSync(`npx oxlint -c .oxlintrc.json ${files}`, {
        cwd: genericDir,
        encoding: "utf-8",
      });
      expect(out).toMatch(/0 errors/u);
      expect(out).not.toMatch(/next\(/u);
    } finally {
      fs.unlinkSync(path.join(genericDir, ".oxlintrc.json"));
    }
  });

  it("remix-like fixtures with app/ routes do not receive Next.js diagnostics", () => {
    const remixDir = path.join(repoRoot, "tests/fixtures/frameworks/remix");
    fs.copyFileSync(oxlintrc, path.join(remixDir, ".oxlintrc.json"));
    try {
      const out = execSync(
        "npx oxlint -c .oxlintrc.json app/routes/_index.tsx",
        {
          cwd: remixDir,
          encoding: "utf-8",
        }
      );
      expect(out).toMatch(/0 errors/u);
      expect(out).not.toMatch(/next\(/u);
    } finally {
      fs.unlinkSync(path.join(remixDir, ".oxlintrc.json"));
    }
  });

  it("oxfmt check verifies correctly formatted fixtures and detects unformatted ones", () => {
    const formattedFile = path.join(
      repoRoot,
      "tests/fixtures/oxfmt/valid/formatted.ts"
    );
    const checkOut = execSync(
      `npx oxfmt -c ${oxfmtrc} --check ${formattedFile}`,
      {
        encoding: "utf-8",
      }
    );
    expect(checkOut).toMatch(/All matched files use the correct format/u);

    const unformattedFile = path.join(
      repoRoot,
      "tests/fixtures/oxfmt/unformatted/unformatted.ts"
    );
    let unformattedOutput = "";
    try {
      execSync(`npx oxfmt -c ${oxfmtrc} --check ${unformattedFile}`, {
        encoding: "utf-8",
      });
    } catch (error: unknown) {
      const execError = error as { stdout?: string; stderr?: string };
      unformattedOutput = `${execError.stdout || ""} ${execError.stderr || ""}`;
    }
    expect(unformattedOutput).toMatch(/Format issues found/u);
  });
});
