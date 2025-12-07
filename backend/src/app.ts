import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import config from './config';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rateLimit.middleware';
import { clerkAuth } from './middleware/clerk.middleware';

const app: Application = express();

// Initialize Sentry only if DSN is available
const SENTRY_DSN = "https://f76345a28765c19bf814840320254294@o4510487277142016.ingest.de.sentry.io/4510493281747024";

if (SENTRY_DSN) {
  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV || 'development',
    });

    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler());

    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());
    
    console.log('✅ Sentry initialized');
  } catch (error) {
    console.warn('⚠️ Sentry initialization failed:', error);
  }
}

// Trust proxy - REQUIRED for Vercel/serverless environments
// This allows express-rate-limit to correctly identify users via X-Forwarded-For header
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API
}));

// CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk authentication middleware - MUST be before routes
app.use(clerkAuth);

// HTTP request logger
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Global rate limiting - applies to all API routes
app.use('/api/', generalLimiter);

// API routes
app.use('/api/v1', routes);

// Root route
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: '🚀 Welcome to E-Summit 2026 API',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// Favicon route (prevent 404 errors from Vercel)
app.get('/favicon.ico', (_req, res) => res.status(204).end());
app.get('/favicon.png', (_req, res) => res.status(204).end());

// 404 handler
app.use(notFound);

// The error handler must be registered before any other error middleware and after all controllers
if (SENTRY_DSN) {
  try {
    app.use(Sentry.Handlers.errorHandler());
  } catch (error) {
    console.warn('⚠️ Sentry error handler not available');
  }
}

// Error handler (must be last)
app.use(errorHandler);

export default app;
