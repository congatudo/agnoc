module.exports = {
  extends: ["./javascript"].map(require.resolve),
  overrides: [
    {
      files: ["**/*.ts"],
      extends: ["./typescript"].map(require.resolve),
    },
  ],
};
