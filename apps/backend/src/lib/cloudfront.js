const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');

// CLOUDFRONT_PRIVATE_KEY may be stored with literal \n in the env — normalize it
const privateKey = () => process.env.CLOUDFRONT_PRIVATE_KEY?.replace(/\\n/g, '\n');

function signUrl(url) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

  return getSignedUrl({
    url,
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKey: privateKey(),
    dateLessThan: expiresAt.toISOString(),
  });
}

module.exports = { signUrl };
