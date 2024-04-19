const { Router } = require("express");
const multer = require("multer");
const logger = require("./../../logger.js");
const {
  ifObjectExists,
  uploadFile,
  getFilesList,
  getFileUrl,
  deleteObject,
} = require("./../../services/s3.js");
const cleanFilesList = require("./../../services/cleanFilesList.js");
const checkRequestSize = require("../../middlwares/checkRequestSize.js");
const checkIfFileExists = require("./../../middlwares/checkIfFileExists.js");

const filesAPI = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

filesAPI.get("/api/filesystem", async (req, res) => {
  try {
    const { Contents } = await getFilesList();
    res.send(cleanFilesList(Contents));
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

filesAPI.get(
  "/api/filesystem/:path(*)",
  checkIfFileExists,
  async (req, res) => {
    const { path } = req.params;
    try {
      res.send(await getFileUrl(path));
    } catch (error) {
      logger.error(error);
      res.status(500).send(error.message);
    }
  }
);

filesAPI.post(
  "/api/filesystem/:path(*)?",
  checkRequestSize,
  upload.single(),
  async (req, res) => {
    let filePath;
    const { path } = req.params;
    if (path == undefined) {
      filePath = req.file.originalname;
    } else {
      filePath = path + "/" + req.file.originalname;
    }
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }
      const isExist = await ifObjectExists(filePath);
      if (isExist) {
        return res.status(409).send("File with this name is already exist");
      }
      await uploadFile(req.file.buffer, filePath, req.file.mimetype);
      res.status(201).send();
    } catch (error) {
      logger.error(error);
      res.status(500).send(error.message);
    }
  }
);

filesAPI.delete("/api/filesystem/:path(*)?", async (req, res) => {
  const filePath = req.params.path;
  try {
    await deleteObject(filePath);
    res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = filesAPI;
