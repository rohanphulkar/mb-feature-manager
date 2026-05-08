const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const path = require('path');

const configRoutes = require('../routes/configRoutes');
const flagRoutes = require('../routes/flagRoutes');
const environmentRoutes = require('../routes/environmentRoutes');

const app = express();

// Environment Validation
const requiredEnv = ['MONGODB_URI', 'SECRET_KEY', 'APP_ID'];
requiredEnv.forEach(env => {
  if (!process.env[env]) {
    console.error(`CRITICAL: Environment variable ${env} is missing!`);
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Request Logging
app.use((req, res, next) => {
  if (req.path !== '/') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

app.use(express.static(path.join(__dirname, '../public')));

// Database Connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected...');
    }
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
};

// Routes
app.use('/api/config', async (req, res, next) => {
  await connectDB();
  next();
}, configRoutes);

app.use('/api/flags', async (req, res, next) => {
  await connectDB();
  next();
}, flagRoutes);

app.use('/api/environments', async (req, res, next) => {
  await connectDB();
  next();
}, environmentRoutes);

// Root route - serve UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    try {
      await connectDB();
      console.log(`\x1b[32m%s\x1b[0m`, `✔ Feature Manager running on http://localhost:${PORT}`);
      console.log(`\x1b[36m%s\x1b[0m`, `ℹ Press Ctrl+C to stop`);
    } catch (e) {
      console.error('Startup error:', e);
    }
  });
}

module.exports = app;
