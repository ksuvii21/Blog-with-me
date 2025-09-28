const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogging-platform';

  if (!process.env.MONGODB_URI) {
    console.log('Using local MongoDB connection (fallback)');
  } else {
    console.log('Using MongoDB Atlas connection');
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
