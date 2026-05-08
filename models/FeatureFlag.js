const mongoose = require('mongoose');

const FeatureFlagSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  environment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Environment',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index for key and environment
FeatureFlagSchema.index({ key: 1, environment: 1 }, { unique: true });

// Update the updatedAt field before saving
FeatureFlagSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FeatureFlag', FeatureFlagSchema);
