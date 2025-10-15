import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  env: string;
  port: number;
  databaseUrl: string;
  jwt: {
    secret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  cors: {
    origin: string | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void);
  };
}

// Dynamic CORS origin validator
const getCorsOrigin = () => {
  const nodeEnv = process.env.NODE_ENV;

  // In production, use dynamic validation
  if (nodeEnv === 'production') {
    return (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, curl, postman)
      if (!origin) {
        return callback(null, true);
      }

      // Allow all Vercel deployments (*.vercel.app)
      if (origin.endsWith('.vercel.app')) {
        console.log(`✅ CORS: Allowed Vercel deployment - ${origin}`);
        return callback(null, true);
      }

      // Allow explicit frontend URL from env
      const frontendUrl = process.env.FRONTEND_URL;
      if (frontendUrl && origin === frontendUrl) {
        console.log(`✅ CORS: Allowed explicit frontend - ${origin}`);
        return callback(null, true);
      }

      // Reject other origins
      console.warn(`⚠️ CORS: Blocked origin - ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    };
  }

  // In development, allow localhost and Vercel
  if (nodeEnv === 'development') {
    return (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      const devOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://localhost:5000',
      ];

      if (!origin || devOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      return callback(null, false);
    };
  }

  // Fallback to wildcard (not recommended for production)
  return '*';
};

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || 'default-jwt-secret-please-change',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-please-change',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: getCorsOrigin(),
  },
};

// Warn about missing critical env vars in production
if (config.env === 'production') {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  WARNING: DATABASE_URL not set');
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('default')) {
    console.warn('⚠️  WARNING: JWT_SECRET not set or using default');
  }
  if (!process.env.FRONTEND_URL) {
    console.warn('⚠️  WARNING: FRONTEND_URL not set, using wildcard CORS');
  }
}

export default config;
