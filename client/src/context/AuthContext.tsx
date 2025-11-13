import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { userProfileService } from '@/services/userProfileService';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const welcomeToastShownRef = React.useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let previousUserId: string | null = null;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('🔑 Error getting initial session:', error);
      }
      console.log('🔑 Initial session:', session ? 'authenticated' : 'none');
      setSession(session);
      setUser(session?.user ?? null);
      previousUserId = session?.user?.id ?? null;
      setLoading(false);
      console.log('🔄 Auth context state change: INITIAL_SESSION', session ? 'authenticated' : 'none');
    }).catch((error) => {
      console.error('🔑 Failed to get initial session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔄 Auth context state change:', event, session?.user?.email || 'none');

      const currentUserId = session?.user?.id ?? null;
      const isNewSignIn = previousUserId === null && currentUserId !== null;
      const isSameUser = previousUserId === currentUserId && currentUserId !== null;

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('🔧 Creating/updating user profile for:', session.user.id);

        // Only show welcome toast for actual new sign-ins, not session restores
        // Check if this is a new sign-in (transition from no user to user)
        // and we haven't already shown the toast for this user session
        if (isNewSignIn && welcomeToastShownRef.current !== session.user.id) {
          // Show success notification
          setTimeout(() => {
            toast({
              title: "Welcome back!",
              description: "You've been successfully signed in.",
            });
            welcomeToastShownRef.current = session.user.id;
          }, 500);
        }

        // Create profile in background without redirecting
        try {
          await userProfileService.createOrUpdateProfile(session.user.id, {
            user_id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
          });
          console.log('✅ User profile synced in auth context');
        } catch (error) {
          console.error('Failed to sync user profile in auth context:', error);
        }

        // Dispatch custom event for chat interface to show welcome message
        window.dispatchEvent(new CustomEvent('userSignedIn', {
          detail: { user: session.user }
        }));
      }

      if (event === 'SIGNED_OUT') {
        console.log('✅ User signed out event - clearing state');
        setUser(null);
        setSession(null);
        previousUserId = null;
        welcomeToastShownRef.current = null; // Reset welcome toast tracking

        // Show sign out notification
        toast({
          title: "Signed out",
          description: "You've been successfully signed out.",
        });

        // Dispatch custom event for chat interface to show sign out message
        window.dispatchEvent(new CustomEvent('userSignedOut'));
      }

      // Update previous user ID for next comparison
      previousUserId = currentUserId;
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: username,
        },
      },
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    console.log('🚪 Signing out user');
    try {
      // Force clear local state immediately
      setUser(null);
      setSession(null);

      // Clear only auth-related data, preserve other app data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('auth') || key.includes('session'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      sessionStorage.clear();

      // Call Supabase signOut
      await supabase.auth.signOut();

      console.log('✅ Sign out successful - redirecting');

      // Force redirect and reload
      window.location.href = window.location.origin + '/';

      return { error: null };
    } catch (err) {
      console.error('Sign out error:', err);
      return { error: err };
    }
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