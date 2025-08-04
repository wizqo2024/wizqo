import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found - please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
} else {
  console.log('✅ Supabase client initialized with URL:', supabaseUrl?.substring(0, 30) + '...')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

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