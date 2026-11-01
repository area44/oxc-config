import fs from "node:fs";
import path from "node:path";
import { ignorePatterns } from "../../internal/shared/ignore-patterns";
import { createFrameworkOverrides } from "../../packages/oxlint/src/overrides/frameworks";
import { describe, expect, it } from "vitest";

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
    const reactOverride = overrides.find((o) =>
      Array.isArray(o.files) && o.files.includes("**/*.{jsx,tsx}")
    );
    expect(reactOverride).toBeDefined();
    expect(reactOverride?.rules).toBeDefined();
  });

  it("creates Vue override matching .vue", () => {
    const vueOverride = overrides.find((o) =>
      Array.isArray(o.files) && o.files.includes("**/*.vue")
    );
    expect(vueOverride).toBeDefined();
    expect(vueOverride?.rules).toBeDefined();
  });

  it("creates Next.js override matching routes, components, hooks, lib, and middleware", () => {
    const nextOverride = overrides.find((o) =>
      Array.isArray(o.files) && o.files.includes("**/components/**/*.{js,jsx,ts,tsx}")
    );
    expect(nextOverride).toBeDefined();
    expect(nextOverride?.plugins).toEqual(["nextjs"]);
    const files = nextOverride?.files as string[];
    expect(files).toContain("**/app/**/*.{js,jsx,ts,tsx}");
    expect(files).toContain("**/pages/**/*.{js,jsx,ts,tsx}");
    expect(files).toContain("**/src/app/**/*.{js,jsx,ts,tsx}");
    expect(files).toContain("**/src/pages/**/*.{js,jsx,ts,tsx}");
    expect(files).toContain("**/components/**/*.{js,jsx,ts,tsx}");
    expect(files).toContain("**/src/components/**/*.{js,jsx,ts,tsx}");
    expect(files).toContain("**/hooks/**/*.{js,jsx,ts,tsx}");
    expect(files).toContain("**/src/hooks/**/*.{js,jsx,ts,tsx}");
    expect(files).toContain("**/lib/**/*.{js,jsx,ts,tsx}");
    expect(files).toContain("**/src/lib/**/*.{js,jsx,ts,tsx}");
    expect(files).toContain("**/middleware.{js,ts}");
    expect(files).toContain("**/src/middleware.{js,ts}");
  });
});
