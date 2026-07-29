import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

import { ignorePatterns } from "../oxc-shared-config/index.mjs";

describe("oxlint-config", () => {
  it("should have matching ignorePatterns in compiled oxlint rc json", () => {
    const jsonPath = join(__dirname, ".oxlintrc.json");
    const content = JSON.parse(readFileSync(jsonPath, "utf-8"));
    expect(content.ignorePatterns).toEqual(ignorePatterns);
  });
});
