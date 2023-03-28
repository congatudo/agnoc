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
  plugins: ['eslint-plugin-tsdoc', '@guardian/eslint-plugin-tsdoc-required'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, '../../tsconfig.json'),
      },
    },
  },
  rules: {
    'object-shorthand': ['error', 'always'],
    'tsdoc/syntax': 'warn',
    'node/no-missing-import': 'off',
    'node/no-extraneous-import': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'security/detect-object-injection': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/consistent-type-exports': 'warn',
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
    'import/no-unused-modules': 'warn',
    'import/no-internal-modules': [
      'error',
      {
        forbid: ['packages/**/*', '@agnoc/*/src/**/*'],
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.ts', '**/test/**/*.ts'],
        optionalDependencies: false,
        peerDependencies: true,
        includeInternal: true,
      },
    ],
    'import/no-unresolved': 'off',
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
    '@guardian/tsdoc-required/tsdoc-required': 'warn',
  },
  overrides: [
    {
      files: ['**/*.test.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
};
