const crypto = require('crypto');

/**
 * Verifies the signature of the incoming request
 * Logic: SHA256(APP_ID + timestamp + SECRET_KEY)
 */
const verifySignature = (appId, timestamp, signature) => {
  if (!appId || !timestamp || !signature) {
    return false;
  }

  const secretKey = process.env.SECRET_KEY;
  const configAppId = process.env.APP_ID;

  // Verify APP_ID matches
  if (appId !== configAppId) {
    return false;
  }

  // Optional: Verify timestamp is not too old (e.g., within 5 minutes)
  const now = Date.now();
  const requestTime = parseInt(timestamp);
  const fiveMinutes = 5 * 60 * 1000;

  if (isNaN(requestTime) || Math.abs(now - requestTime) > fiveMinutes) {
    console.log('Timestamp verification failed');
    // For extreme security, you might want to uncomment this
    // return false; 
  }

  // Regenerate signature
  const data = appId + timestamp + secretKey;
  const expectedSignature = crypto
    .createHash('sha256')
    .update(data)
    .digest('hex');

  return signature === expectedSignature;
};

module.exports = verifySignature;
