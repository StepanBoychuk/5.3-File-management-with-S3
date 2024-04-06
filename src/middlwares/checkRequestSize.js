const checkRequestSize = (req, res, next) => {
  const maxFileSize = 10 * 1024 * 1024; //10MB
  if (req.headers["content-length"] > maxFileSize) {
    return res.status(413).send("File size is too big.")
  }
  next()
};

module.exports = checkRequestSize
