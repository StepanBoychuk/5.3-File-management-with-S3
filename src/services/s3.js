const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.USER_ACCESS_KEY,
    secretAccessKey: process.env.USER_SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

const uploadFile = async (fileBuffer, fileName, mimetype) => {
  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype,
  };

  return s3.send(new PutObjectCommand(uploadParams));
};

const getFileUrl = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
  });
  return await getSignedUrl(s3, command);
};

const deleteFileFromBucket = (fileName) => {
  return s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
    })
  );
};

module.exports = {
  uploadFile,
  getFileUrl,
  deleteFileFromBucket,
};
