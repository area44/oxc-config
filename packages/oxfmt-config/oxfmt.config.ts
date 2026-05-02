import { ignorePatterns } from '@area44/oxc-shared-config';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  printWidth: 80,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  sortImports: {
    groups: [
      'type-import',
      ['value-builtin', 'value-external'],
      'type-internal',
      'value-internal',
      ['type-parent', 'type-sibling', 'type-index'],
      ['value-parent', 'value-sibling', 'value-index'],
      'unknown',
    ],
  },
  ignorePatterns,
});
