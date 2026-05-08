require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const origins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000'];

async function run() {
  await s3.send(new PutBucketCorsCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    CORSConfiguration: {
      CORSRules: [{
        AllowedOrigins: origins,
        AllowedMethods: ['PUT'],
        AllowedHeaders: ['Content-Type'],
        MaxAgeSeconds: 3600,
      }],
    },
  }));
  console.log(`S3 CORS policy set for bucket: ${process.env.S3_BUCKET_NAME}`);
  console.log(`Allowed origins: ${origins.join(', ')}`);
}

run().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
