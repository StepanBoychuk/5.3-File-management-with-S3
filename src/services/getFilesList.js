const File = require("./../models/File.js");

const getFilesList = async (page, perPage) => {
  return await File.find()
    .skip(page * perPage)
    .limit(perPage);
};

module.exports = getFilesList;
