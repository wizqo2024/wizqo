// Independent database configuration for deployment without Replit PostgreSQL
import { supabaseAdmin } from './supabase-db';

// This replaces the Replit DATABASE_URL dependency
export const independentDb = {
  // Health check for independent deployment
  async healthCheck() {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('Database health check failed:', error);
        return false;
      }
      
      console.log('✅ Independent database connection successful');
      return true;
    } catch (error) {
      console.error('Database health check error:', error);
      return false;
    }
  }
};

// Remove dependency on Replit's DATABASE_URL
export const isDatabaseIndependent = true;
console.log('🚀 Database configured for independent deployment (no Replit dependency)');