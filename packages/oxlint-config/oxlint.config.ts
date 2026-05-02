import { defineConfig } from 'oxlint';
import { ignorePatterns } from '@area44/shared-config';

export default defineConfig({
  plugins: ['typescript', 'import', 'unicorn', 'react'],
  rules: {
    eqeqeq: 'error',
    'no-unused-vars': 'warn',
  },
  ignorePatterns,
});
