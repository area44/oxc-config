import { defineConfig } from 'oxfmt';
import { ignorePatterns } from '@area44/oxc-shared-config';

export default defineConfig({
  printWidth: 80,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  ignorePatterns,
});
