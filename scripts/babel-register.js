require('@babel/register')({
  rootMode: 'upward',
  extensions: ['.ts', '.js'],
  ignore: [/node_modules/],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'babel-plugin-module-resolver',
      {
        extensions: ['.js', '.ts', '.json'],
        alias: {
          '^(@agnoc/[^/]+)$': '\\1/src',
        },
      },
    ],
  ],
});
