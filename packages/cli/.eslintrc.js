module.exports = {
  overrides: [
    {
      files: ["src/**/*.{js,ts}", "test/**/*.{js,ts}"],
      parserOptions: {
        ecmaVersion: 2020,
        project: "./tsconfig.json",
        sourceType: "module",
      },
      plugins: ["@typescript-eslint", "node", "prettier", "security"],
      extends: [
        "eslint:recommended",
        "plugin:node/recommended",
        "plugin:security/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended",
      ],
      settings: {
        node: {
          tryExtensions: [".js", ".ts", ".json"],
        },
      },
      rules: {
        "node/no-unsupported-features/es-syntax": 0,
      },
    },
  ],
};
