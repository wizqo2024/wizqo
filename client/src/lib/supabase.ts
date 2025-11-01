import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)
const STUB_ERROR = new Error('Supabase is not configured in this environment.')

function createStubQueryBuilder() {
  let result: { data: any; error: any } = { data: null, error: STUB_ERROR }

  const builder: any = {
    select() { result = { data: [], error: STUB_ERROR }; return builder },
    insert() { result = { data: null, error: STUB_ERROR }; return builder },
    update() { result = { data: null, error: STUB_ERROR }; return builder },
    delete() { result = { data: null, error: STUB_ERROR }; return builder },
    upsert() { result = { data: null, error: STUB_ERROR }; return builder },
    eq() { return builder },
    match() { return builder },
    filter() { return builder },
    order() { return builder },
    limit() { return builder },
    range() { return builder },
    single() { return Promise.resolve(result) },
    maybeSingle() { return Promise.resolve(result) },
    then(onFulfilled: any, onRejected?: any) { return Promise.resolve(result).then(onFulfilled, onRejected) },
    catch(onRejected: any) { return Promise.resolve(result).catch(onRejected) },
    finally(onFinally: any) { return Promise.resolve(result).finally(onFinally) },
  }

  return builder
}

function createSupabaseStub(): SupabaseClient<any, 'public', any> {
  const stub: any = {
    auth: {
      async getSession() { return { data: { session: null }, error: null } },
      onAuthStateChange() {
        const subscription = { unsubscribe() {} }
        return { data: { subscription }, error: null }
      },
      async signInWithPassword() { return { data: { user: null, session: null }, error: STUB_ERROR } },
      async signUp() { return { data: { user: null, session: null }, error: STUB_ERROR } },
      async signInWithOAuth() { return { data: { user: null, session: null }, error: STUB_ERROR } },
      async resetPasswordForEmail() { return { data: {}, error: STUB_ERROR } },
      async updateUser() { return { data: {}, error: STUB_ERROR } },
      async signOut() { return { error: null } },
      async exchangeCodeForSession() { return { data: { user: null, session: null }, error: STUB_ERROR } },
      async getUser() { return { data: { user: null }, error: null } }
    },
    from() { return createStubQueryBuilder() },
    rpc: async () => ({ data: null, error: STUB_ERROR }),
    storage: {
      from() { return createStubQueryBuilder() }
    }
  }

  return stub
}

if (!isConfigured) {
  console.warn('Supabase environment variables not found - using stub client without persistence.')
}

type ClientType = SupabaseClient<any, 'public', any>

export const supabase: ClientType = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
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
  : createSupabaseStub()

export const SUPABASE_ENABLED = isConfigured

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
  hobby_name: string
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
