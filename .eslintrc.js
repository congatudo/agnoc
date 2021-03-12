module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "script",
  },
  plugins: ["node", "prettier", "security"],
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:security/recommended",
    "plugin:prettier/recommended",
  ],
  settings: {
    node: {
      allowModules: ["@agnoc/core", "@agnoc/cli", "tiny-typed-emitter"],
      tryExtensions: [".js", ".ts", ".json"],
    },
  },
};
