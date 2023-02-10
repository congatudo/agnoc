module.exports = {
  parserOptions: {
    sourceType: 'script',
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:security/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    node: {
      allowModules: ['@agnoc/core', '@agnoc/cli'],
      tryExtensions: ['.js', '.ts', '.json'],
    },
  },
};
