const Environment = require('../models/Environment');

// Get all environments
exports.getAllEnvironments = async (req, res) => {
  try {
    const environments = await Environment.find().sort({ name: 1 });
    res.json({ success: true, data: environments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new environment
exports.createEnvironment = async (req, res) => {
  try {
    const { name, key, description } = req.body;
    
    if (!name || !key) {
      return res.status(400).json({ success: false, error: 'Name and key are required' });
    }

    const environment = new Environment({ name, key, description });
    await environment.save();
    
    res.status(201).json({ success: true, data: environment });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Environment key already exists' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update an environment
exports.updateEnvironment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    const environment = await Environment.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!environment) {
      return res.status(404).json({ success: false, error: 'Environment not found' });
    }

    res.json({ success: true, data: environment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete an environment
exports.deleteEnvironment = async (req, res) => {
  try {
    const { id } = req.params;
    const environment = await Environment.findByIdAndDelete(id);

    if (!environment) {
      return res.status(404).json({ success: false, error: 'Environment not found' });
    }

    // Note: We might want to handle what happens to feature flags associated with this environment
    // For now, we'll just delete the environment
    res.json({ success: true, message: 'Environment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
