const File = require("../models/File.js");
const { deleteFileFromBucket } = require("./s3.js");

const deleteFile = async (fileId) => {
  const file = await File.findById(fileId);
  deleteFileFromBucket(file.fileName);
  await File.findByIdAndDelete(fileId);
};

module.exports = deleteFile;
