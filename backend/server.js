const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();
connectDB();

const app = express();

// Use custom CORS configuration
const corsMiddleware = require('./middleware/cors');
app.use(corsMiddleware);
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/blogs/:blogId/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api', (req, res) => {
  res.send('Blogging Platform API');
});

app.get('/', (req, res) => {
  res.send('Blogging Platform API');
});

// Create admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@blogplatform.com' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const adminUser = new User({
        username: 'Admin',
        email: 'admin@blogplatform.com',
        password: hashedPassword,
        role: 'admin',
        bio: 'Platform Administrator',
        profilePicture: ''
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@blogplatform.com');
      console.log('Password: admin123');
      console.log('Role: admin');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Create admin user after DB connection
mongoose.connection.once('open', () => {
  console.log('MongoDB connected, creating admin user...');
  createAdminUser();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
