import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ignorePatterns } from "./oxc-shared-config/index.mjs";

describe("monorepo configuration tests", () => {
  it("should have correct ignorePatterns exported from shared-config", () => {
    expect(Array.isArray(ignorePatterns)).toBe(true);
    expect(ignorePatterns.length).toBeGreaterThan(0);
    expect(ignorePatterns).toContain("**/dist");
  });

  it("should have matching ignorePatterns in compiled oxlint rc json", () => {
    const jsonPath = join(__dirname, "oxlint-config/.oxlintrc.json");
    const content = JSON.parse(readFileSync(jsonPath, "utf-8"));
    expect(content.ignorePatterns).toEqual(ignorePatterns);
  });

  it("should have matching ignorePatterns in compiled oxfmt rc json", () => {
    const jsonPath = join(__dirname, "oxfmt-config/.oxfmtrc.json");
    const content = JSON.parse(readFileSync(jsonPath, "utf-8"));
    expect(content.ignorePatterns).toEqual(ignorePatterns);
  });
});
