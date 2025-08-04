import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { userProfileService, type UserProfile } from '@/services/userProfileService'
import { hobbyPlanService } from '@/services/hobbyPlanService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Calendar, BookOpen, Trophy, Clock, Plus, ArrowRight, Trash2, Share } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { UnifiedNavigation } from '@/components/UnifiedNavigation'

interface UserProgress {
  id: string
  user_id: string
  plan_id: string
  completed_days: number[]
  current_day: number
  unlocked_days: number[]
  last_accessed_at: string
}

export function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const [plans, setPlans] = useState<any[]>([])
  const [progress, setProgress] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Check if user came from a generated plan
  const getLastViewedPlan = () => {
    console.log('🔍 getLastViewedPlan called')
    const lastPlanId = localStorage.getItem('lastViewedPlan')
    const lastPlanData = localStorage.getItem('lastViewedPlanData')
    console.log('🔍 Checking stored plan data:', { 
      lastPlanId: lastPlanId ? `exists: ${lastPlanId}` : 'missing', 
      lastPlanData: lastPlanData ? 'exists' : 'missing' 
    })
    
    if (lastPlanId && lastPlanData) {
      try {
        const parsedData = JSON.parse(lastPlanData)
        console.log('🔍 Successfully parsed plan data:', parsedData.hobby)
        return { id: lastPlanId, data: parsedData }
      } catch (e) {
        console.warn('Failed to parse stored plan data:', e)
        return null
      }
    }
    console.log('🔍 No plan data found in localStorage')
    return null
  }

  const handleBackToPlan = (planData?: any) => {
    console.log('🔄 handleBackToPlan called with:', planData ? 'specific plan' : 'auto-detect')
    
    // If specific plan data is provided, use it
    if (planData) {
      console.log('📍 Navigating to specific plan:', planData.title)
      sessionStorage.setItem('currentPlanData', JSON.stringify(planData))
      window.location.hash = '#/plan'
      return
    }
    
    // First check if there's an active plan from the current session
    const activePlanData = sessionStorage.getItem('activePlanData');
    if (activePlanData) {
      try {
        const parsedData = JSON.parse(activePlanData);
        console.log('🔄 Navigating back to active plan:', parsedData.hobby);
        sessionStorage.setItem('currentPlanData', activePlanData);
        window.location.hash = '#/plan';
        return;
      } catch (e) {
        console.warn('Failed to parse active plan data');
      }
    }
    
    // Fallback to last viewed plan
    const lastPlan = getLastViewedPlan()
    console.log('🔙 Back button clicked. Last plan:', lastPlan)
    
    if (lastPlan && lastPlan.data) {
      // Set the plan data in global state before navigating
      console.log('📍 Navigating back to plan with data:', lastPlan.data.hobby)
      
      // Use a temporary localStorage key that App.tsx will check and clear
      localStorage.setItem('tempPlanForNavigation', JSON.stringify(lastPlan.data))
      console.log('💾 Stored plan in temporary localStorage for App.tsx:', lastPlan.data.hobby)
      
      // Navigate to plan page
      window.location.hash = '#/plan'
    } else {
      console.log('❌ No plan found, going to generate page')
      window.location.hash = '#/generate'
    }
  }

  const handleDeletePlan = async (planId: string, planTitle: string) => {
    if (!user?.id) return
    
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete "${planTitle}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      console.log('🗑️ Deleting plan:', planId, planTitle)
      
      // Import the service dynamically
      const { HobbyPlanService } = await import('@/services/hobbyPlanService')
      const planService = new HobbyPlanService()
      
      await planService.deletePlan(planId, user.id)
      
      toast({
        title: "Plan Deleted",
        description: `"${planTitle}" has been deleted successfully.`,
      })
      
      // Refresh plans list
      fetchUserPlans()
      
    } catch (error: any) {
      console.error('Failed to delete plan:', error)
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete plan. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    console.log('DashboardPage: useEffect triggered', { 
      userEmail: user?.email || 'none', 
      authLoading, 
      dashboardLoading: loading,
      hasUser: !!user 
    })
    
    if (authLoading) {
      console.log('DashboardPage: Auth still loading, waiting...')
      return
    }
    
    if (!user) {
      console.log('DashboardPage: No user found, will show please sign in message')
      // Reset loading state when no user is found
      setLoading(false)
      return
    }
    
    console.log('📖 SUPABASE: User found! Fetching plans and progress for:', user.email)
    fetchUserPlans()
  }, [user, authLoading])



  const fetchUserPlans = async () => {
    try {
      console.log('📖 SUPABASE: Fetching user plans for user ID:', user?.id)
      
      if (!user?.id) {
        console.log('📖 SUPABASE: No user ID, setting loading false')
        setLoading(false)
        return
      }

      // Give database more time to respond - 10 seconds should be sufficient
      const quickTimeout = setTimeout(() => {
        console.log('📖 SUPABASE: Timeout triggered after 10 seconds, showing empty dashboard')
        setPlans([])
        setProgress([])
        setUserProfile(null)
        setLoading(false)
      }, 10000)

      console.log('📖 SUPABASE: Starting plans query via direct API...')
      
      try {
        // Use direct API call like the save function
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/hobby_plans?user_id=eq.${user.id}&order=created_at.desc`, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          }
        })

        clearTimeout(quickTimeout)
        
        if (response.ok) {
          const plansData = await response.json()
          console.log('📖 SUPABASE: Plans query completed via API. Result:', plansData?.length || 0, 'plans')
          setPlans(plansData || [])
        } else {
          console.error('📖 SUPABASE: API error:', response.status, response.statusText)
          setPlans([])
        }
      } catch (apiError) {
        console.error('📖 SUPABASE: API fetch error:', apiError)
        setPlans([])
      }

      // Fetch user's progress using service (includes session storage fallback)
      console.log('📖 SUPABASE: Starting progress query with session storage fallback...')
      
      try {
        // Pass existing plan IDs to clean up orphaned progress data  
        const existingPlanIds = (plans || []).map((p: any) => p.id)
        const progressData = await hobbyPlanService.getUserProgress(user.id, existingPlanIds)
        console.log('📖 SUPABASE: Progress query completed via service. Result:', progressData?.length || 0, 'progress entries')
        setProgress(progressData || [])
      } catch (progressError: any) {
        console.error('📖 SUPABASE: Progress fetch error:', progressError)
        console.error('📖 SUPABASE: Progress error details:', progressError?.message, progressError?.stack)
        setProgress([])
      }

      // Fetch user profile - simplified to not block dashboard
      console.log('📖 Fetching user profile for:', user.id)
      setUserProfile({
        id: user.id,
        user_id: user.id,
        email: user.email || null,
        full_name: null,
        avatar_url: null,
        total_plans_created: 0,
        total_days_completed: 0,
        current_streak: 0,
        longest_streak: 0,
        joined_at: new Date().toISOString(),
        last_active_at: new Date().toISOString()
      })

      console.log('📖 SUPABASE: All data fetched, setting loading to false')
      setLoading(false)

    } catch (error) {
      console.error('📖 SUPABASE: Fatal error in fetchUserPlans:', error)
      toast({
        title: "Error loading dashboard",
        description: "There was an error loading your dashboard data.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    console.log('Dashboard: handleSignOut called')
    try {
      await signOut()
    } catch (error: any) {
      console.error('Dashboard: handleSignOut error:', error)
    }
  }

  const getProgressForPlan = (planId: string) => {
    return progress.find(p => p.plan_id === planId)
  }

  const calculateProgressPercentage = (planProgress: UserProgress | undefined) => {
    if (!planProgress) return 0
    const percentage = (planProgress.completed_days.length / 7) * 100
    console.log('🎯 Dashboard calculating progress:', {
      planId: planProgress.plan_id,
      completedDays: planProgress.completed_days,
      percentage
    })
    return percentage
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (loading && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavigation currentPage="dashboard" />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access your dashboard and view your hobby plans.</p>
            <Button 
              onClick={() => window.location.hash = '#/'}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
            >
              Go to Home & Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavigation 
        currentPage="dashboard" 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Your personalized hobby learning dashboard
            </p>
            
            {/* Welcome message for new users */}
            {plans.length === 0 && !loading && (
              <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="text-sm text-blue-700">
                  <strong>Get Started:</strong> Create your first 7-day hobby plan with AI guidance.
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              onClick={() => window.location.hash = '#/generate'}
              className="bg-purple-600 hover:bg-purple-700 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-1 sm:mr-2" />
              New Plan
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="text-sm sm:text-base">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plans.filter(plan => {
                const planProgress = progress.find(p => p.plan_id === plan.id)
                return !planProgress || planProgress.completed_days.length < 7
              }).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Plans</CardTitle>
              <Trophy className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progress.filter(p => {
                  // Only count progress for plans that actually exist
                  const planExists = plans.find(plan => plan.id === p.plan_id)
                  return planExists && p.completed_days.length === 7
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plans Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Learning Plans</h2>
          
          {plans.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No plans yet</h3>
                <p className="text-gray-600 text-center mb-6">
                  Start your learning journey by creating your first hobby plan
                </p>
                <Button
                  onClick={() => window.location.hash = '#/generate'}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const planProgress = getProgressForPlan(plan.id)
                const progressPercentage = calculateProgressPercentage(planProgress)
                
                // Extract hobby from title since hobby field doesn't exist in production
                const extractHobbyFromTitle = (title: string) => {
                  // Match both "Learn X in 7 Days" and "Master X in 7 Days" patterns
                  const match = title.match(/(?:Learn|Master) (\w+) in/i)
                  return match ? match[1] : 'Hobby'
                }
                const hobby = extractHobbyFromTitle(plan.title)
                
                return (
                  <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="capitalize">{hobby}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-normal text-gray-500">
                            {progressPercentage === 100 ? '✅' : '📚'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeletePlan(plan.id, plan.title)
                            }}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>{plan.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{planProgress?.completed_days.length || 0}/7 days</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Day {planProgress?.current_day || 1}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(plan.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        {progressPercentage === 100 ? (
                          // For completed plans, show both Review Plan and Share buttons
                          <div className="space-y-2">
                            <Button 
                              className="w-full" 
                              variant="outline"
                              onClick={() => {
                                // CRITICAL FIX: Ensure plan ID is preserved for progress saving 
                                const extractHobbyFromTitle1 = (title: string) => {
                                  const match = title.match(/(?:Learn|Master) (\w+) in/i)
                                  return match ? match[1] : 'Hobby'
                                }
                                const hobby1 = extractHobbyFromTitle1(plan.title)
                                
                                // Handle doubly nested plan_data structure and ensure plan ID is included
                                const actualPlanData1 = plan.plan_data?.plan_data || plan.plan_data || {};
                                const daysArray1 = actualPlanData1.days || [];
                                
                                // Create complete plan data with proper ID and structure
                                const planDataToStore = {
                                  id: plan.id, // CRITICAL: Include database plan ID
                                  hobby: hobby1,
                                  title: plan.title,
                                  overview: plan.overview || actualPlanData1.overview || `Master ${hobby1} in 7 days with this personalized plan.`,
                                  difficulty: actualPlanData1.difficulty || 'beginner',
                                  totalDays: daysArray1.length || 7,
                                  days: daysArray1,
                                  lastAccessed: new Date().toISOString(),
                                  fromDashboard: true,
                                  // Additional metadata for progress tracking
                                  planId: plan.id,
                                  userId: user?.id
                                };
                                
                                console.log('🔄 Continue plan clicked with PLAN ID:', plan.id, plan.title);
                                
                                // Store plan data in multiple locations with plan ID preserved
                                try {
                                  sessionStorage.setItem('currentPlanData', JSON.stringify(planDataToStore));
                                  sessionStorage.setItem('activePlanData', JSON.stringify(planDataToStore));
                                  localStorage.setItem('lastViewedPlanData', JSON.stringify(planDataToStore));
                                  localStorage.setItem('tempPlanForNavigation', JSON.stringify(planDataToStore));
                                  localStorage.setItem('persistentPlanData', JSON.stringify(planDataToStore));
                                  
                                  // Store plan ID separately for easy access
                                  sessionStorage.setItem('currentPlanId', plan.id);
                                  localStorage.setItem('currentPlanId', plan.id);
                                  
                                  console.log('✅ Plan data stored with ID:', plan.id);
                                } catch (error) {
                                  console.error('❌ Failed to store plan data:', error);
                                }
                                
                                // CRITICAL FIX: Navigate to correct route - #/plan (force hash change)
                                console.log('🚀 Navigating to plan route with stored data');
                                window.location.hash = '/plan';
                                
                                // Trigger custom event with plan ID
                                window.dispatchEvent(new CustomEvent('planDataReady', { 
                                  detail: { 
                                    ...planDataToStore,
                                    planId: plan.id 
                                  } 
                                }));
                              }}
                            >
                              <ArrowRight className="w-4 h-4 mr-2" />
                              Review Plan
                            </Button>
                            <Button 
                              className="w-full" 
                              variant="secondary"
                              onClick={() => {
                                // Generate share text for social media
                                const shareText = `🎉 I just completed my 7-day ${hobby} learning journey with Wizqo! From beginner to confident practitioner in just one week. Ready to start your own learning adventure? Check out Wizqo.com 🚀 #LearningJourney #${hobby.charAt(0).toUpperCase() + hobby.slice(1)} #Wizqo`;
                                
                                // Try to use native sharing if available
                                if (navigator.share) {
                                  navigator.share({
                                    title: `I completed ${plan.title}!`,
                                    text: shareText,
                                    url: window.location.origin
                                  }).catch(console.error);
                                } else {
                                  // Fallback to copying to clipboard
                                  navigator.clipboard.writeText(shareText + ` ${window.location.origin}`).then(() => {
                                    toast({
                                      title: "Copied to clipboard!",
                                      description: "Share text copied. Paste it on your favorite social media platform.",
                                    });
                                  }).catch(() => {
                                    // Final fallback - open Twitter/X share dialog
                                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.origin)}`;
                                    window.open(twitterUrl, '_blank');
                                  });
                                }
                              }}
                            >
                              <Share className="w-4 h-4 mr-2" />
                              Share Achievement
                            </Button>
                          </div>
                        ) : (
                          // For incomplete plans, show Continue Plan button
                          <Button 
                            className="w-full" 
                            onClick={() => {
                              // CRITICAL FIX: Same logic for Continue Plan button
                              const extractHobbyFromTitle2 = (title: string) => {
                                const match = title.match(/(?:Learn|Master) (\w+) in/i)
                                return match ? match[1] : 'Hobby'
                              }
                              const hobby2 = extractHobbyFromTitle2(plan.title)
                              
                              // Handle doubly nested plan_data structure and ensure plan ID is included
                              const actualPlanData2 = plan.plan_data?.plan_data || plan.plan_data || {};
                              const daysArray2 = actualPlanData2.days || [];
                              
                              // Create complete plan data with proper ID and structure
                              const planDataToStore2 = {
                                id: plan.id, // CRITICAL: Include database plan ID
                                hobby: hobby2,
                                title: plan.title,
                                overview: plan.overview || actualPlanData2.overview || `Master ${hobby2} in 7 days with this personalized plan.`,
                                difficulty: actualPlanData2.difficulty || 'beginner',
                                totalDays: daysArray2.length || 7,
                                days: daysArray2,
                                lastAccessed: new Date().toISOString(),
                                fromDashboard: true,
                                // Additional metadata for progress tracking
                                planId: plan.id,
                                userId: user?.id
                              };
                              
                              console.log('🔄 Continue plan clicked with PLAN ID:', plan.id, plan.title);
                              
                              // Store plan data in multiple locations with plan ID preserved
                              try {
                                sessionStorage.setItem('currentPlanData', JSON.stringify(planDataToStore2));
                                sessionStorage.setItem('activePlanData', JSON.stringify(planDataToStore2));
                                localStorage.setItem('lastViewedPlanData', JSON.stringify(planDataToStore2));
                                localStorage.setItem('tempPlanForNavigation', JSON.stringify(planDataToStore2));
                                localStorage.setItem('persistentPlanData', JSON.stringify(planDataToStore2));
                                
                                // Store plan ID separately for easy access
                                sessionStorage.setItem('currentPlanId', plan.id);
                                localStorage.setItem('currentPlanId', plan.id);
                                
                                console.log('✅ Plan data stored with ID:', plan.id);
                              } catch (error) {
                                console.error('❌ Failed to store plan data:', error);
                              }
                              
                              // CRITICAL FIX: Navigate to correct route - #/plan (force hash change)
                              console.log('🚀 Continue Plan - Navigating to plan route with stored data');
                              window.location.hash = '/plan';
                              
                              // Trigger custom event with plan ID
                              window.dispatchEvent(new CustomEvent('planDataReady', { 
                                detail: { 
                                  ...planDataToStore2,
                                  planId: plan.id 
                                } 
                              }));
                            }}
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Continue Plan
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}