import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import logger from './logger.js';

// Configure Neon for local development if using Neon Local
if (process.env.NODE_ENV === 'development' && process.env.DATABASE_URL?.includes('neon-local')) {
  // Neon Local configuration
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
  
  logger.info('Database configured for Neon Local development');
} else {
  logger.info('Database configured for Neon Cloud');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Test database connection on startup
const testConnection = async () => {
  try {
    await sql`SELECT 1`;
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

// Test connection immediately
testConnection();

export { db, sql };
