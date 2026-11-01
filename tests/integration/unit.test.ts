import { describe, expect, it } from "vitest";

import { ignorePatterns } from "../../internal/shared/ignore-patterns";
import { createFrameworkOverrides } from "../../packages/oxlint/src/overrides/frameworks";

describe("shared ignore patterns", () => {
  it("includes .github directory and subdirectories", () => {
    expect(ignorePatterns).toContain("**/.github");
    expect(ignorePatterns).toContain("**/.github/**");
  });

  it("does not contain broad **/*.d.ts ignore", () => {
    expect(ignorePatterns).not.toContain("**/*.d.ts");
    expect(ignorePatterns).not.toContain("*.d.ts");
  });

  it("contains specific generated declaration files", () => {
    expect(ignorePatterns).toContain("**/schema.d.ts");
    expect(ignorePatterns).toContain("**/schema.graphql.d.ts");
    expect(ignorePatterns).toContain("**/next-env.d.ts");
    expect(ignorePatterns).toContain("**/worker-configuration.d.ts");
  });

  it("contains canonical directories like node_modules and .git", () => {
    expect(ignorePatterns).toContain("**/node_modules");
    expect(ignorePatterns).toContain("**/.git");
  });
});

describe("framework overrides composition", () => {
  const overrides = createFrameworkOverrides();

  it("creates React override matching .jsx and .tsx", () => {
    const reactOverride = overrides.find(
      (o) => Array.isArray(o.files) && o.files.includes("**/*.{jsx,tsx}")
    );
    expect(reactOverride).toBeDefined();
    expect(reactOverride?.rules).toBeDefined();
  });

  it("creates Vue override matching .vue", () => {
    const vueOverride = overrides.find(
      (o) => Array.isArray(o.files) && o.files.includes("**/*.vue")
    );
    expect(vueOverride).toBeDefined();
    expect(vueOverride?.rules).toBeDefined();
  });

  it("does not contain any Next.js overrides or nextjs plugin", () => {
    const nextOverride = overrides.find(
      (o) => Array.isArray(o.plugins) && o.plugins.includes("nextjs")
    );
    expect(nextOverride).toBeUndefined();
  });
});
