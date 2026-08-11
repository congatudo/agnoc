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
      allowModules: ['@congatudo/core', '@congatudo/cli'],
      tryExtensions: ['.js', '.ts', '.json'],
    },
  },
};
