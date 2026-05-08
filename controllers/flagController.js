const FeatureFlag = require('../models/FeatureFlag');

// Get all flags
exports.getAllFlags = async (req, res) => {
  try {
    const { environmentId } = req.query;
    const filter = environmentId ? { environment: environmentId } : {};
    const flags = await FeatureFlag.find(filter).populate('environment').sort({ key: 1 });
    res.json({ success: true, data: flags });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new flag
exports.createFlag = async (req, res) => {
  try {
    const { key, value, description, environmentId } = req.body;
    
    if (!key || value === undefined || !environmentId) {
      return res.status(400).json({ success: false, error: 'Key, value, and environmentId are required' });
    }

    const flag = new FeatureFlag({ key, value, description, environment: environmentId });
    await flag.save();
    
    res.status(201).json({ success: true, data: flag });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Flag key already exists in this environment' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a flag
exports.updateFlag = async (req, res) => {
  try {
    const { value, description } = req.body;
    const { id } = req.params;

    const flag = await FeatureFlag.findByIdAndUpdate(
      id,
      { value, description, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!flag) {
      return res.status(404).json({ success: false, error: 'Flag not found' });
    }

    res.json({ success: true, data: flag });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a flag
exports.deleteFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const flag = await FeatureFlag.findByIdAndDelete(id);

    if (!flag) {
      return res.status(404).json({ success: false, error: 'Flag not found' });
    }

    res.json({ success: true, message: 'Flag deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
