import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve current directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env file from the backend folder
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Fallback load .env from root directory (if any)
dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cat_database',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_cat_jwt_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  geminiApiKey: process.env.GEMINI_API_KEY,
};

// Log successful loading of key on startup without revealing the key secret
if (env.geminiApiKey) {
  console.log('[Gemini] API key loaded successfully.');
} else {
  console.warn('[Gemini Warning] GEMINI_API_KEY is not configured in environment variables.');
}
