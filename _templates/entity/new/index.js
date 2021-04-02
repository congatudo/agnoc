const pickPackage = require("../../_helpers/pick-package");

module.exports = {
  prompt(prompt) {
    return pickPackage(prompt);
  },
};
