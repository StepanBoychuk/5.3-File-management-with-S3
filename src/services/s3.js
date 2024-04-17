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

const ifObjectExists = async (fileName, folderName) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: folderName + fileName,
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

const getFilesList = async (folderName) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: folderName,
  };
  return s3.send(new ListObjectsV2Command(params));
};

const uploadFile = async (fileBuffer, fileName, mimetype, folderName) => {
  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Body: fileBuffer,
    Key: folderName + fileName,
    ContentType: mimetype,
  };

  return s3.send(new PutObjectCommand(uploadParams));
};

const getFileUrl = async (fileName, folderName) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: folderName + fileName,
  });
  return await getSignedUrl(s3, command);
};

const deleteFile = (fileName, folderName) => {
  return s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: folderName + fileName,
    })
  );
};

const deleteFolder = async (folderName) => {
  const deletePromises = [];
  const listParams = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: folderName,
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
  deleteFile,
  deleteFolder,
};
