const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Local mode: runs a real MongoDB on this computer (no Atlas needed).
// Data is saved in server/.localdb so it survives restarts.
const startLocalMongo = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const dbPath = path.join(__dirname, '..', '.localdb');
  fs.mkdirSync(dbPath, { recursive: true });
  const mongod = await MongoMemoryServer.create({
    instance: { dbPath, storageEngine: 'wiredTiger' },
  });
  const stop = async () => {
    await mongod.stop();
    process.exit(0);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  return mongod.getUri('finance-tracker');
};

const connectDB = async () => {
  try {
    const useLocal = process.env.USE_LOCAL_DB === 'true' || !process.env.MONGO_URI;
    const uri = useLocal ? await startLocalMongo() : process.env.MONGO_URI;
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${useLocal ? 'LOCAL database' : conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;