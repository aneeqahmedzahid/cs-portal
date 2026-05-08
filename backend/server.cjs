const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const connectToDatabase = require('./config/db.cjs');
const errorMiddleware = require('./middleware/errorMiddleware.cjs');

// Import routes
const newsRoutes = require('./routes/newsRoutes.cjs');
const eventRoutes = require('./routes/eventRoutes.cjs');
const facultyRoutes = require('./routes/facultyRoutes.cjs');
const adminRoutes = require('./routes/adminRoutes.cjs');
const contributorRoutes = require('./routes/contributorRoutes.cjs');

const app = express();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/contributors', contributorRoutes);
app.use('/api', adminRoutes); // Handles /api/auth/login, /api/admins, /api/upload

// Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  connectToDatabase()
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((error) => {
      console.error('Initial MongoDB connection failed:', error.message);
    });
}

module.exports = app;
