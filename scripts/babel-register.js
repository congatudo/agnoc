require('@babel/register')({
  rootMode: 'upward',
  extensions: ['.ts', '.js'],
  ignore: [/node_modules/],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    [
      'babel-plugin-module-resolver',
      {
        extensions: ['.js', '.ts', '.json'],
        alias: {
          '^(@agnoc/[^/]+)/(?!lib)(.+)$': '\\1/src/\\2',
        },
      },
    ],
  ],
});
