// Database setup script
const mongoose = require('mongoose');
const { initializeDatabase } = require('./utils/database');
require('dotenv').config();

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rural-telemedicine', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Initialize with sample data
    await initializeDatabase();
    
    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();