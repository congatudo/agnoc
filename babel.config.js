const pkg = require('./package.json');

module.exports = function (api) {
  api.cache(true);

  const presets = [
    '@babel/typescript',
    [
      '@babel/preset-env',
      {
        corejs: 3,
        useBuiltIns: 'usage',
        targets: [`node ${pkg.engines.node}`],
      },
    ],
  ];

  const plugins = [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'babel-plugin-module-resolver',
      {
        extensions: ['.js', '.ts', '.json'],
        alias: {
          '^(@agnoc/[^/]+)$': '\\1/lib',
        },
      },
    ],
  ];

  return {
    presets,
    plugins,
    ignore: getIgnorePatterns(process.env.NODE_ENV),
  };
};

function getIgnorePatterns(nodeEnv) {
  if (nodeEnv === 'production') {
    return ['**/*.test.ts'];
  }

  return [];
}
