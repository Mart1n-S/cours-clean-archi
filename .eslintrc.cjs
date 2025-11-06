/*
  ESLint configuration focused on:
  - Naming conventions (camelCase, PascalCase, SNAKE_CASE for constants)
  - TypeScript best practices

  Note: To activate, install:
    npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import
*/

module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  ignorePatterns: ['dist/**', 'coverage/**', 'node_modules/**'],
  rules: {
    // Naming conventions
    '@typescript-eslint/naming-convention': [
      'error',
      // Variables (allow UPPER_CASE for consts)
      {
        selector: 'variable',
        format: ['camelCase'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['camelCase', 'UPPER_CASE']
      },
      // Functions and methods use camelCase
      {
        selector: 'function',
        format: ['camelCase']
      },
      {
        selector: 'method',
        format: ['camelCase']
      },
      // Types, classes, interfaces use PascalCase
      {
        selector: 'typeLike',
        format: ['PascalCase']
      },
      // Enum members are UPPER_CASE
      {
        selector: 'enumMember',
        format: ['UPPER_CASE']
      }
    ],

    // Import hygiene
    'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc', caseInsensitive: true } }],

    // Stylistic relaxations suited for this repo
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  },
  overrides: [
    // Tests: relax some rules
    {
      files: ['**/*.spec.ts'],
      rules: {
        '@typescript-eslint/naming-convention': 'off'
      }
    }
  ]
}

