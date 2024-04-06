require("dotenv").config();
const logger = require("./src/logger.js");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const filesAPI = require("./src/api/endpoints/fileManagmentAPI.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", filesAPI);

app.listen(process.env.API_PORT, () => {
  console.log(`Server is running on port ${process.env.API_PORT}`);
});
mongoose
  .connect(
    `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  )
  .catch((error) => logger.error(error))
  .then(() => console.log("MongoDB connected"));
