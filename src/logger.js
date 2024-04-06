const pino = require("pino");
const path = require("path");

const pinoConfig = {
  targets: [
    {
      level: "trace",
      target: "pino/file",
      options: { destination: path.join(__dirname, "..", "tmp", "errors.log") },
    },
  ],
};

const logger = pino(pino.transport(pinoConfig));

module.exports = logger;
