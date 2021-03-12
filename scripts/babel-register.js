require("@babel/register")({
  rootMode: "upward",
  extensions: [".ts", ".js"],
  ignore: [/node_modules/],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    [
      "babel-plugin-module-resolver",
      {
        extensions: [".js", ".ts", ".json"],
        alias: {
          "^(@agnoc/[^/]+)/(?!lib)(.+)$": "\\1/src/\\2",
        },
      },
    ],
  ],
});
