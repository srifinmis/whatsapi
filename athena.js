require("dotenv").config();
const AWS = require("aws-sdk");
const { AthenaExpress } = require("athena-express");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const athenaExpress = new AthenaExpress({
  aws: AWS,
  s3: process.env.ATHENA_S3_OUTPUT_BUCKET,
  db: process.env.ATHENA_DB,
});

module.exports = athenaExpress;
