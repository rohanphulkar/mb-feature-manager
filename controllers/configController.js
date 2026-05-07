const FeatureFlag = require('../models/FeatureFlag');
const verifySignature = require('../utils/verifySignature');

// Main config endpoint
exports.getConfig = async (req, res) => {
  try {
    const { appId, timestamp, signature } = req.body;

    // 1. Verify Signature
    const isValid = verifySignature(appId, timestamp, signature);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid application ID or signature'
      });
    }

    // 2. Fetch all flags
    const flagsList = await FeatureFlag.find();

    // 3. Convert to key-value object
    const flags = {};
    flagsList.forEach(flag => {
      flags[flag.key] = flag.value;
    });

    // 4. Return config
    res.json({
      success: true,
      cacheDurationHours: 12,
      flags
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
