export interface UserPlan {
  id: string;
  user_id: string;
  hobby_name: string;
  title: string;
  overview: string;
  plan_data: any;
  created_at: string;
  updated_at: string;
}

export class UserPlansService {
  private baseUrl = '/api';

  async getUserPlans(userId: string): Promise<UserPlan[]> {
    try {
      console.log('📋 Fetching user plans for:', userId);
      
      const response = await fetch(`${this.baseUrl}/user-plans/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user plans: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Retrieved', data.plans?.length || 0, 'plans for user');
      
      return data.plans || [];
    } catch (error) {
      console.error('❌ Error fetching user plans:', error);
      return [];
    }
  }

  async getPlanById(planId: string): Promise<UserPlan | null> {
    try {
      console.log('📋 Fetching plan by ID:', planId);
      
      const response = await fetch(`${this.baseUrl}/plan/${planId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch plan: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Retrieved plan:', data.plan?.title);
      
      return data.plan || null;
    } catch (error) {
      console.error('❌ Error fetching plan by ID:', error);
      return null;
    }
  }

  async deletePlan(planId: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting plan:', planId);
      
      const response = await fetch(`${this.baseUrl}/plan/${planId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete plan: ${response.status}`);
      }

      console.log('✅ Plan deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting plan:', error);
      return false;
    }
  }

  async updatePlanProgress(planId: string, progress: any): Promise<boolean> {
    try {
      console.log('📊 Updating plan progress:', planId);
      
      const response = await fetch(`${this.baseUrl}/plan/${planId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progress),
      });

      if (!response.ok) {
        throw new Error(`Failed to update progress: ${response.status}`);
      }

      console.log('✅ Plan progress updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Error updating plan progress:', error);
      return false;
    }
  }

  // Helper method to format plan data for display
  formatPlanForDisplay(plan: UserPlan): any {
    return {
      id: plan.id,
      hobby: plan.hobby_name,
      title: plan.title,
      overview: plan.overview,
      difficulty: plan.plan_data?.difficulty || 'beginner',
      totalDays: plan.plan_data?.totalDays || 7,
      days: plan.plan_data?.days || [],
      createdAt: plan.created_at,
      updatedAt: plan.updated_at
    };
  }

  // Helper method to get plan statistics
  getPlanStats(plans: UserPlan[]): {
    totalPlans: number;
    completedPlans: number;
    activePlans: number;
    favoriteHobby: string;
  } {
    const stats = {
      totalPlans: plans.length,
      completedPlans: 0,
      activePlans: 0,
      favoriteHobby: ''
    };

    const hobbyCounts: { [key: string]: number } = {};

    plans.forEach(plan => {
      // Count hobbies for favorite hobby calculation
      const hobby = plan.hobby_name.toLowerCase();
      hobbyCounts[hobby] = (hobbyCounts[hobby] || 0) + 1;

      // Check if plan is completed (you can customize this logic)
      const isCompleted = plan.plan_data?.completed || false;
      if (isCompleted) {
        stats.completedPlans++;
      } else {
        stats.activePlans++;
      }
    });

    // Find favorite hobby
    const favoriteHobby = Object.entries(hobbyCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (favoriteHobby) {
      stats.favoriteHobby = favoriteHobby[0];
    }

    return stats;
  }
}