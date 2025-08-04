import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Legacy Replit database - replaced with Supabase for independence
// This file is kept for compatibility but not used in production
console.warn('⚠️ server/db.ts is deprecated - using Supabase for independence');

// Fallback configuration (not used in independent mode)
const fallbackUrl = process.env.DATABASE_URL || 'postgresql://fallback';
export const pool = new Pool({ connectionString: fallbackUrl });
export const db = drizzle({ client: pool, schema });
