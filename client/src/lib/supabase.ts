// Legacy file - Supabase client has been replaced with PostgreSQL backend API
console.log('✅ Using PostgreSQL backend API instead of Supabase client')

// Mock supabase object for compatibility during migration
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Auth moved to backend' } }),
    signUp: () => Promise.resolve({ data: null, error: { message: 'Auth moved to backend' } }),
    signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Auth moved to backend' } }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: () => ({
    select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Use backend API' } }) }),
    insert: () => ({ select: () => Promise.resolve({ data: null, error: { message: 'Use backend API' } }) }),
    upsert: () => ({ select: () => Promise.resolve({ data: null, error: { message: 'Use backend API' } }) })
  })
}

// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>
      }
      hobby_plans: {
        Row: HobbyPlan
        Insert: Omit<HobbyPlan, 'id' | 'created_at'>
        Update: Partial<Omit<HobbyPlan, 'id' | 'created_at'>>
      }
      user_progress: {
        Row: UserProgress
        Insert: Omit<UserProgress, 'id' | 'last_accessed_at'>
        Update: Partial<Omit<UserProgress, 'id'>>
      }
    }
  }
}

// Legacy types for compatibility
export interface UserProfile {
  id: string
  email: string
  username?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface HobbyPlan {
  id: string
  user_id: string
  hobby_name: string  // Updated to match database schema
  title: string
  overview: string
  plan_data: any
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  plan_id: string
  completed_days: number[]
  current_day: number
  unlocked_days: number[]
  last_accessed_at: string
}