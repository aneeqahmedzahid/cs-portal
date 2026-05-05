const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { News, Event, Admin } = require('./models.cjs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const serializeDocument = (doc) => {
  if (!doc) return doc;

  const serialized = {
    ...doc,
    id: doc._id?.toString?.() || doc.id
  };

  delete serialized._id;
  delete serialized.__v;
  return serialized;
};

// Connect to MongoDB
let cachedDb = null;
let connectionPromise = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  if (connectionPromise) return connectionPromise;
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  connectionPromise = mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
  });

  try {
    const db = await connectionPromise;
    cachedDb = db;
    return db;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
}

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ error: 'Invalid email or password.' });

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ session: { access_token: token, user: { email: admin.email, id: admin._id } } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NEWS ROUTES ---
app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find().sort({ created_at: -1 }).lean();
    res.json(news.map(serializeDocument));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/news/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id).lean();
    if (!news) return res.status(404).json({ error: 'Not found' });
    res.json(serializeDocument(news));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/news', authMiddleware, async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/news/:id', authMiddleware, async (req, res) => {
  try {
    req.body.updated_at = Date.now();
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/news/:id', authMiddleware, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EVENT ROUTES ---
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ event_date: 1 }).lean();
    res.json(events.map(serializeDocument));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ error: 'Not found' });
    res.json(serializeDocument(event));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', authMiddleware, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    req.body.updated_at = Date.now();
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN ROUTES ---
app.get('/api/admins', authMiddleware, async (req, res) => {
  try {
    const admins = await Admin.find({}, '-password').sort({ created_at: -1 }).lean();
    res.json(admins.map(serializeDocument));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admins', authMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Admin already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();
    
    const adminWithoutPassword = admin.toJSON();
    delete adminWithoutPassword.password;
    res.status(201).json(adminWithoutPassword);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admins/:id', authMiddleware, async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
