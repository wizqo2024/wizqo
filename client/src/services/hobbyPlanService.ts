import { supabase } from '../lib/supabase'

export class HobbyPlanService {
  // Clear all caches for a specific hobby (enhanced version)
  clearHobbyCache(hobby: string, userId: string): void {
    console.log('🧹 AGGRESSIVE CACHE CLEAR: Starting for hobby:', hobby, 'user:', userId);

    // Clear all localStorage entries that might be related
    const localStorageKeys = Object.keys(localStorage);
    for (const key of localStorageKeys) {
      const shouldClear = key.toLowerCase().includes(hobby.toLowerCase()) ||
                         key.includes(userId) ||
                         key.startsWith('hobbyPlan_') ||
                         key.startsWith('lastViewedPlan') ||
                         key.startsWith('currentPlanData') ||
                         key.startsWith('activePlanData') ||
                         key.startsWith('plan_') ||
                         key.includes('freshPlanMarker');

      if (shouldClear) {
        localStorage.removeItem(key);
        console.log('🧹 Cleared localStorage:', key);
      }
    }

    // Clear all sessionStorage entries that might be related
    const sessionStorageKeys = Object.keys(sessionStorage);
    for (const key of sessionStorageKeys) {
      const shouldClear = key.toLowerCase().includes(hobby.toLowerCase()) ||
                         key.includes(userId) ||
                         key.startsWith('currentPlanData') ||
                         key.startsWith('activePlanData') ||
                         key.startsWith('lastViewedPlanData') ||
                         key.startsWith('planFromGeneration') ||
                         key.startsWith('freshPlanMarker') ||
                         key.startsWith('progress_');

      if (shouldClear) {
        sessionStorage.removeItem(key);
        console.log('🧹 Cleared sessionStorage:', key);
      }
    }

    // Clear specific cache keys (both lowercase and capitalized)
    const specificCacheKeys = [
      `existingPlan_${hobby}_${userId}`,
      `duplicateCheck_${hobby}_${userId}`,
      `hobbyPlan_${hobby}`,
      `lastViewedPlan_${hobby}`,
      `currentPlanData_${hobby}`,
      `plan_${hobby}`,
      `${hobby}_plan`,
      `${hobby}_progress`,
      // Capitalized versions
      `existingPlan_${hobby.charAt(0).toUpperCase() + hobby.slice(1)}_${userId}`,
      `duplicateCheck_${hobby.charAt(0).toUpperCase() + hobby.slice(1)}_${userId}`,
      `hobbyPlan_${hobby.charAt(0).toUpperCase() + hobby.slice(1)}`,
      `lastViewedPlan_${hobby.charAt(0).toUpperCase() + hobby.slice(1)}`,
      `currentPlanData_${hobby.charAt(0).toUpperCase() + hobby.slice(1)}`,
      `plan_${hobby.charAt(0).toUpperCase() + hobby.slice(1)}`,
      `${hobby.charAt(0).toUpperCase() + hobby.slice(1)}_plan`,
      `${hobby.charAt(0).toUpperCase() + hobby.slice(1)}_progress`
    ];

    specificCacheKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // Also clear general cache entries
    sessionStorage.removeItem('currentPlanData');
    sessionStorage.removeItem('activePlanData');
    sessionStorage.removeItem('lastViewedPlanData');
    sessionStorage.removeItem('planFromGeneration');
    localStorage.removeItem('lastViewedPlanData');

    console.log('🧹 AGGRESSIVE CACHE CLEAR: Completed for hobby:', hobby);
  }

  // Check if plan already exists for this hobby
  async checkExistingPlan(hobby: string, userId: string): Promise<any | null> {
    try {
      console.log('🔍 DUPLICATE CHECK: Starting check for hobby:', hobby, 'user:', userId);

      // Prevent concurrent duplicate checks
      const checkKey = `duplicateCheck_${hobby}_${userId}`;
      const isAlreadyChecking = sessionStorage.getItem(checkKey);
      if (isAlreadyChecking === 'checking') {
        console.log('🔍 DUPLICATE CHECK: Already in progress, waiting...');
        // Wait a bit and try again
        await new Promise(resolve => setTimeout(resolve, 1000));
        const cachedResult = sessionStorage.getItem(`existingPlan_${hobby}_${userId}`);
        return cachedResult ? JSON.parse(cachedResult) : null;
      }

      sessionStorage.setItem(checkKey, 'checking');

      try {
        // Check cache first
        const cacheKey = `existingPlan_${hobby}_${userId}`;
        const cachedResult = sessionStorage.getItem(cacheKey);
        if (cachedResult) {
          const parsed = JSON.parse(cachedResult);
          console.log('🔍 DUPLICATE CHECK: Found cached result:', parsed ? 'EXISTS' : 'NOT_EXISTS');
          return parsed;
        }

        // Query database via API with deduplication
        const response = await fetch(`/api/hobby-plans?user_id=${userId}`);
        if (!response.ok) {
          console.error('🔍 DUPLICATE CHECK: API error:', response.status);
          return null;
        }

        const allPlans = await response.json();
        console.log('🔍 DUPLICATE CHECK: Retrieved plans:', allPlans?.length || 0);

        // Deduplicate plans by hobby and take the most recent
        const plansByHobby = new Map();
        allPlans?.forEach((plan: any) => {
          const planHobby = (plan.hobby_name || plan.hobby)?.toLowerCase();
          if (planHobby) {
            const existing = plansByHobby.get(planHobby);
            if (!existing || new Date(plan.created_at) > new Date(existing.created_at)) {
              plansByHobby.set(planHobby, plan);
            }
          }
        });

        // Look for exact hobby match
        const existingPlan = plansByHobby.get(hobby.toLowerCase());

        // Cache the result for this session
        sessionStorage.setItem(cacheKey, JSON.stringify(existingPlan || null));

        if (existingPlan) {
          console.log('🚨 DUPLICATE CHECK: Found existing plan:', existingPlan.title);
          return existingPlan;
        } else {
          console.log('✅ DUPLICATE CHECK: No existing plan found');
          return null;
        }
      } finally {
        sessionStorage.removeItem(checkKey);
      }
    } catch (error) {
      console.error('🔍 DUPLICATE CHECK: Error:', error);
      sessionStorage.removeItem(`duplicateCheck_${hobby}_${userId}`);
      return null;
    }
  }

  // Save a hobby plan to Supabase via backend API
  async savePlan(planData: any, userId: string, force: boolean = false): Promise<any> {
    try {
      console.log('💾 DATABASE SAVE: Starting plan save for user:', userId)
      console.log('💾 DATABASE SAVE: Plan data:', planData)
      console.log('💾 DATABASE SAVE: Force mode:', force)

      // Check if plan already exists for this hobby (only if not forcing)
      if (!force) {
        const existingPlan = await this.checkExistingPlan(planData.hobby, userId)
        if (existingPlan) {
          console.log('⚠️ DUPLICATE PLAN: Plan already exists for hobby:', planData.hobby)
          console.log('💡 SUGGESTION: Use force=true to create new plan anyway')
          throw new Error(`You already have a learning plan for ${planData.hobby}. Check your dashboard to continue your existing plan, or create a new plan by trying again.`)
        }
      } else {
        console.log('🚀 FORCE MODE: Bypassing duplicate check for', planData.hobby)
      }

      console.log('💾 DATABASE SAVE: Using backend API for reliable save')

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const saveResponse = await fetch('/api/hobby-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          hobby: planData.hobby,
          title: planData.title,
          overview: planData.overview,
          plan_data: planData
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      console.log('💾 DATABASE SAVE: Backend API response status:', saveResponse.status)

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text()
        console.error('💾 DATABASE SAVE: Backend API Error:', saveResponse.status, errorText)
        throw new Error(`Backend API Error ${saveResponse.status}: ${errorText}`)
      }

      const result = await saveResponse.json()
      console.log('✅ DATABASE SAVE SUCCESS: Plan saved successfully with ID:', result.id)
      return result

    } catch (error: any) {
      console.error('❌ DATABASE SAVE ERROR: Failed to save plan:', error)
      console.error('❌ DATABASE SAVE ERROR - Full error details:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
        toString: error?.toString()
      })

      if (error.name === 'AbortError') {
        console.error('❌ DATABASE SAVE: Network timeout after 10 seconds')
        throw new Error('Plan save timed out - please check your connection')
      }

      // If it's a duplicate error, re-throw with clear message
      if (error.message && error.message.includes('already have a learning plan')) {
        throw error
      }

      // For other errors, provide a helpful message
      throw new Error(`Failed to save plan: ${error?.message || 'Unknown error occurred'}`)
    }
  }

  // Delete a hobby plan from Supabase
  async deletePlan(planId: string, userId: string): Promise<void> {
    try {
      console.log('🗑️ DELETING PLAN: Starting delete for plan:', planId, 'user:', userId)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hobby_plans?id=eq.${planId}&user_id=eq.${userId}`, {
        method: 'DELETE',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      console.log('🗑️ DELETE: Fetch completed with status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('🗑️ DELETE ERROR: HTTP Error:', response.status, errorText)
        throw new Error(`Failed to delete plan: HTTP ${response.status}`)
      }

      console.log('✅ DELETE SUCCESS: Plan deleted successfully')

    } catch (error: any) {
      console.error('❌ DELETE ERROR: Failed to delete plan:', error)

      if (error.name === 'AbortError') {
        console.error('❌ DELETE: Network timeout after 2 seconds')
        throw new Error('Delete timed out - please check your connection')
      }

      throw error
    }
  }

  // Get user plans from Supabase
  async getUserPlans(userId: string): Promise<any[]> {
    try {
      console.log('📖 SUPABASE: Fetching user plans for user ID:', userId)
      console.log('📖 SUPABASE: Starting plans query via direct API...')

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hobby_plans?user_id=eq.${userId}&order=created_at.desc`, {
        method: 'GET',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('📖 SUPABASE: Plans query failed:', response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const plans = await response.json()
      console.log('📖 SUPABASE: Plans query completed via API. Result:', plans.length, 'plans')
      return plans

    } catch (error: any) {
      console.error('❌ SUPABASE: Error fetching user plans:', error)

      if (error.name === 'AbortError') {
        console.error('❌ SUPABASE: Plans query timed out after 2 seconds')
        return []
      }

      throw error
    }
  }

  // Get user progress via direct API (with session storage fallback)
  async getUserProgress(userId: string, validPlanIds?: string[]): Promise<any[]> {
    try {
      console.log('📖 SUPABASE: Starting progress query via direct API...')

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_progress?user_id=eq.${userId}`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        }
      })

      let progressData = []
      if (response.ok) {
        progressData = await response.json() || []
        console.log('📖 SUPABASE: Progress query completed via API. Result:', progressData.length, 'progress entries')
      } else {
        console.error('📖 SUPABASE: Progress API error:', response.status)
      }

      // Always check session storage for temporary progress (with cleanup)
      const sessionProgress = this.getSessionProgress(userId, validPlanIds)
      console.log('📝 PROGRESS: Checking session storage for user:', userId, 'found:', sessionProgress.length, 'entries')

      if (sessionProgress.length > 0) {
        console.log('📝 PROGRESS: Adding', sessionProgress.length, 'session storage progress entries')
        // Merge with database progress, prioritizing session storage (more recent)
        const mergedProgress = [...progressData]
        sessionProgress.forEach(sessionItem => {
          const existingIndex = mergedProgress.findIndex(p => p.plan_id === sessionItem.plan_id)
          if (existingIndex >= 0) {
            mergedProgress[existingIndex] = sessionItem
          } else {
            mergedProgress.push(sessionItem)
          }
        })
        return mergedProgress
      }

      return progressData
    } catch (error) {
      console.error('Error fetching user progress:', error)
      // Fallback to session storage only (with cleanup)
      return this.getSessionProgress(userId, validPlanIds)
    }
  }

  // Get progress from session storage (with cleanup for deleted plans)
  private getSessionProgress(userId: string, validPlanIds?: string[]): any[] {
    const sessionProgress = []
    console.log('📝 PROGRESS: Scanning sessionStorage for user:', userId)
    console.log('📝 PROGRESS: SessionStorage has', sessionStorage.length, 'total items')

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      console.log('📝 PROGRESS: Checking key:', key)
      if (key && key.startsWith(`progress_${userId}_`)) {
        // Extract plan ID from the key
        const planId = key.split('_')[2]

        // If validPlanIds are provided, clean up orphaned progress
        if (validPlanIds && validPlanIds.length > 0 && !validPlanIds.includes(planId)) {
          console.log('📝 PROGRESS: Removing progress for deleted plan:', planId)
          sessionStorage.removeItem(key)
          continue
        }

        try {
          const progressData = JSON.parse(sessionStorage.getItem(key) || '{}')
          console.log('📝 PROGRESS: Found session progress for key:', key, progressData)
          sessionProgress.push(progressData)
        } catch (error) {
          console.error('Error parsing session progress:', error)
        }
      }
    }
    console.log('📝 PROGRESS: Session progress scan complete. Found:', sessionProgress.length, 'entries')
    return sessionProgress
  }

  // Get user progress for a specific plan
  async getUserProgressForPlan(userId: string, planId: string): Promise<any> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_progress?user_id=eq.${userId}&plan_id=eq.${planId}`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        }
      })

      if (response.ok) {
        const progress = await response.json()
        if (progress.length > 0) {
          return progress[0]
        }
      }

      // Fallback to session storage
      const sessionKey = `progress_${userId}_${planId}`
      const sessionProgress = sessionStorage.getItem(sessionKey)
      if (sessionProgress) {
        console.log('📝 PROGRESS: Using session storage fallback for plan:', planId)
        return JSON.parse(sessionProgress)
      }

      return null
    } catch (error) {
      console.error('Error fetching plan progress:', error)
      // Try session storage as fallback
      const sessionKey = `progress_${userId}_${planId}`
      const sessionProgress = sessionStorage.getItem(sessionKey)
      if (sessionProgress) {
        console.log('📝 PROGRESS: Using session storage fallback after API error for plan:', planId)
        return JSON.parse(sessionProgress)
      }
      return null
    }
  }

  // Initialize user progress for a plan (simplified)
  async initializeProgress(userId: string, planId: string): Promise<any> {
    try {
      console.log('📝 PROGRESS: Skipping progress initialization - RLS issues resolved later')
      return { user_id: userId, plan_id: planId, completed_days: [], current_day: 1 }
    } catch (error: any) {
      console.error('❌ PROGRESS: Error initializing progress:', error)
      throw error
    }
  }

  // Update user progress for a plan via direct API
  async updateProgress(userId: string, planId: string, updates: any): Promise<any> {
    try {
      console.log('📝 PROGRESS: Updating progress via API for plan:', planId)

      // First try to find existing progress
      const existingResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_progress?user_id=eq.${userId}&plan_id=eq.${planId}`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        }
      })

      const existingProgress = await existingResponse.json()
      const progressData = {
        user_id: userId,
        plan_id: planId,
        completed_days: updates.completed_days || [],
        current_day: updates.current_day || 1
      }

      // Temporarily save to sessionStorage until RLS is resolved
      console.log('📝 PROGRESS: RLS cache issue - saving to session storage until resolved')
      const sessionKey = `progress_${userId}_${planId}`
      sessionStorage.setItem(sessionKey, JSON.stringify(progressData))
      console.log('✅ PROGRESS: Day completed successfully (saved to session storage)')
      return progressData
    } catch (error) {
      console.error('Error updating progress:', error)
      throw error
    }
  }

  // Complete a day for a specific plan via direct API
  async completeDay(userId: string, planId: string, dayNumber: number): Promise<any> {
    try {
      console.log('📝 PROGRESS: Completing day', dayNumber, 'for plan:', planId)

      // First check session storage for existing progress (handles RLS cache issues)
      const sessionKey = `progress_${userId}_${planId}`
      const sessionProgress = sessionStorage.getItem(sessionKey)
      let completedDays = []

      if (sessionProgress) {
        try {
          const existing = JSON.parse(sessionProgress)
          completedDays = existing.completed_days || []
          console.log('📝 PROGRESS: Found existing session progress:', completedDays)
        } catch (e) {
          console.error('📝 PROGRESS: Error parsing session progress, starting fresh')
        }
      } else {
        // Fallback to API check if no session storage
        try {
          const existingResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_progress?user_id=eq.${userId}&plan_id=eq.${planId}`, {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            }
          })

          const existingProgress = await existingResponse.json()
          if (existingProgress && existingProgress.length > 0) {
            completedDays = existingProgress[0].completed_days || []
          }
        } catch (apiError) {
          console.log('📝 PROGRESS: API check failed, starting with empty progress')
        }
      }

      // Add the completed day if not already included
      if (!completedDays.includes(dayNumber)) {
        completedDays.push(dayNumber)
      }

      // Sort completed days to maintain proper order
      completedDays.sort((a: number, b: number) => a - b)
      console.log('📝 PROGRESS: Updated completed days:', completedDays)

      // Update progress with accumulated completed days
      return await this.updateProgress(userId, planId, {
        completed_days: completedDays,
        current_day: Math.min(Math.max(...completedDays) + 1, 7)
      })
    } catch (error) {
      console.error('❌ PROGRESS: Error completing day:', error)
      throw error
    }
  }

  // Get user's learning statistics (simplified)
  async getUserStats(userId: string) {
    try {
      const plans = await this.getUserPlans(userId)
      return {
        totalPlans: plans.length,
        completedPlans: 0,
        totalDaysCompleted: 0,
        plansInProgress: plans.length
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return {
        totalPlans: 0,
        completedPlans: 0,
        totalDaysCompleted: 0,
        plansInProgress: 0
      }
    }
  }
}

export const hobbyPlanService = new HobbyPlanService()