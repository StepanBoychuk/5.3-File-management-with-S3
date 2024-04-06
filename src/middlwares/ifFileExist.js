const File = require("./../models/File.js");

const ifFileExist = async (req, res, next) => {
  try {
    await File.exists({ _id: req.params.id });
    next()
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(404).send("User not found");
    }
    res.status(500).send(error.message);
  }
};

module.exports = ifFileExist;
