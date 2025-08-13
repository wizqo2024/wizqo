import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Play, Trash2, Share2, Trophy, ExternalLink, X } from "lucide-react";
import { format } from "date-fns";
import { UnifiedNavigation } from './UnifiedNavigation';

// Mocking hobbyPlanService for demonstration purposes
const hobbyPlanService = {
  clearHobbyCache: (hobby: string, userId: string) => {
    console.log(`Mock: Clearing cache for hobby "${hobby}" and user "${userId}"`);
    // In a real scenario, this would clear specific caches related to the hobby.
    // For this fix, we are relying on more aggressive session/local storage clearing.
  }
};

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState<any>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading your learning dashboard...');

  // Social sharing function with all platforms
  const openShareModal = (plan: HobbyPlan) => {
    const shareText = `🎉 I just completed my 7-day ${plan.hobby.toUpperCase()} learning journey! 

✅ Mastered ${plan.hobby} fundamentals in just 7 days
📚 Completed all ${plan.totalDays} daily lessons  
🚀 Ready for the next challenge!

#7DayChallenge #Learning #${plan.hobby.charAt(0).toUpperCase() + plan.hobby.slice(1)} #PersonalGrowth #Wizqo

Learn any hobby in 7 days at https://wizqo.com`;

    const shareUrl = `https://wizqo.com`;
    const imageUrl = getHobbyImage(plan.hobby);

    const platforms = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://wizqo.com')}&quote=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://wizqo.com')}&title=${encodeURIComponent('🎉 Completed 7-Day ' + plan.hobby.toUpperCase() + ' Challenge!')}&summary=${encodeURIComponent(shareText)}`,
      instagram: shareText,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`
    };

    setShareData({ platforms, plan, text: shareText, image: imageUrl });
    setShowShareModal(true);
  };

  useEffect(() => {
    if (user) {
      loadUserPlans();
    }
  }, [user]);

  const loadUserPlans = async () => {
    try {
      setLoadingMessage('Fetching your learning plans...');
      console.log('📋 Loading user plans for:', user?.id);

      // Check for loading flag but with timeout to prevent permanent blocking
      const isAlreadyLoading = sessionStorage.getItem('dashboardLoading');
      const loadingTimestamp = sessionStorage.getItem('dashboardLoadingTime');
      const now = Date.now();

      // If loading flag is older than 10 seconds, clear it (prevents permanent blocking)
      if (isAlreadyLoading === 'true' && loadingTimestamp) {
        const timeDiff = now - parseInt(loadingTimestamp);
        if (timeDiff > 10000) {
          console.log('📋 Clearing stale loading flag (older than 10 seconds)');
          sessionStorage.removeItem('dashboardLoading');
          sessionStorage.removeItem('dashboardLoadingTime');
        } else {
          console.log('📋 Dashboard already loading, skipping duplicate request');
          return;
        }
      } else if (isAlreadyLoading === 'true') {
        console.log('📋 Dashboard already loading, skipping duplicate request');
        return;
      }

      sessionStorage.setItem('dashboardLoading', 'true');
      sessionStorage.setItem('dashboardLoadingTime', now.toString());

      try {
        // Load saved plans from Supabase with deduplication
        setLoadingMessage('Loading saved plans...');
        const plansResponse = await fetch(`/api/hobby-plans?user_id=${user?.id}`);
        let savedPlans: any[] = [];

        if (plansResponse.ok) {
          savedPlans = await plansResponse.json();
          console.log('📋 Found saved plans:', savedPlans.length);

          // Deduplicate plans by hobby and take the most recent
          const deduplicatedPlans = new Map();
          savedPlans.forEach(plan => {
            const hobby = plan.hobby_name || plan.hobby;
            const existing = deduplicatedPlans.get(hobby);
            if (!existing || new Date(plan.created_at) > new Date(existing.created_at)) {
              deduplicatedPlans.set(hobby, plan);
            }
          });
          savedPlans = Array.from(deduplicatedPlans.values());
          console.log('📋 Deduplicated to:', savedPlans.length, 'unique plans');
        }

        // Load progress data
        setLoadingMessage('Loading progress data...');
        const progressResponse = await fetch(`/api/user-progress/${user?.id}`);
        let progressData: any[] = [];

        if (progressResponse.ok) {
          progressData = await progressResponse.json();
          console.log('📋 Found progress entries:', progressData.length);
        }

        // Process plans with progress
        const processedPlans: HobbyPlan[] = savedPlans.map(plan => {
          const hobbyName = plan.hobby_name || plan.hobby;
          const progressEntry = progressData.find(p => p.plan_id === plan.id);

          let completedDays = progressEntry?.completed_days || [];
          let currentDay = progressEntry?.current_day || 1;

          // Fallback to session storage for recent progress
          if (!progressEntry) {
            const userId = user?.id || 'anonymous';
            const sessionKey = `progress_${userId}_${plan.id}`;
            const sessionProgress = sessionStorage.getItem(sessionKey);
            if (sessionProgress) {
              try {
                const parsed = JSON.parse(sessionProgress);
                completedDays = parsed.completed_days || [];
                currentDay = parsed.current_day || 1;
              } catch (e) {
                console.log('Could not parse session progress for key:', sessionKey);
              }
            }
          }

          const progressPercent = Math.round((completedDays.length / 7) * 100);

          return {
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
            planData: plan.plan_data
          };
        });

        setHobbyPlans(processedPlans);
        console.log('📋 Total plans loaded:', processedPlans.length);

      } finally {
        sessionStorage.removeItem('dashboardLoading');
        sessionStorage.removeItem('dashboardLoadingTime');
      }

    } catch (error) {
      console.error('Error loading user plans:', error);
      setLoadingMessage('Error loading plans. Please refresh.');
      // Clear loading flags on error too
      sessionStorage.removeItem('dashboardLoading');
      sessionStorage.removeItem('dashboardLoadingTime');
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
    const planToDelete = hobbyPlans.find(p => p.id === planId);
    const hobby = planToDelete?.hobby;

    // Extract hobby from title if hobby field is missing
    const extractedHobby = hobby || planToDelete?.title?.match(/(?:Learn|Master)\s+(\w+)\s+in/i)?.[1];

    if (!extractedHobby) {
      alert('Cannot determine hobby type for this plan');
      return;
    }

    // Find ALL plans for this hobby (including title-based matching)
    const allHobbyPlans = hobbyPlans.filter(p => {
      const planHobby = p.hobby;
      if (planHobby && planHobby.toLowerCase() === extractedHobby.toLowerCase()) {
        return true;
      }

      // Also check title-based matching
      if (p.title) {
        const titleMatch = p.title.match(/(?:Learn|Master)\s+(\w+)\s+in/i);
        const titleHobby = titleMatch ? titleMatch[1].toLowerCase() : '';
        return titleHobby === extractedHobby.toLowerCase();
      }

      return false;
    });

    const duplicateCount = allHobbyPlans.length;

    let confirmMessage;
    let shouldDeleteAll = false;

    if (duplicateCount > 1) {
      confirmMessage = `Found ${duplicateCount} duplicate "${extractedHobby}" plans. Delete ALL ${duplicateCount} duplicates to clean up your dashboard?`;
      shouldDeleteAll = confirm(confirmMessage);

      if (!shouldDeleteAll) {
        // If user doesn't want to delete all, just delete the selected one
        if (!confirm(`Delete just this one "${extractedHobby}" plan?`)) {
          return;
        }
      }
    } else {
      if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
        return;
      }
    }

    setDeletingPlan(planId);

    try {
      if (shouldDeleteAll && duplicateCount > 1) {
        // Delete ALL plans for this hobby
        console.log(`🗑️ Batch deleting ${duplicateCount} plans for hobby:`, extractedHobby);

        // Immediately update UI to remove all plans
        setHobbyPlans(prev => prev.filter(p => !allHobbyPlans.some(deleted => deleted.id === p.id)));

        // Then delete from database in background
        for (const plan of allHobbyPlans) {
          try {
            await deleteSinglePlan(plan.id, extractedHobby);
            console.log('🗑️ Successfully deleted plan:', plan.id);
          } catch (error) {
            console.error('🗑️ Failed to delete plan:', plan.id, error);
          }
        }

      } else {
        // Delete just the selected plan
        // Immediately update UI
        setHobbyPlans(prev => prev.filter(p => p.id !== planId));

        // Then delete from database
        await deleteSinglePlan(planId, extractedHobby);
      }

      // Clear all caches to prevent reappearance
      sessionStorage.clear();

      // Clear specific cache keys
      ['dashboardLoading', 'dashboardLoadingTime', 'currentPlanData', 'activePlanData'].forEach(key => {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
      });

      console.log('✅ Plan(s) deleted and caches cleared');

    } catch (error: any) {
      console.error('Error in deletion:', error);

      // Clear all caches even on error to prevent stale data
      sessionStorage.clear();
      localStorage.clear();

      alert(`Failed to delete plan(s): ${error.message || 'Unknown error'}. Please try again.`);

      // Force reload on error to get fresh state
      setTimeout(() => {
        loadUserPlans();
      }, 1000);
    } finally {
      setDeletingPlan(null);
    }
  };

  const deleteSinglePlan = async (planId: string, hobby: string) => {
    try {
      console.log('🗑️ Deleting single plan:', planId, 'hobby:', hobby);

      const response = await fetch(`/api/hobby-plans/${planId}?user_id=${user?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache', // Explicitly try to prevent caching at the request level
          'Pragma': 'no-cache'        // For older HTTP versions
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API deletion failed: ${response.status} - ${errorText}`);
      }

      console.log('✅ Plan deleted successfully from database via API:', planId);

      // Clear ALL caches aggressively
      hobbyPlanService.clearHobbyCache(hobby, user?.id || '');

      // Clear additional session/local storage entries
      sessionStorage.clear();
      localStorage.removeItem('currentPlanData');
      localStorage.removeItem('activePlanData');
      localStorage.removeItem('lastViewedPlanData');
      localStorage.removeItem(`freshPlanMarker_${planId}`);
      localStorage.removeItem(`plan_${hobby}`);

      // Clear progress entries for this plan
      sessionStorage.removeItem(`progress_${user?.id}_${planId}`);

      console.log('🧹 All caches cleared for deleted plan');

    } catch (error: any) {
      console.error('❌ Error deleting plan:', error);
      throw error; // Re-throw for parent function to handle
    }
  };

  const getHobbyImage = (hobby: string): string => {
    const normalizedHobby = hobby?.toLowerCase() || '';

    const getImageByCategory = (hobbyName: string): string => {
      // Technology hobbies
      if (hobbyName.includes('cod') || hobbyName.includes('program') || hobbyName.includes('develop') || hobbyName.includes('tech')) {
        const techImages = [
          'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop',
          'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=240&fit=crop',
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=240&fit=crop'
        ];
        const hash = hobbyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return techImages[hash % techImages.length];
      }

      // Creative arts
      if (hobbyName.includes('art') || hobbyName.includes('draw') || hobbyName.includes('paint') || hobbyName.includes('photo')) {
        const creativeImages = [
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=240&fit=crop',
          'https://images.unsplash.com/photo-1541961017774-2034504a1262?w=400&h=240&fit=crop',
          'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=240&fit=crop'
        ];
        const hash = hobbyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return creativeImages[hash % creativeImages.length];
      }

      // Culinary
      if (hobbyName.includes('cook') || hobbyName.includes('bak') || hobbyName.includes('food')) {
        const culinaryImages = [
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=240&fit=crop',
          'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=240&fit=crop'
        ];
        const hash = hobbyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return culinaryImages[hash % culinaryImages.length];
      }

      // Fitness
      if (hobbyName.includes('fitness') || hobbyName.includes('yoga') || hobbyName.includes('dance')) {
        const fitnessImages = [
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=240&fit=crop',
          'https://images.unsplash.com/photo-1571019613540-996a69c42d3f?w=400&h=240&fit=crop'
        ];
        const hash = hobbyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return fitnessImages[hash % fitnessImages.length];
      }

      // Default learning
      const learningImages = [
        'https://images.unsplash.com/photo-1481627834876-dccba630e2f6?w=400&h=240&fit=crop',
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=240&fit=crop'
      ];
      const hash = hobbyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return learningImages[hash % learningImages.length];
    };

    const selectedImage = getImageByCategory(normalizedHobby);
    const timestamp = Math.floor(Date.now() / (1000 * 60 * 60));
    return `${selectedImage}&t=${timestamp}`;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <UnifiedNavigation currentPage="dashboard" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">📚</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Welcome to Your Dashboard</h2>
            <p className="text-gray-600 mb-6">Sign in to view your hobby learning progress and continue your 7-day journeys.</p>
            <Button 
              onClick={() => window.location.hash = '#/login'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Sign In to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <UnifiedNavigation currentPage="dashboard" />
        <main className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
          {/* Loading Header */}
          <header className="mb-6 sm:mb-8">
            <div className="text-center sm:text-left">
              <Skeleton className="h-8 sm:h-10 w-64 mx-auto sm:mx-0 mb-3" />
              <Skeleton className="h-4 w-80 mx-auto sm:mx-0" />
            </div>
          </header>

          {/* Loading Stats */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="shadow-md">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                    <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                    <div className="text-center sm:text-left">
                      <Skeleton className="h-6 w-8 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Loading Message */}
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-3 bg-white rounded-lg px-6 py-4 shadow-sm">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-gray-700 font-medium">{loadingMessage}</span>
            </div>
          </div>

          {/* Loading Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden shadow-md">
                <Skeleton className="h-40 sm:h-48 w-full" />
                <CardContent className="p-4 sm:p-6">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-2 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-6" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      {/* SEO Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Personal Learning Dashboard - Wizqo",
          "description": "Track your personalized 7-day hobby learning plans and celebrate achievements. Monitor progress across multiple skills and hobbies.",
          "url": "https://wizqo.com/dashboard",
          "mainEntity": {
            "@type": "Course",
            "name": "7-Day Hobby Learning Plans",
            "description": "Personalized learning journeys for various hobbies including cooking, guitar, yoga, photography, and more.",
            "provider": {
              "@type": "Organization",
              "name": "Wizqo",
              "url": "https://wizqo.com"
            }
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://wizqo.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Dashboard",
                "item": "https://wizqo.com/dashboard"
              }
            ]
          }
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
        <UnifiedNavigation currentPage="dashboard" />

        <main className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl" role="main">
          {/* SEO Optimized Header */}
          <header className="mb-6 sm:mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                My Learning Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto sm:mx-0">
                Track your progress across all your hobby learning journeys. Complete 7-day challenges and celebrate your achievements.
              </p>
            </div>
          </header>

          {/* Mobile-Optimized Stats Cards */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8" aria-label="Learning Statistics">
            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-full flex items-center justify-center">
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {hobbyPlans.filter(p => p.status === 'in_progress').length}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Active Plans</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {hobbyPlans.filter(p => p.status === 'completed').length}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {hobbyPlans.reduce((acc, plan) => acc + plan.currentDay, 0)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Days Learned</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800 dark:to-orange-700 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600 dark:text-orange-300" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(hobbyPlans.reduce((acc, plan) => acc + plan.progress, 0) / hobbyPlans.length) || 0}%
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Avg Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Duplicate Cleanup Section */}
          {hobbyPlans.length > 0 && (() => {
            const hobbyGroups = hobbyPlans.reduce((acc, plan) => {
              const hobby = plan.hobby || plan.title?.match(/(?:Learn|Master)\s+(\w+)\s+in/i)?.[1] || 'unknown';
              acc[hobby] = (acc[hobby] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            const duplicates = Object.entries(hobbyGroups).filter(([_, count]) => count > 1);

            if (duplicates.length > 0) {
              return (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Duplicate Plans Detected
                  </h3>
                  <p className="text-yellow-700 mb-3">
                    You have duplicate plans: {duplicates.map(([hobby, count]) => `${count} ${hobby} plans`).join(', ')}
                  </p>
                  <Button
                    onClick={async () => {
                      if (confirm('This will delete all duplicate plans, keeping only the most recent one for each hobby. Continue?')) {
                        for (const [hobby, count] of duplicates) {
                          const plansForHobby = hobbyPlans.filter(p => 
                            (p.hobby || p.title?.match(/(?:Learn|Master)\s+(\w+)\s+in/i)?.[1]) === hobby
                          ).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

                          // Keep the first (most recent), delete the rest
                          for (let i = 1; i < plansForHobby.length; i++) {
                            try {
                              await deleteSinglePlan(plansForHobby[i].id, hobby);
                            } catch (error) {
                              console.error('Error cleaning duplicate:', error);
                            }
                          }
                        }
                        loadUserPlans(); // Refresh the list
                      }
                    }}
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  >
                    Clean Up Duplicates
                  </Button>
                </div>
              );
            }
            return null;
          })()}

          {/* Hobby Plans Grid or Empty State */}
          {hobbyPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">No Learning Plans Yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">Start your first 7-day hobby learning journey today! Choose from photography, cooking, guitar, yoga, and many more.</p>
              <Button 
                onClick={() => window.location.hash = '#/generate'} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
              >
                Create Your First Plan
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {hobbyPlans.map((plan) => (
                <Card key={plan.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white dark:bg-gray-800 mobile-card">
                  {/* Plan Image */}
                  <div className="relative h-40 sm:h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                    <img 
                      src={getHobbyImage(plan.hobby)} 
                      alt={`${plan.title} - Learn ${plan.hobby} in 7 days`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />

                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                      <Badge className={`${getStatusColor(plan.status)} text-white text-xs sm:text-sm font-medium`}>
                        {getStatusText(plan.status)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 sm:p-6">
                    {/* Plan Title */}
                    <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-white line-clamp-2">{plan.title}</h3>

                    {/* Category and Duration */}
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <span className="font-medium">{plan.category}</span>
                      <span className="mx-2">•</span>
                      <span>{plan.totalDays} days</span>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">Progress</span>
                        <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">{plan.progress}%</span>
                      </div>
                      <Progress value={plan.progress} className="h-2 bg-gray-200 dark:bg-gray-700" />
                    </div>

                    {/* Dates and Actions */}
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-6">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span>Started {format(new Date(plan.startDate), 'MMM d, yyyy')}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePlan(plan.id)}
                        disabled={deletingPlan === plan.id}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-auto mobile-button"
                        aria-label={`Delete ${plan.title}`}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>

                    {/* Social Sharing for Completed Plans */}
                    {plan.status === 'completed' && (
                      <div className="mb-4">
                        <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-0.5 rounded-lg">
                          <div className="bg-white dark:bg-gray-800 rounded-[6px] p-3 overflow-hidden">
                            <div className="flex items-center justify-center space-x-2 mb-3">
                              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                              <span className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400">
                                Challenge Completed! 🎉
                              </span>
                            </div>
                            <Button
                              size="sm"
                              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm py-2 px-4 flex items-center justify-center min-h-[44px] font-medium mobile-button"
                              onClick={() => openShareModal(plan)}
                              aria-label={`Share ${plan.title} achievement`}
                            >
                              <Share2 className="h-4 w-4 mr-2 flex-shrink-0" />
                              Share Achievement
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button 
                      onClick={() => {
                        if (plan.planData) {
                          sessionStorage.setItem('currentPlanData', JSON.stringify(plan.planData));
                        }
                        window.location.hash = '#/plan';
                      }}
                      className="w-full text-sm sm:text-base py-2 sm:py-3 mobile-button" 
                      variant={plan.status === 'completed' ? 'outline' : 'default'}
                      aria-label={plan.status === 'completed' ? `View ${plan.title}` : `Continue learning ${plan.title}`}
                    >
                      {plan.status === 'completed' ? 'View Plan' : 'Continue Learning'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Share Achievement Modal */}
          {showShareModal && shareData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Share Your Achievement
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowShareModal(false)}
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Close share modal"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-0.5 rounded-lg mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-[6px] p-4 text-center">
                    <img 
                      src={shareData.image} 
                      alt={shareData.plan.hobby}
                      className="w-16 h-16 mx-auto rounded-full mb-3 object-cover"
                      loading="lazy"
                    />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {shareData.plan.hobby} Challenge Complete! 🎉
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      7 days • {shareData.plan.totalDays} lessons completed
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Share on social media:
                  </h4>

                  {/* Social Media Buttons */}
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white justify-start h-12 mobile-button"
                    onClick={() => {
                      window.open(shareData.platforms.twitter, '_blank');
                      setShowShareModal(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <Share2 className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Twitter</div>
                        <div className="text-xs opacity-90">Share with your followers</div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white justify-start h-12 mobile-button"
                    onClick={() => {
                      window.open(shareData.platforms.facebook, '_blank');
                      setShowShareModal(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <ExternalLink className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Facebook</div>
                        <div className="text-xs opacity-90">Post to your timeline</div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white justify-start h-12 mobile-button"
                    onClick={() => {
                      window.open(shareData.platforms.whatsapp, '_blank');
                      setShowShareModal(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <Share2 className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">WhatsApp</div>
                        <div className="text-xs opacity-90">Send to friends</div>
                      </div>
                    </div>
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 h-10 mobile-button"
                  onClick={() => setShowShareModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Copy Success Toast */}
          {showCopyToast && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right duration-300">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Copied to clipboard!</span>
              </div>
              <div className="text-xs mt-1 opacity-90">Open Instagram and paste it in your story</div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}