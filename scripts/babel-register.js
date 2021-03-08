require("@babel/register")({
  extensions: [".ts", ".js"],
  configFile: require("path").resolve(__dirname, "..", ".babelrc.js"),
});
