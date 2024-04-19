const cleanFilesList = (s3BucketContent) => {
  if (!s3BucketContent) {
    return;
  }
  return s3BucketContent.map((file) => {
    return {
      name: file.Key,
      size: file.Size,
    };
  });
};

module.exports = cleanFilesList;
