import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  total_plans_created: number;
  total_days_completed: number;
  current_streak: number;
  longest_streak: number;
  joined_at: string;
  last_active_at: string;
}

export interface CreateUserProfileData {
  user_id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
}

export interface UpdateUserProfileData {
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  total_plans_created?: number;
  total_days_completed?: number;
  current_streak?: number;
  longest_streak?: number;
  last_active_at?: string;
}

class UserProfileService {
  async createOrUpdateProfile(userId: string, userData: CreateUserProfileData): Promise<UserProfile> {
    try {
      console.log('🔧 Creating/updating user profile for:', userId);
      
      // Use backend to bypass RLS with service role
      const resp = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          email: userData.email,
          full_name: userData.full_name,
          avatar_url: userData.avatar_url
        })
      });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        console.error('❌ Error creating/updating profile via backend:', resp.status, text);
        throw new Error(text || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      console.log('✅ Profile created/updated successfully via backend:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('❌ UserProfileService createOrUpdateProfile error:', error);
      throw error;
    }
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('📖 Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found - this is normal for new users
          console.log('📝 No profile found for user, will create one');
          return null;
        }
        console.error('❌ Error fetching profile:', error);
        throw error;
      }

      console.log('✅ Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ UserProfileService getProfile error:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, updates: UpdateUserProfileData): Promise<UserProfile> {
    try {
      console.log('🔧 Updating user profile for:', userId, updates);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          last_active_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating profile:', error);
        throw error;
      }

      console.log('✅ Profile updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ UserProfileService updateProfile error:', error);
      throw error;
    }
  }

  async incrementPlanCount(userId: string): Promise<void> {
    try {
      console.log('📈 Incrementing plan count for user:', userId);
      
      const { error } = await supabase.rpc('increment_plan_count', {
        user_id: userId
      });

      if (error) {
        console.error('❌ Error incrementing plan count:', error);
        // Fallback: manual increment
        const profile = await this.getProfile(userId);
        if (profile) {
          await this.updateProfile(userId, {
            total_plans_created: profile.total_plans_created + 1
          });
        }
      } else {
        console.log('✅ Plan count incremented successfully');
      }
    } catch (error) {
      console.error('❌ UserProfileService incrementPlanCount error:', error);
      throw error;
    }
  }

  async incrementDayCompleted(userId: string): Promise<void> {
    try {
      console.log('📈 Incrementing completed days for user:', userId);
      
      const { error } = await supabase.rpc('increment_completed_days', {
        user_id: userId
      });

      if (error) {
        console.error('❌ Error incrementing completed days:', error);
        // Fallback: manual increment
        const profile = await this.getProfile(userId);
        if (profile) {
          await this.updateProfile(userId, {
            total_days_completed: profile.total_days_completed + 1
          });
        }
      } else {
        console.log('✅ Completed days incremented successfully');
      }
    } catch (error) {
      console.error('❌ UserProfileService incrementDayCompleted error:', error);
      throw error;
    }
  }

  async updateStreak(userId: string, currentStreak: number): Promise<void> {
    try {
      console.log('🔥 Updating streak for user:', userId, currentStreak);
      
      const profile = await this.getProfile(userId);
      if (profile) {
        const longestStreak = Math.max(profile.longest_streak, currentStreak);
        
        await this.updateProfile(userId, {
          current_streak: currentStreak,
          longest_streak: longestStreak
        });
        
        console.log('✅ Streak updated successfully');
      }
    } catch (error) {
      console.error('❌ UserProfileService updateStreak error:', error);
      throw error;
    }
  }
}

export const userProfileService = new UserProfileService();