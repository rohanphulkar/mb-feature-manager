const mongoose = require('mongoose');
const FeatureFlag = require('../models/FeatureFlag');
require('dotenv').config();

const defaultFlags = [
  // API Configuration
  {
    key: 'API_URL',
    value: 'https://v2.malibandhu.com/api/v1',
    description: 'The main backend API endpoint'
  },
  {
    key: 'CLERK_PUBLISHABLE_KEY',
    value: 'pk_test_c2F2aW5nLWJpcmQtODcuY2xlcmsuYWNjb3VudHMuZGV2JA',
    description: 'Clerk Publishable Key for authentication'
  },
  
  // Feature Flags
  {
    key: 'MATRIMONY_ENABLED',
    value: true,
    description: 'Toggle for the Matrimony module'
  },
  {
    key: 'NOTIFICATIONS_ENABLED',
    value: true,
    description: 'Toggle for real-time notifications'
  },
  {
    key: 'CHAT_ENABLED',
    value: true,
    description: 'Toggle for personal and group chat'
  },
  {
    key: 'SOCIAL_FEED_ENABLED',
    value: true,
    description: 'Toggle for the social community feed'
  },
  {
    key: 'DEBUG_MODE',
    value: false,
    description: 'Enables detailed logging and development tools'
  },

  // UI Settings
  {
    key: 'DEBOUNCE_DELAY',
    value: 500,
    description: 'Delay in milliseconds for search and input debouncing'
  },
  {
    key: 'PAGINATION_LIMIT',
    value: 20,
    description: 'Number of items to load per page in lists'
  }
];

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB for seeding defaults...');
    
    let addedCount = 0;
    let skippedCount = 0;

    for (const flagData of defaultFlags) {
      const exists = await FeatureFlag.findOne({ key: flagData.key });
      if (!exists) {
        await FeatureFlag.create(flagData);
        console.log(`[CREATED] ${flagData.key}`);
        addedCount++;
      } else {
        console.log(`[SKIPPED] ${flagData.key} (already exists)`);
        skippedCount++;
      }
    }

    console.log('\n-----------------------------------');
    console.log(`Seeding complete!`);
    console.log(`New flags added: ${addedCount}`);
    console.log(`Existing flags kept: ${skippedCount}`);
    console.log('-----------------------------------\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
