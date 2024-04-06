const { Schema, model } = require("mongoose");

const fileSchema = new Schema({
  fileName: {
    type: String,
    unique: true,
  },
  url: {
    type: String
  }
});

const File = model("File", fileSchema, "files");

module.exports = File;
