module.exports = {
  presets: [
    "@babel/typescript",
    [
      "@babel/preset-env",
      {
        corejs: 3,
        useBuiltIns: "usage",
        targets: ["node >= 10"],
      },
    ],
  ],
};
