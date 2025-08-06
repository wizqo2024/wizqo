import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Play, MoreHorizontal, Trash2, Share2, Trophy, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { UnifiedNavigation } from './UnifiedNavigation';

interface HobbyPlan {
  id: string;
  hobby: string;
  title: string;
  progress: number;
  totalDays: number;
  currentDay: number;
  category: string;
  startDate: string;
  expectedEndDate: string;
  status: 'in_progress' | 'completed' | 'paused';
  image?: string;
  planData?: any;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [hobbyPlans, setHobbyPlans] = useState<HobbyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingPlan, setDeletingPlan] = useState<string | null>(null);
  
  // Social sharing function
  const shareAchievement = (plan: HobbyPlan) => {
    const shareText = `🎉 I just completed my 7-day ${plan.hobby} learning journey! 
    
✅ Mastered ${plan.hobby} fundamentals in just 7 days
📚 Completed all ${plan.totalDays} daily lessons
🚀 Ready for the next challenge!

#7DayChallenge #Learning #${plan.hobby.charAt(0).toUpperCase() + plan.hobby.slice(1)} #PersonalGrowth`;

    const shareUrl = `https://wizqo.com`;
    
    // Create sharing URLs for different platforms
    const platforms = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`Completed 7-Day ${plan.hobby} Challenge!`)}&summary=${encodeURIComponent(shareText)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    };

    // Open a modal or dropdown with sharing options
    return platforms;
  };

  useEffect(() => {
    if (user) {
      loadUserPlans();
    }
  }, [user]);

  const loadUserPlans = async () => {
    try {
      console.log('📋 Loading user plans for:', user?.id);
      
      // First, load saved plans from Supabase
      const plansResponse = await fetch(`/api/hobby-plans?user_id=${user?.id}`);
      let savedPlans: any[] = [];
      
      if (plansResponse.ok) {
        savedPlans = await plansResponse.json();
        console.log('📋 Found saved plans:', savedPlans.length);
      }
      
      // Then load progress data  
      const progressResponse = await fetch(`/api/user-progress/${user?.id}`);
      let progressData: any[] = [];
      
      if (progressResponse.ok) {
        progressData = await progressResponse.json();
        console.log('📋 Found progress entries:', progressData.length);
      }
      
      // Also check localStorage for recent plans
      const recentPlans = [];
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith('hobbyPlan_') || key === 'lastViewedPlanData') {
          try {
            const planData = JSON.parse(localStorage.getItem(key) || '{}');
            if (planData && planData.hobby && planData.title) {
              recentPlans.push(planData);
            }
          } catch (e) {
            console.log('Could not parse plan from localStorage:', key);
          }
        }
      }
      console.log('📋 Found localStorage plans:', recentPlans.length);
      
      // Combine all plan sources
      const allPlans = new Map();
      
      // Add saved plans from Supabase
      savedPlans.forEach(plan => {
        const hobbyName = plan.hobby_name || plan.hobby;
        const planData = plan.plan_data;
        
        const progressEntry = progressData.find(p => p.plan_id === plan.id);
        
        // Check session storage for progress fallback
        let completedDays = progressEntry?.completed_days || [];
        let currentDay = progressEntry?.current_day || 1;
        
        // Fallback to session storage if no database progress
        if (!progressEntry) {
          // Use the correct session storage key format from hobbyPlanService
          const userId = user?.id || 'anonymous';
          const possibleKeys = [
            `progress_${userId}_${plan.id}`,  // hobbyPlanService format
            `progress_${plan.id}`,
            `progress_${hobbyName}`,
            `hobbyProgress_${plan.id}`,
            `${hobbyName}_progress`
          ];
          
          console.log(`🔍 Searching for progress with userId: ${userId}, planId: ${plan.id}`);
          
          for (const sessionKey of possibleKeys) {
            const sessionProgress = sessionStorage.getItem(sessionKey);
            if (sessionProgress) {
              try {
                const parsed = JSON.parse(sessionProgress);
                if (parsed.completedDays || parsed.completed_days) {
                  completedDays = parsed.completedDays || parsed.completed_days || [];
                  currentDay = parsed.currentDay || parsed.current_day || 1;
                  console.log(`📊 Progress loaded from session key ${sessionKey} for ${plan.id}:`, completedDays.length, 'days completed');
                  break;
                }
              } catch (e) {
                console.log('Could not parse session progress for key:', sessionKey);
              }
            }
          }
        }
        
        const progressPercent = Math.round((completedDays.length / 7) * 100);
        console.log(`📊 Plan ${plan.id} progress: ${progressPercent}% (${completedDays.length}/7 days)`);
        
        allPlans.set(plan.id, {
          id: plan.id,
          hobby: hobbyName,
          title: plan.title,
          progress: progressPercent,
          totalDays: 7,
          currentDay: currentDay,
          category: getCategoryForHobby(hobbyName),
          startDate: plan.created_at,
          expectedEndDate: new Date(new Date(plan.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: completedDays.length >= 7 ? 'completed' : 'in_progress',
          planData: planData
        });
      });
      
      // Add recent plans from localStorage if not already in Supabase (avoid duplicates)
      recentPlans.forEach(planData => {
        const planId = `local-${planData.hobby}-${Date.now()}`;
        // Check for duplicates by hobby name
        const isDuplicate = Array.from(allPlans.values()).some(p => 
          p.hobby.toLowerCase() === planData.hobby.toLowerCase()
        );
        
        if (!isDuplicate) {
          allPlans.set(planId, {
            id: planId,
            hobby: planData.hobby,
            title: planData.title,
            progress: 0,
            totalDays: 7,
            currentDay: 1,
            category: getCategoryForHobby(planData.hobby),
            startDate: new Date().toISOString(),
            expectedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'in_progress' as const,
            planData: planData
          });
        }
      });
      
      const finalPlans = Array.from(allPlans.values());
      console.log('📋 Total plans loaded:', finalPlans.length);
      setHobbyPlans(finalPlans);
      
    } catch (error) {
      console.error('Error loading user plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryForHobby = (hobby: string): string => {
    const categories: Record<string, string> = {
      drawing: 'Arts & Creativity',
      painting: 'Arts & Creativity',
      photography: 'Arts & Creativity',
      cooking: 'Culinary',
      baking: 'Culinary',
      guitar: 'Music',
      piano: 'Music',
      yoga: 'Fitness & Wellness',
      dance: 'Fitness & Wellness',
      coding: 'Technology',
      programming: 'Technology'
    };
    return categories[hobby.toLowerCase()] || 'General';
  };

  const deletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }
    
    setDeletingPlan(planId);
    try {
      // Delete from Supabase if it's a real plan (not local)
      if (!planId.startsWith('local-') && user?.id) {
        const response = await fetch(`/api/hobby-plans/${planId}?user_id=${user.id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete plan from database');
        }
      }
      
      // Remove from local state
      setHobbyPlans(prev => prev.filter(plan => plan.id !== planId));
      
      // Clean up localStorage
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.includes(planId) || (key.startsWith('hobbyPlan_') && localStorage.getItem(key)?.includes(planId))) {
          localStorage.removeItem(key);
        }
      }
      
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan. Please try again.');
    } finally {
      setDeletingPlan(null);
    }
  };

  const getHobbyImage = (hobby: string): string => {
    const images: Record<string, string> = {
      drawing: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=240&fit=crop',
      painting: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=240&fit=crop',
      photography: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=240&fit=crop',
      cooking: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=240&fit=crop',
      guitar: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=240&fit=crop',
      yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=240&fit=crop',
      coding: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop'
    };
    return images[hobby] || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=240&fit=crop';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'paused': return 'Paused';
      default: return 'Unknown';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
          <p className="text-gray-600 mb-6">Sign in to view your hobby learning progress and continue your 7-day journeys.</p>
          <Button onClick={() => window.location.hash = '#/login'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Use the exact same navigation as home page */}
      <UnifiedNavigation currentPage="dashboard" />

      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Learning Dashboard</h1>
        <p className="text-gray-600">Track your progress across all your hobby learning journeys</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hobbyPlans.filter(p => p.status === 'in_progress').length}</p>
                <p className="text-sm text-gray-600">Active Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hobbyPlans.filter(p => p.status === 'completed').length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hobbyPlans.reduce((acc, plan) => acc + plan.currentDay, 0)}</p>
                <p className="text-sm text-gray-600">Days Learned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(hobbyPlans.reduce((acc, plan) => acc + plan.progress, 0) / hobbyPlans.length) || 0}%</p>
                <p className="text-sm text-gray-600">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hobby Plans Grid */}
      {hobbyPlans.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-4">No Learning Plans Yet</h3>
          <p className="text-gray-600 mb-6">Start your first 7-day hobby learning journey today!</p>
          <Button onClick={() => window.location.hash = '#/generate'}>
            Create Your First Plan
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hobbyPlans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Plan Image */}
              <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                <img 
                  src={getHobbyImage(plan.hobby)} 
                  alt={plan.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to gradient background if image fails
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />

                <div className="absolute top-4 left-4">
                  <Badge className={`${getStatusColor(plan.status)} text-white`}>
                    {getStatusText(plan.status)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Plan Title */}
                <h3 className="font-semibold text-lg mb-2">{plan.title}</h3>
                
                {/* Category and Duration */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <span>{plan.category}</span>
                  <span className="mx-2">•</span>
                  <span>{plan.totalDays} days</span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-bold">{plan.progress}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-2" />
                </div>

                {/* Dates - only show start date */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Started {format(new Date(plan.startDate), 'MMM d, yyyy')}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePlan(plan.id)}
                    disabled={deletingPlan === plan.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Social Sharing Button for Completed Plans */}
                {plan.status === 'completed' && (
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-0.5 rounded-lg">
                      <div className="bg-white dark:bg-gray-900 rounded-[6px] p-4">
                        <div className="flex items-center justify-center space-x-2 mb-3">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            Challenge Completed! 🎉
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => {
                              const platforms = shareAchievement(plan);
                              window.open(platforms.twitter, '_blank');
                            }}
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            Twitter
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
                            onClick={() => {
                              const platforms = shareAchievement(plan);
                              window.open(platforms.facebook, '_blank');
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Facebook
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => {
                              const platforms = shareAchievement(plan);
                              window.open(platforms.whatsapp, '_blank');
                            }}
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  onClick={() => {
                    // Store plan data for navigation
                    if (plan.planData) {
                      sessionStorage.setItem('currentPlanData', JSON.stringify(plan.planData));
                    }
                    window.location.hash = '#/plan';
                  }}
                  className="w-full" 
                  variant={plan.status === 'completed' ? 'outline' : 'default'}
                >
                  {plan.status === 'completed' ? 'View Plan' : 'Continue Learning'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}