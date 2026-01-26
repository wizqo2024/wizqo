// API service for database operations via backend
export const apiService = {
  // Hobby Plans
  async createHobbyPlan(userId: string, hobby: string, title: string, overview: string, planData: any) {
    console.log('📝 API SERVICE: Creating hobby plan for user:', userId, 'hobby:', hobby);
    const response = await fetch('/api/hobby-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        hobby,
        title,
        overview,
        plan_data: planData
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create hobby plan: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('📝 API SERVICE: Created plan with ID:', result.id);
    return { data: result, error: null };
  },

  async getHobbyPlans(userId: string) {
    console.log('📖 API SERVICE: Fetching hobby plans for user:', userId);
    const response = await fetch(`/api/hobby-plans/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch hobby plans: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📖 API SERVICE: Found', data.length, 'plans');
    return { data, error: null };
  },

  // User Progress
  async createUserProgress(userId: string, planId: string, completedDays: number[], currentDay: number, unlockedDays: number[]) {
    console.log('📝 API SERVICE: Creating/updating user progress for:', userId, 'plan:', planId);
    const response = await fetch('/api/user-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        plan_id: planId,
        completed_days: completedDays,
        current_day: currentDay,
        unlocked_days: unlockedDays
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user progress: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('📝 API SERVICE: Updated progress for plan:', planId);
    return { data: result, error: null };
  },

  async getUserProgress(userId: string) {
    console.log('📖 API SERVICE: Fetching user progress for:', userId);
    const response = await fetch(`/api/user-progress/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user progress: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📖 API SERVICE: Found', data.length, 'progress entries');
    return { data, error: null };
  }
};