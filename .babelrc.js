module.exports = {
  presets: [
    "@babel/typescript",
    [
      "@babel/preset-env",
      {
        corejs: 3,
        useBuiltIns: "usage",
        targets: ["node >= 12.3"],
      },
    ],
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    [
      "babel-plugin-module-resolver",
      {
        alias: {
          "^(@agnoc/[^/]+)/(?!lib)(.+)$": "\\1/lib/\\2",
        },
      },
    ],
  ],
};
