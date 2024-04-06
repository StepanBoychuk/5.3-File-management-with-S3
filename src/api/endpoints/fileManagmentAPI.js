const { Router } = require("express");
const multer = require("multer");
const logger = require("./../../logger.js");
const { uploadFile } = require("./../../services/s3.js");
const checkRequestSize = require("../../middlwares/checkRequestSize.js");
const ifFileExist = require("./../../middlwares/ifFileExist.js");
const generateName = require("./../../services/generateUniqueFileName.js");
const saveFile = require("../../services/saveFile.js");
const getFilesList = require("./../../services/getFilesList.js");
const getFile = require("./../../services/getFile.js");
const deleteFile = require("./../../services/deleteFile.js");

const filesAPI = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

filesAPI.get("/api/files", async (req, res) => {
  try {
    const page = req.query.page || 0;
    const perPage = req.query.perPage || 5;
    if (perPage > 100) {
      res
        .status(400)
        .send(
          "The data you are trying to request in a single request is to large"
        );
    }
    return res.send(await getFilesList(page, perPage));
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

filesAPI.get("/api/files/:id", ifFileExist, async (req, res) => {
  try {
    const file = await getFile(req.params.id);
    res.send(file);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

filesAPI.post(
  "/api/files",
  checkRequestSize,
  upload.single(),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }
      const fileName = generateName();
      await uploadFile(req.file.buffer, fileName, req.file.mimetype);
      await saveFile(fileName);
      res.status(201).send();
    } catch (error) {
      logger.error(error);
      res.status(500).send(error.message);
    }
  }
);

filesAPI.delete("/api/files/:id", ifFileExist, async (req, res) => {
  try {
    deleteFile(req.params.id);
    res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = filesAPI;
