const {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const logger = require("./../logger.js");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.USER_ACCESS_KEY,
    secretAccessKey: process.env.USER_SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

const ifObjectExists = async (filePath) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filePath,
  };
  try {
    await s3.send(new HeadObjectCommand(params));
    return true;
  } catch (error) {
    if (error.$metadata && error.$metadata.httpStatusCode === 404) {
      return false;
    }
    logger.error(error);
  }
};

const getFilesList = async () => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
  };
  return s3.send(new ListObjectsV2Command(params));
};

const uploadFile = async (fileBuffer, filePath, mimetype) => {
  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Body: fileBuffer,
    Key: filePath,
    ContentType: mimetype,
  };

  return s3.send(new PutObjectCommand(uploadParams));
};

const getFileUrl = async (filePath) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: filePath,
  });
  return await getSignedUrl(s3, command);
};

const deleteObject = async (objectPath) => {
  const deletePromises = [];
  const listParams = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: objectPath,
  };
  const { Contents } = await s3.send(new ListObjectsV2Command(listParams));
  Contents.forEach(({ Key }) => {
    deletePromises.push(
      s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: Key,
        })
      )
    );
  });
  await Promise.all(deletePromises);
};

module.exports = {
  getFilesList,
  uploadFile,
  ifObjectExists,
  getFileUrl,
  deleteObject,
};
