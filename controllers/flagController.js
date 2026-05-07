const FeatureFlag = require('../models/FeatureFlag');

// Get all flags
exports.getAllFlags = async (req, res) => {
  try {
    const flags = await FeatureFlag.find().sort({ key: 1 });
    res.json({ success: true, data: flags });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new flag
exports.createFlag = async (req, res) => {
  try {
    const { key, value, description } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({ success: false, error: 'Key and value are required' });
    }

    const flag = new FeatureFlag({ key, value, description });
    await flag.save();
    
    res.status(201).json({ success: true, data: flag });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Flag key already exists' });
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
