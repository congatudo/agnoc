const path = require("path");

module.exports = {
  overrides: [
    {
      files: ["src/**/*.{js,ts}", "test/**/*.{js,ts}", "types/**/*.ts"],
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
        "plugin:prettier/recommended",
      ],
      settings: {
        node: {
          tryExtensions: [".js", ".ts", ".json"],
        },
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
        "import/order": 1,
        "node/no-unsupported-features/es-syntax": 0,
        "security/detect-object-injection": 0,
        "@typescript-eslint/no-unused-vars": [
          1,
          {
            varsIgnorePattern: "^_",
          },
        ],
      },
    },
  ],
};
