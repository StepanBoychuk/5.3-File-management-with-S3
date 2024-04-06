const File = require("../models/File.js");
const { getFileUrl} = require('./s3.js')

const saveFile = async (fileName) => {
  const file = new File({
    fileName: fileName,
    url: await getFileUrl(fileName)
  });
  await file.save();
};

module.exports = saveFile;
