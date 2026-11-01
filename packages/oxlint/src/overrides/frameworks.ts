import { next, react, vitest, vue } from "../upstream/index";

export const createFrameworkOverrides = (): Record<string, unknown>[] => {
  const overrides: Record<string, unknown>[] = [];

  // Vitest test overrides from upstream
  if (vitest.overrides && Array.isArray(vitest.overrides)) {
    for (const ov of vitest.overrides) {
      overrides.push(ov);
    }
  }

  // React component and hook rules for JSX/TSX files
  if (react.rules && Object.keys(react.rules).length > 0) {
    overrides.push({
      files: ["**/*.{jsx,tsx}"],
      rules: {
        ...react.rules,
      },
    });
  }

  // Vue single-file component rules
  if (vue.rules && Object.keys(vue.rules).length > 0) {
    overrides.push({
      files: ["**/*.vue"],
      rules: {
        ...vue.rules,
      },
    });
  }

  // Next.js overrides:
  // Strictly scoped to Next.js route, page, and middleware files to prevent
  // false positives on generic React projects (e.g. components/, hooks/, lib/).
  if (next.rules && Object.keys(next.rules).length > 0) {
    overrides.push({
      files: [
        "**/app/**/*.{js,jsx,ts,tsx}",
        "**/pages/**/*.{js,jsx,ts,tsx}",
        "**/src/app/**/*.{js,jsx,ts,tsx}",
        "**/src/pages/**/*.{js,jsx,ts,tsx}",
        "**/middleware.{js,ts}",
        "**/src/middleware.{js,ts}",
      ],
      plugins: ["nextjs"],
      rules: {
        ...next.rules,
      },
    });
  }

  return overrides;
};
