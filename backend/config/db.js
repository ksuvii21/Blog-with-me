const mongoose = require('mongoose');

const connectDB = async () => {
  let uri = process.env.MONGODB_URI;
  
  // If Atlas URI is set, use it; otherwise fallback to local
  if (process.env.MONGODB_ATLAS_URI) {
    uri = process.env.MONGODB_ATLAS_URI;
    console.log('Using MongoDB Atlas connection');
  } else if (!uri) {
    uri = 'mongodb://localhost:27017/blogging-platform';
    console.log('Using local MongoDB connection (fallback)');
  } else {
    console.log('Using custom MongoDB URI');
  }
  
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
