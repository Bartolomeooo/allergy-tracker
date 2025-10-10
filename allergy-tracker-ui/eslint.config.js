import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import {defineConfig, globalIgnores} from 'eslint/config';
import prettier from 'eslint-config-prettier';
import vitest from '@vitest/eslint-plugin';
import importX from 'eslint-plugin-import-x';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      'import-x': importX,
      'unused-imports': unusedImports,
    },
  },

  {
    files: ['**/*.{test,spec}.{ts,tsx}'],
    ...vitest.configs.recommended,
  },
]);
