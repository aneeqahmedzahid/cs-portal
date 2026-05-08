const mongoose = require('mongoose');

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

module.exports = connectToDatabase;
