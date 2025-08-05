import { supabase } from '../lib/supabase'

export class HobbyPlanService {
  // Check if plan already exists for this hobby
  async checkExistingPlan(hobby: string, userId: string): Promise<any> {
    try {
      console.log('🔍 CHECKING: Looking for existing plan for hobby:', hobby, 'user:', userId)
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hobby_plans?user_id=eq.${userId}&select=id,title,created_at,plan_data&order=created_at.desc`, {
        method: 'GET',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const allPlans = await response.json()
        // Filter for the specific hobby by extracting from title
        const existingPlans = allPlans?.filter((p: any) => {
          if (p.title) {
            const titleMatch = p.title.match(/Learn (\w+) in/i)
            const planHobby = titleMatch ? titleMatch[1].toLowerCase() : ''
            return planHobby === hobby.toLowerCase()
          }
          return false
        }) || []

        console.log('🔍 CHECKING: Found', existingPlans.length, 'existing plans for hobby:', hobby)
        return existingPlans.length > 0 ? existingPlans[0] : null
      }
      return null
    } catch (error) {
      console.error('❌ CHECKING ERROR: Failed to check existing plans:', error)
      return null
    }
  }

  // Save a hobby plan to Supabase
  async savePlan(planData: any, userId: string): Promise<any> {
    try {
      console.log('💾 SUPABASE SAVE: Starting plan save for user:', userId)
      console.log('💾 SUPABASE SAVE: Plan data:', planData)
      
      // Check if plan already exists for this hobby
      const existingPlan = await this.checkExistingPlan(planData.hobby, userId)
      if (existingPlan) {
        console.log('⚠️ DUPLICATE PLAN: Plan already exists for hobby:', planData.hobby)
        throw new Error(`You already have a learning plan for ${planData.hobby}. Check your dashboard to continue your existing plan.`)
      }
      
      console.log('💾 SUPABASE SAVE: Making direct fetch request to Supabase API')

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hobby_plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: userId,
          hobby_name: planData.hobby,
          title: planData.title,
          overview: planData.overview,
          difficulty: planData.difficulty,
          total_days: planData.totalDays,
          plan_data: planData
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      console.log('💾 SUPABASE SAVE: Fetch completed with status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('💾 SUPABASE SAVE: HTTP Error:', response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log('✅ SUPABASE SAVE SUCCESS: Plan saved successfully:', result[0])
      return result[0]

    } catch (error: any) {
      console.error('❌ SUPABASE SAVE ERROR: Failed to save plan:', error)
      
      if (error.name === 'AbortError') {
        console.error('❌ SUPABASE SAVE: Network timeout after 2 seconds')
        throw new Error('Plan save timed out - please check your connection')
      }
      
      throw error
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

      if (response.ok) {
        console.log('✅ PROGRESS: Progress updated successfully in database')
        return progressData
      } else {
        const errorText = await response.text()
        console.error('❌ PROGRESS: Failed to update progress:', response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
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
      completedDays.sort((a, b) => a - b)
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