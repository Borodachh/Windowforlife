import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env';
import ordersRouter from './routes/orders';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
  }),
);

// Compression
app.use(compression());

// JSON body parser
app.use(express.json({ limit: '10kb' }));

// Trust proxy (for rate limiting behind Nginx)
app.set('trust proxy', 1);

// Routes
app.use('/api/orders', ordersRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Маршрут не найден' });
});

export default app;
