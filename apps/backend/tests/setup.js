const bcrypt = require('bcryptjs');

// Set all env vars required by the app before any module is loaded.
// Tests never read from .env — all values are defined here explicitly.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.CLOUDFRONT_KEY_PAIR_ID = 'TEST_KEY_PAIR_ID';
process.env.CLOUDFRONT_PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA0Z3VS5JJcds3xHn\n-----END RSA PRIVATE KEY-----';
process.env.CLOUDFRONT_DOMAIN = 'test.cloudfront.net';
process.env.S3_BUCKET_NAME = 'test-bucket';
process.env.APP_AWS_REGION = 'us-east-1';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Hash of 'testpassword' — low cost factor (4) for test speed
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync('testpassword', 4);
