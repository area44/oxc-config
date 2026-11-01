// oxlint-disable unicorn/prefer-export-from
import { ignorePatterns } from "@shared";

export const area44SortImports = {
  groups: [
    "type-import",
    ["value-builtin", "value-external"],
    "type-internal",
    "value-internal",
    ["type-parent", "type-sibling", "type-index"],
    ["value-parent", "value-sibling", "value-index"],
    "unknown",
  ],
  ignoreCase: true,
  newlinesBetween: true,
  order: "asc",
};

export const area44Options = {
  ignorePatterns,
  sortImports: area44SortImports,
  tabWidth: 2,
  useTabs: false,
};

export { ignorePatterns };
