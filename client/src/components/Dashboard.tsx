import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Play, MoreHorizontal, Trash2, Share2, Trophy, ExternalLink, X } from "lucide-react";
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState<any>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  
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
    
    // Create simple text-only sharing URLs that prioritize the message
    const platforms = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://wizqo.com')}&quote=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://wizqo.com')}&title=${encodeURIComponent('🎉 Completed 7-Day ' + plan.hobby.toUpperCase() + ' Challenge!')}&summary=${encodeURIComponent(shareText)}`,
      instagram: shareText, // Copy to clipboard for Instagram
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
    const normalizedHobby = hobby?.toLowerCase() || '';
    console.log(`🎨 Dashboard getHobbyImage called with: "${hobby}" -> normalized: "${normalizedHobby}"`);
    
    // Comprehensive hobby-specific image mapping
    const getImageByHobby = (hobbyName: string): string => {
      // First check for exact hobby matches with unique images
      const specificHobbies: Record<string, string> = {
        // Music - Each instrument gets unique image
        'guitar': 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=240&fit=crop',
        'piano': 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=240&fit=crop',
        'drums': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=240&fit=crop',
        'violin': 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=240&fit=crop',
        'singing': 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=400&h=240&fit=crop',
        'ukulele': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=240&fit=crop',
        
        // Arts & Crafts - Each craft gets unique image
        'drawing': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=240&fit=crop',
        'painting': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=240&fit=crop',
        'pottery': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=240&fit=crop',
        'sculpture': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=240&fit=crop',
        'woodworking': 'https://images.unsplash.com/photo-1609890518597-2c13b5a5e5e5?w=400&h=240&fit=crop',
        'jewelry': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=240&fit=crop',
        'jewelry making': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=240&fit=crop',
        'knitting': 'https://images.unsplash.com/photo-1559622214-2d1b21d5ab7e?w=400&h=240&fit=crop',
        'crochet': 'https://images.unsplash.com/photo-1559622214-2d1b21d5ab7e?w=400&h=240&fit=crop',
        'embroidery': 'https://images.unsplash.com/photo-1559622214-2d1b21d5ab7e?w=400&h=240&fit=crop',
        'calligraphy': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=240&fit=crop',
        'origami': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=240&fit=crop',
        
        // Cooking & Food - Each type gets unique image
        'cooking': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=240&fit=crop',
        'baking': 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=240&fit=crop',
        'cake decorating': 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=240&fit=crop',
        'grilling': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=240&fit=crop',
        
        // Technology - Each field gets unique image
        'coding': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop',
        'programming': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop',
        'app development': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=240&fit=crop',
        'web development': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop',
        'game development': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=240&fit=crop',
        'video editing': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=240&fit=crop',
        
        // Fitness & Wellness - Each practice gets unique image
        'yoga': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=240&fit=crop',
        'meditation': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop',
        'pilates': 'https://images.unsplash.com/photo-1571019613540-996a69c42d3f?w=400&h=240&fit=crop',
        'running': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=240&fit=crop',
        
        // Sports & Outdoor - Each activity gets unique image
        'cycling': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=240&fit=crop',
        'swimming': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=240&fit=crop',
        'hiking': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=240&fit=crop',
        'camping': 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=240&fit=crop',
        'climbing': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop',
        
        // Reading & Learning - Each type gets unique image
        'reading': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=240&fit=crop',
        'writing': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=240&fit=crop',
        'research': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=240&fit=crop',
        'history': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=240&fit=crop',
        'quran reading': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=240&fit=crop',
        'language learning': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=240&fit=crop',
        
        // Games & Strategy - Each game gets unique image
        'chess': 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=240&fit=crop',
        'poker': 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=400&h=240&fit=crop',
        'board games': 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=240&fit=crop',
        
        // Dance & Movement - Each style gets unique image
        'dance': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=240&fit=crop',
        'ballet': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=240&fit=crop',
        
        // Photography & Visual - Each medium gets unique image
        'photography': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=240&fit=crop',
        'videography': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=240&fit=crop',
        'film': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=240&fit=crop',
        
        // Gardening & Nature - Each type gets unique image
        'gardening': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=240&fit=crop',
        'plants': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=240&fit=crop',
        'flowers': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=240&fit=crop'
      };
      
      // Check for exact match first
      if (specificHobbies[hobbyName]) {
        console.log(`🎨 Dashboard EXACT HOBBY MATCH: "${hobbyName}" -> specific image`);
        return specificHobbies[hobbyName];
      }
      
      // Check for partial matches (e.g., "app development" contains "app")
      for (const [hobbyKey, image] of Object.entries(specificHobbies)) {
        if (hobbyName.includes(hobbyKey) || hobbyKey.includes(hobbyName)) {
          console.log(`🎨 Dashboard PARTIAL HOBBY MATCH: "${hobbyName}" matches "${hobbyKey}"`);
          return image;
        }
      }
      
      // Fallback to category-based matching
      const categories = {
        music: ['guitar', 'piano', 'drums', 'violin', 'singing', 'ukulele', 'bass', 'flute', 'saxophone', 'trumpet'],
        musicImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=240&fit=crop',
        
        arts: ['drawing', 'painting', 'pottery', 'sculpture', 'calligraphy', 'origami', 'embroidery', 'knitting', 'jewelry', 'woodworking', 'crochet', 'sewing', 'quilting', 'crafts'],
        artsImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=240&fit=crop',
        
        cooking: ['cooking', 'baking', 'cake decorating', 'pastry', 'grilling', 'wine', 'cocktail', 'bread'],
        cookingImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=240&fit=crop',
        
        tech: ['coding', 'programming', 'app development', 'web development', 'software', 'javascript', 'python', 'ai'],
        techImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop',
        
        fitness: ['yoga', 'meditation', 'pilates', 'running', 'weightlifting', 'crossfit', 'stretching'],
        fitnessImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=240&fit=crop',
        
        sports: ['cycling', 'swimming', 'hiking', 'camping', 'climbing', 'surfing', 'skiing', 'basketball', 'soccer'],
        sportsImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=240&fit=crop',
        
        learning: ['reading', 'writing', 'research', 'history', 'language', 'studying', 'books'],
        learningImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=240&fit=crop',
        
        games: ['chess', 'poker', 'board games', 'puzzles', 'sudoku'],
        gamesImage: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=240&fit=crop',
        
        dance: ['dance', 'ballet', 'salsa', 'hip hop', 'ballroom'],
        danceImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=240&fit=crop',
        
        visual: ['photography', 'videography', 'film', 'photo editing'],
        visualImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=240&fit=crop',
        
        nature: ['gardening', 'plants', 'flowers', 'herbs', 'vegetables'],
        natureImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=240&fit=crop'
      };
      
      // Check each category for keyword matches
      for (const category of Object.keys(categories)) {
        if (category.endsWith('Image')) continue;
        
        const keywords = categories[category as keyof typeof categories] as string[];
        const imageKey = `${category}Image` as keyof typeof categories;
        
        for (const keyword of keywords) {
          if (hobbyName.includes(keyword) || keyword.includes(hobbyName)) {
            console.log(`🎨 Dashboard CATEGORY MATCH: "${hobbyName}" matches category "${category}" via keyword "${keyword}"`);
            return categories[imageKey] as string;
          }
        }
      }
      
      console.log(`🎨 Dashboard NO MATCH for "${hobbyName}", using creative fallback`);
      // Creative fallback - use a general learning/creativity image
      return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=240&fit=crop';
    };
    
    const baseImage = getImageByHobby(normalizedHobby);
    const finalImage = `${baseImage}&t=${Date.now()}`;
    console.log(`🎨 Dashboard FINAL IMAGE: ${finalImage}`);
    return finalImage;
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
    <>
      {/* SEO Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Personal Learning Dashboard",
          "description": "Track your personalized 7-day hobby learning plans and celebrate achievements",
          "url": "https://wizqo.com/dashboard",
          "mainEntity": {
            "@type": "Course",
            "name": "7-Day Hobby Learning Plans",
            "description": "Personalized learning journeys for various hobbies"
          }
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
        <UnifiedNavigation currentPage="dashboard" />

        <main className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl" role="main">
        {/* SEO Header */}
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
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600 dark:text-orange-300" />
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

          {/* Hobby Plans Grid */}
          {hobbyPlans.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">No Learning Plans Yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Start your first 7-day hobby learning journey today!</p>
              <Button onClick={() => window.location.hash = '#/generate'} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Create Your First Plan
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {hobbyPlans.map((plan) => (
                <Card key={plan.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white dark:bg-gray-800">
                  {/* Plan Image */}
                  <div className="relative h-40 sm:h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                    <img 
                      src={getHobbyImage(plan.hobby)} 
                      alt={plan.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to gradient background if image fails
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

                    {/* Dates - only show start date */}
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
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-auto"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>

                    {/* Social Sharing Button for Completed Plans */}
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
                              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm py-2 px-4 flex items-center justify-center min-h-[44px] font-medium"
                              onClick={() => openShareModal(plan)}
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
                        // Store plan data for navigation
                        if (plan.planData) {
                          sessionStorage.setItem('currentPlanData', JSON.stringify(plan.planData));
                        }
                        window.location.hash = '#/plan';
                      }}
                      className="w-full text-sm sm:text-base py-2 sm:py-3" 
                      variant={plan.status === 'completed' ? 'outline' : 'default'}
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
            {/* Modal Header */}
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
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Achievement Preview */}
            <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-0.5 rounded-lg mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-[6px] p-4 text-center">
                <img 
                  src={shareData.image} 
                  alt={shareData.plan.hobby}
                  className="w-16 h-16 mx-auto rounded-full mb-3 object-cover"
                />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {shareData.plan.hobby} Challenge Complete! 🎉
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  7 days • {shareData.plan.totalDays} lessons completed
                </p>
              </div>
            </div>

            {/* Social Media Buttons */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Share on social media:
              </h4>
              
              {/* Twitter */}
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white justify-start h-12"
                onClick={() => {
                  // Force Twitter to use the text by opening with proper encoding
                  const twitterText = `🎉 I just completed my 7-day ${shareData.plan.hobby.toUpperCase()} learning journey!

✅ Mastered ${shareData.plan.hobby} fundamentals in just 7 days
📚 Completed all 7 daily lessons
🚀 Ready for the next challenge!

#7DayChallenge #Learning #${shareData.plan.hobby.charAt(0).toUpperCase() + shareData.plan.hobby.slice(1)} #PersonalGrowth #Wizqo

Learn any hobby in 7 days at https://wizqo.com`;
                  
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`, '_blank');
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

              {/* Facebook */}
              <Button
                className="w-full bg-blue-700 hover:bg-blue-800 text-white justify-start h-12"
                onClick={() => {
                  const achievementText = `🎉 I just completed my 7-day ${shareData.plan.hobby.toUpperCase()} learning journey! ✅ Mastered ${shareData.plan.hobby} fundamentals in just 7 days 📚 Completed all 7 daily lessons 🚀 Ready for the next challenge! #7DayChallenge #Learning #${shareData.plan.hobby.charAt(0).toUpperCase() + shareData.plan.hobby.slice(1)} #PersonalGrowth #Wizqo Learn any hobby in 7 days at https://wizqo.com`;
                  
                  // Try native Web Share API first, fallback to Facebook sharing
                  if (navigator.share) {
                    navigator.share({
                      title: `🎉 Completed 7-Day ${shareData.plan.hobby.toUpperCase()} Challenge!`,
                      text: achievementText,
                      url: 'https://wizqo.com'
                    }).catch(() => {
                      // Fallback to Facebook URL
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://wizqo.com')}&t=${encodeURIComponent(achievementText)}`, '_blank', 'width=600,height=400');
                    });
                  } else {
                    // Direct Facebook sharing without quote parameter (often ignored)
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://wizqo.com')}&t=${encodeURIComponent(achievementText)}`, '_blank', 'width=600,height=400');
                  }
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

              {/* LinkedIn */}
              <Button
                className="w-full bg-blue-800 hover:bg-blue-900 text-white justify-start h-12"
                onClick={() => {
                  const achievementText = `🎉 I just completed my 7-day ${shareData.plan.hobby.toUpperCase()} learning journey! ✅ Mastered ${shareData.plan.hobby} fundamentals in just 7 days 📚 Completed all 7 daily lessons 🚀 Ready for the next challenge! #7DayChallenge #Learning #${shareData.plan.hobby.charAt(0).toUpperCase() + shareData.plan.hobby.slice(1)} #PersonalGrowth #Wizqo Learn any hobby in 7 days at https://wizqo.com`;
                  
                  // Try native Web Share API first
                  if (navigator.share) {
                    navigator.share({
                      title: `🎉 Completed 7-Day ${shareData.plan.hobby.toUpperCase()} Challenge!`,
                      text: achievementText,
                      url: 'https://wizqo.com'
                    }).catch(() => {
                      // Fallback: open LinkedIn and copy text
                      window.open('https://www.linkedin.com/feed/', '_blank');
                      navigator.clipboard.writeText(achievementText);
                      alert('LinkedIn opened! The achievement text has been copied to your clipboard - paste it in your new post.');
                    });
                  } else {
                    // Fallback: open LinkedIn and copy text
                    window.open('https://www.linkedin.com/feed/', '_blank');
                    navigator.clipboard.writeText(achievementText);
                    alert('LinkedIn opened! The achievement text has been copied to your clipboard - paste it in your new post.');
                  }
                  setShowShareModal(false);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Share2 className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">LinkedIn</div>
                    <div className="text-xs opacity-90">Share with professionals</div>
                  </div>
                </div>
              </Button>

              {/* Instagram */}
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white justify-start h-12"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareData.platforms.instagram);
                    setShowCopyToast(true);
                    setTimeout(() => setShowCopyToast(false), 3000);
                  } catch (err) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = shareData.platforms.instagram;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    setShowCopyToast(true);
                    setTimeout(() => setShowCopyToast(false), 3000);
                  }
                  setShowShareModal(false);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Share2 className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Instagram</div>
                    <div className="text-xs opacity-90">Copy text to share</div>
                  </div>
                </div>
              </Button>

              {/* WhatsApp */}
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white justify-start h-12"
                onClick={() => {
                  const whatsappText = `🎉 I just completed my 7-day ${shareData.plan.hobby.toUpperCase()} learning journey!

✅ Mastered ${shareData.plan.hobby} fundamentals in just 7 days
📚 Completed all 7 daily lessons
🚀 Ready for the next challenge!

#7DayChallenge #Learning #${shareData.plan.hobby.charAt(0).toUpperCase() + shareData.plan.hobby.slice(1)} #PersonalGrowth #Wizqo

Learn any hobby in 7 days at https://wizqo.com`;
                  
                  window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank');
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

            {/* Cancel Button */}
            <Button
              variant="outline"
              className="w-full mt-4 h-10"
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