module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'script'
  },
  plugins: [
    'node',
  ],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
  ],
  settings: {
    node: {
      tryExtensions: ['.js', '.ts', '.json']
    }
  },
  overrides: [{
    files: [
      'src/**/*.{js,ts}',
      'test/**/*.{js,ts}',
    ],
    parserOptions: {
      ecmaVersion: 2020,
      project: './tsconfig.json',
      sourceType: 'module'
    },
    plugins: [
      '@typescript-eslint',
      'node',
    ],
    extends: [
      'eslint:recommended',
      'plugin:node/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    rules: {
      'node/no-unsupported-features/es-syntax': 0,
      'no-use-before-define': 0,
      'no-unused-vars': 0,
    },
  }]
};
