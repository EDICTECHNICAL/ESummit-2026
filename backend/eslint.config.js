module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      // Keep default recommended rules; project-specific rules can be added here
    },
  },
];
