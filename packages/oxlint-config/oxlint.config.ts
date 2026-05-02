import { ignorePatterns } from '@area44/oxc-shared-config';
import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: [
    'typescript',
    'unicorn',
    'react',
    'react-perf',
    'import',
    'jsx-a11y',
    'node',
    'promise',
    'vitest',
    'vue',
  ],
  rules: {
    eqeqeq: 'error',
    'no-unused-vars': 'warn',
  },
  ignorePatterns,
});
