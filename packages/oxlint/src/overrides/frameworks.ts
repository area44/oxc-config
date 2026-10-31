import { next, react, vitest, vue } from "../upstream/index";

export const createFrameworkOverrides = (): Record<string, unknown>[] => {
  const overrides: Record<string, unknown>[] = [];

  if (vitest.overrides && Array.isArray(vitest.overrides)) {
    for (const ov of vitest.overrides) {
      overrides.push(ov);
    }
  }

  if (react.rules && Object.keys(react.rules).length > 0) {
    overrides.push({
      files: ["**/*.{jsx,tsx}"],
      rules: {
        ...react.rules,
      },
    });
  }

  if (vue.rules && Object.keys(vue.rules).length > 0) {
    overrides.push({
      files: ["**/*.vue"],
      rules: {
        ...vue.rules,
      },
    });
  }

  if (next.rules && Object.keys(next.rules).length > 0) {
    overrides.push({
      files: [
        "**/app/**/{page,layout,template,error,loading,not-found,default}.{js,jsx,ts,tsx}",
        "**/pages/**/*.{js,jsx,ts,tsx}",
      ],
      rules: {
        ...next.rules,
      },
    });
  }

  return overrides;
};
