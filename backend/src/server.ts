import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { seedDatabase } from './scripts/seed';
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000']
  : '*';

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Root Discovery endpoint
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({
    service: 'Loopr AI Financial Intelligence Platform API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/auth/me'
      },
      transactions: {
        list: 'GET /api/transactions',
        exportCSV: 'POST /api/transactions/export',
        getById: 'GET /api/transactions/:id'
      },
      analytics: {
        overview: 'GET /api/analytics'
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Financial Analytics Dashboard API',
    version: '1.0.0'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server`
  });
});

// Global Error Handler
app.use(errorHandler);

// Initialize DB and start server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed database if empty
    try {
      await seedDatabase(false);
    } catch (seedErr) {
      console.warn('[Server] Auto-seed warning:', seedErr);
    }

    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Financial Analytics Server running on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Default Demo User: admin@crackit.com / password123`);
      console.log(`====================================================`);
    });

    const shutdown = async () => {
      console.log('\n[Server] Shutting down gracefully...');
      server.close(async () => {
        await mongoose.connection.close();
        console.log('[Server] MongoDB connection closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
