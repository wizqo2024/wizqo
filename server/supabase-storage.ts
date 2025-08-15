import { supabaseAdmin } from './supabase-db';

export interface SupabaseStorage {
  getUserProfile(id: string): Promise<any>;
  getUserProfileByEmail(email: string): Promise<any>;
  createUserProfile(user: any): Promise<any>;
  getHobbyPlans(userId: string): Promise<any[]>;
  getHobbyPlansByUserId(userId: string): Promise<any[]>;
  createHobbyPlan(plan: any): Promise<any>;
  getUserProgress(userId: string): Promise<any[]>;
  createOrUpdateUserProgress(progress: any): Promise<any>;
}

export class SupabaseBackendStorage implements SupabaseStorage {
  async getUserProfile(id: string): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error);
    }
    return data;
  }

  async getUserProfileByEmail(email: string): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile by email:', error);
    }
    return data;
  }

  async createUserProfile(user: any): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        user_id: user.userId || user.user_id,
        email: user.email,
        full_name: user.fullName || user.full_name,
        avatar_url: user.avatarUrl || user.avatar_url,
        total_plans_created: user.totalPlansCreated || 0,
        total_days_completed: user.totalDaysCompleted || 0,
        current_streak: user.currentStreak || 0,
        longest_streak: user.longestStreak || 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
    return data;
  }

  async getHobbyPlans(userId: string): Promise<any[]> {
    return this.getHobbyPlansByUserId(userId);
  }

  async getHobbyPlansByUserId(userId: string): Promise<any[]> {
    try {
      console.log('📖 SUPABASE: Fetching hobby plans for user:', userId);
      const { data, error } = await supabaseAdmin
        .from('hobby_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ SUPABASE: Error fetching hobby plans:', error);
        console.error('❌ SUPABASE: Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return [];
      }
      
      console.log('✅ SUPABASE: Successfully fetched', data?.length || 0, 'hobby plans');
      return data || [];
    } catch (error) {
      console.error('❌ SUPABASE: Exception fetching hobby plans:', error);
      return [];
    }
  }

  async createHobbyPlan(plan: any): Promise<any> {
    try {
      console.log('📝 SUPABASE: Creating hobby plan for user:', plan.userId || plan.user_id);
      console.log('📝 SUPABASE: Plan data structure:', {
        hasUserId: !!(plan.userId || plan.user_id),
        hasHobby: !!(plan.hobby || plan.hobby_name),
        hasTitle: !!plan.title,
        hasOverview: !!plan.overview,
        hasPlanData: !!(plan.planData || plan.plan_data)
      });

      const { data, error } = await supabaseAdmin
        .from('hobby_plans')
        .insert({
          user_id: plan.userId || plan.user_id,
          hobby_name: plan.hobby || plan.hobby_name, // Handle both field names
          title: plan.title,
          overview: plan.overview,
          plan_data: plan.planData || plan.plan_data
        })
        .select()
        .single();

      if (error) {
        console.error('❌ SUPABASE: Error creating hobby plan:', error);
        console.error('❌ SUPABASE: Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('✅ SUPABASE: Successfully created hobby plan with ID:', data.id);
      return data;
    } catch (error) {
      console.error('❌ SUPABASE: Exception creating hobby plan:', error);
      throw error;
    }
  }

  async getUserProgress(userId: string): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
    return data || [];
  }

  async createOrUpdateUserProgress(progress: any): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('user_progress')
      .upsert({
        user_id: progress.userId || progress.user_id,
        plan_id: progress.planId || progress.plan_id,
        completed_days: progress.completedDays || progress.completed_days,
        current_day: progress.currentDay || progress.current_day,
        unlocked_days: progress.unlockedDays || progress.unlocked_days
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
    return data;
  }

  async deleteHobbyPlan(planId: string, userId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('hobby_plans')
      .delete()
      .eq('id', planId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting hobby plan:', error);
      throw error;
    }
  }

  async deleteUserProgress(planId: string, userId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('user_progress')
      .delete()
      .eq('plan_id', planId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting user progress:', error);
      throw error;
    }
  }
}

export const supabaseStorage = new SupabaseBackendStorage();