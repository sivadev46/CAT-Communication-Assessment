import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/database.js';

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const PORT = env.port;
  app.listen(PORT, () => {
    console.log(`[Server] CAT Backend REST API listening on port ${PORT} (${env.nodeEnv} mode)`);
  });
};

startServer();
