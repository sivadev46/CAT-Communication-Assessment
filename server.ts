import path from 'path';
import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import app from './backend/app.js';
import { connectDB } from './backend/config/database.js';

const PORT = 3000;

async function start() {
  // Connect to MongoDB & seed database
  await connectDB();

  const server = http.createServer(app);

  // Vite middleware for development or static file serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[CAT Server] Running full-stack Express + Vite on http://0.0.0.0:${PORT}`);
  });
}

start();
