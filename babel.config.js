module.exports = function (api) {
  api.cache(true);

  const presets = [
    "@babel/typescript",
    [
      "@babel/preset-env",
      {
        corejs: 3,
        useBuiltIns: "usage",
        targets: ["node >= 12.3"],
      },
    ],
  ];

  const plugins = [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-proposal-private-methods", { loose: true }],
    ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
    [
      "babel-plugin-module-resolver",
      {
        extensions: [".js", ".ts", ".json"],
        alias: {
          "^(@agnoc/[^/]+)/(?!lib)(.+)$": "\\1/lib/\\2",
        },
      },
    ],
  ];

  return {
    presets,
    plugins,
  };
};
