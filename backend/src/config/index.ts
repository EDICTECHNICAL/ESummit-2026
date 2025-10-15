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
    origin: string;
  };
}

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
    origin: process.env.FRONTEND_URL || '*',
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
