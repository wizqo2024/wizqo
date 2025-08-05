import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Using Supabase PostgreSQL database connection string
const databaseUrl = process.env.VITE_SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('⚠️ No database URL found - using fallback configuration');
}

console.log('✅ Database: Connecting to Supabase PostgreSQL database');

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });
