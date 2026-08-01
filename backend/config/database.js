import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env.js';
import { seedDatabase } from './seed.js';

let mongoMemoryInstance = null;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongodbUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Standard MongoDB connection failed (${error.message}). Initializing MongoMemoryServer fallback...`);
    try {
      mongoMemoryInstance = await MongoMemoryServer.create();
      const mongoUri = mongoMemoryInstance.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`[Database] MongoMemoryServer Connected successfully at: ${conn.connection.host}`);
    } catch (memErr) {
      console.error(`[Database Critical Error] MongoMemoryServer failed to start: ${memErr.message}`);
      return;
    }
  }

  // Auto-seed database with default user and initial records
  await seedDatabase();
};

