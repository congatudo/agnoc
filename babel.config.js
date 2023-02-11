module.exports = function (api) {
  api.cache(true);

  const presets = [
    '@babel/typescript',
    [
      '@babel/preset-env',
      {
        corejs: 3,
        useBuiltIns: 'usage',
        targets: ['node >= 18.12'],
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
  };
};
