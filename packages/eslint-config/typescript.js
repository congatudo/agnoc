const path = require('path');

module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
    project: path.resolve(__dirname, '../../tsconfig.json'),
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:security/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:mocha/recommended',
    'plugin:chai-friendly/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/resolver': {
      'babel-module': {
        extensions: ['.js', '.ts', '.json'],
        alias: {
          '^(@agnoc/[^/]+)$': '\\1/src',
        },
      },
    },
  },
  rules: {
    'node/no-missing-import': 'off',
    'node/no-extraneous-import': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'security/detect-object-injection': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_.*$',
        varsIgnorePattern: '^_.*$',
      },
    ],
    'import/no-absolute-path': 'error',
    'import/no-relative-packages': 'error',
    'import/no-useless-path-segments': 'error',
    'import/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
      },
    ],
  },
};
