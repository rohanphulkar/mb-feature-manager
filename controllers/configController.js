const FeatureFlag = require('../models/FeatureFlag');
const verifySignature = require('../utils/verifySignature');

const Environment = require('../models/Environment');

// Main config endpoint
exports.getConfig = async (req, res) => {
  try {
    const { appId, timestamp, signature, environment: environmentKey } = req.body;

    // 1. Verify Signature
    const isValid = verifySignature(appId, timestamp, signature);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid application ID or signature'
      });
    }

    if (!environmentKey) {
      return res.status(400).json({
        success: false,
        error: 'Environment is required'
      });
    }

    // 2. Find environment
    const env = await Environment.findOne({ key: environmentKey.toLowerCase() });
    if (!env) {
      return res.status(404).json({
        success: false,
        error: 'Environment not found'
      });
    }

    // 3. Fetch all flags for this environment
    const flagsList = await FeatureFlag.find({ environment: env._id });

    // 4. Convert to key-value object
    const flags = {};
    flagsList.forEach(flag => {
      flags[flag.key] = flag.value;
    });

    // 5. Return config
    res.json({
      success: true,
      environment: env.name,
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
