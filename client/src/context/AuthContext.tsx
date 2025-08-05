import React, { createContext, useContext, useEffect, useState } from 'react';
// Migrated to use simple auth without Supabase dependencies
import { userProfileService } from '@/services/userProfileService';

// Simple user and session types to replace Supabase
interface User {
  id: string;
  email?: string;
  user_metadata?: any;
}

interface Session {
  user: User;
  access_token?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, username: string) => Promise<{ data: any; error: any }>;
  signInWithGoogle: () => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session (simplified without Supabase)
    const getInitialSession = async () => {
      try {
        // For now, no persistent auth - user starts as logged out
        console.log('🔑 Initial session: none');
        setSession(null);
        setUser(null);
        setLoading(false);
      } catch (error) {
        console.error('Failed to get initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simplified auth - no actual login for now
    return { data: null, error: { message: 'Auth system migrated to backend' } };
  };

  const signUp = async (email: string, password: string, username: string) => {
    // Simplified auth - no actual signup for now
    return { data: null, error: { message: 'Auth system migrated to backend' } };
  };

  const signInWithGoogle = async () => {
    // Simplified auth - no actual Google login for now
    return { data: null, error: { message: 'Auth system migrated to backend' } };
  };

  const signOut = async () => {
    console.log('🚪 Signing out user');
    setUser(null);
    setSession(null);
    return { error: null };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}