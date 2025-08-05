import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

console.log('✅ Database: Connecting to PostgreSQL database');

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: false // Replit PostgreSQL doesn't need SSL
});

export const db = drizzle(pool, { schema });
