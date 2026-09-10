import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorMiddleware.js';

import path from 'path';
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';

const app = express();

// Security HTTP headers
if (process.env.NODE_ENV === "production") {
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
}

// Enable CORS
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));

// HTTP Request Logger
if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body Parser Middleware (with 100mb limit for video payloads)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static uploads directory serving with cross-origin and range support
const uploadsPath = path.join(process.cwd(), 'backend', 'uploads');
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Accept-Ranges', 'bytes');
  }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CAT Backend API is running smoothly.',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Static files serving for media uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'public', 'uploads')));

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/submissions', submissionRoutes);

// Global 404 handler for unhandled API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found - ${req.originalUrl}`,
    errors: [],
  });
});

// Centralized error handling middleware
app.use(errorHandler);

export default app;
