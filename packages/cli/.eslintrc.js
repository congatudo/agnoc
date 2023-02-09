const path = require("path");

module.exports = {
  overrides: [
    {
      files: ["src/**/*.{js,ts}", "test/**/*.{js,ts}"],
      parserOptions: {
        ecmaVersion: 2020,
        project: path.resolve(__dirname, "../../tsconfig.json"),
        sourceType: "module",
      },
      plugins: ["@typescript-eslint", "node", "prettier", "security"],
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
        "node/no-unsupported-features/es-syntax": 0,
        "security/detect-object-injection": 0,
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
    },
  ],
};
