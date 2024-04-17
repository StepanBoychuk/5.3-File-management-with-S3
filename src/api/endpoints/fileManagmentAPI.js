const { Router } = require("express");
const multer = require("multer");
const logger = require("./../../logger.js");
const {
  ifObjectExists,
  uploadFile,
  getFilesList,
  getFileUrl,
  deleteFile,
  deleteFolder
} = require("./../../services/s3.js");
const cleanFilesList = require("./../../services/cleanFilesList.js");
const checkRequestSize = require("../../middlwares/checkRequestSize.js");
const checkIfFileExists = require('./../../middlwares/checkIfFileExists.js')

const filesAPI = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


filesAPI.get("/api/filesystem", async (req, res) => {
  const folder = req.body.folder + '/' || ''
  try {
    const { Contents } = await getFilesList(folder);
    res.send(cleanFilesList(Contents));
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

filesAPI.get("/api/filesystem/:filename", checkIfFileExists, async (req, res) => {
  const folder = req.body.folder + '/' || ''
  try {
    res.send(await getFileUrl(req.params.filename, folder))
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

filesAPI.post(
  "/api/filesystem",
  checkRequestSize,
  upload.single(),
  async (req, res) => {
    const folder = req.body.folder + '/' || ''
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }
      const isExist = await ifObjectExists(req.file.originalname, folder);
      if (isExist) {
        return res.status(409).send("File with this name is already exist");
      }
      await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        folder
      );
      res.status(201).send();
    } catch (error) {
      logger.error(error);
      res.status(500).send(error.message);
    }
  }
);

filesAPI.delete("/api/filesystem/:filename", checkIfFileExists, async (req, res) => {
  const folder = req.body.folder + '/' || ''
  try {
    await deleteFile(req.params.filename, folder);
    res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

filesAPI.delete("/api/filesystem", async (req, res) => {
  try {
    if (!req.body.folder) {
      return res.status(400).send(`Please, add key 'folder' with value of folder name to request body`)
    }
    if (ifObjectExists('', req.body.folder)) {
      return res.status(404).send('There is no folder with this name')
    }
    deleteFolder(req.body.folder)
    res.status(204).send()
  }catch(error){
    logger.error(error)
    res.status(500).send(error.message)
  }
})

module.exports = filesAPI;
