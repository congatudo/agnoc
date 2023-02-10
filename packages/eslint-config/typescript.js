const path = require("path");

module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    project: path.resolve(__dirname, "../../tsconfig.json"),
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:security/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:mocha/recommended",
    "plugin:chai-friendly/recommended",
    "plugin:prettier/recommended",
  ],
  settings: {
    "import/resolver": {
      "babel-module": {
        extensions: [".js", ".ts", ".json"],
        alias: {
          "^(@agnoc/[^/]+)/(?!lib)(.+)$": "\\1/src/\\2",
        },
      },
    },
  },
  rules: {
    "node/no-unsupported-features/es-syntax": "off",
    "security/detect-object-injection": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_.*$",
        varsIgnorePattern: "^_.*$",
      },
    ],
    "import/order": [
      "warn",
      {
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
      },
    ],
  },
};
