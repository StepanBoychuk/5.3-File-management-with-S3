require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const filesAPI = require("./src/api/endpoints/fileManagmentAPI.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", filesAPI);

app.listen(process.env.API_PORT, () => {
  console.log(`Server is running on port ${process.env.API_PORT}`);
});

