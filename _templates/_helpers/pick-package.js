const { readdir } = require("fs").promises;
const path = require("path");

async function getPackageList() {
  const packages = path.resolve(__dirname, "..", "..", "packages");

  return await readdir(packages);
}

module.exports = async function pickPackage({ prompter, args }) {
  const packages = await getPackageList();
  const prompt = {
    type: "select",
    name: "package",
    message: "Choose destination package",
    choices: packages,
    skip() {
      return Boolean(args.package);
    },
  };

  const answers = await prompter.prompt(prompt);
  const package = answers.package || args.package;

  if (!package) {
    throw new Error("Missing 'package' mandatory parameter");
  }

  if (!packages.includes(package)) {
    throw new Error(
      `Invalid 'package' parameter. Possible values: ${packages.join(", ")}`
    );
  }

  return { package };
};
