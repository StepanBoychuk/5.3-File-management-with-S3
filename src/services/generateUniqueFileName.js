const crypto = require("crypto");

const generateName = () => {
  return crypto.randomBytes(32).toString("hex");
};
module.exports = generateName;
