import { customPlugins, customRules, ignorePatterns } from "./custom/index";
import { createFrameworkOverrides } from "./overrides/frameworks";
import { core } from "./upstream/index";

export const composeOxlintConfig = (): Record<string, unknown> => {
  const upstreamOverrides = Array.isArray(core.overrides) ? core.overrides : [];
  const frameworkOverrides = createFrameworkOverrides();

  const plugins = [...new Set([...(core.plugins || []), ...customPlugins])];

  const rules = {
    ...core.rules,
    ...customRules,
  };

  const overrides = [...upstreamOverrides, ...frameworkOverrides];

  return {
    $schema: "./node_modules/oxlint/configuration_schema.json",
    env: core.env || { browser: true },
    ignorePatterns,
    overrides,
    plugins,
    rules,
  };
};
