import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

export function usePlanStorage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const savePlan = async (planData: any) => {
    if (!user) {
      // Save to localStorage for non-authenticated users
      const savedPlans = JSON.parse(localStorage.getItem('savedPlans') || '[]')
      savedPlans.push({
        id: Date.now().toString(),
        ...planData,
        created_at: new Date().toISOString()
      })
      localStorage.setItem('savedPlans', JSON.stringify(savedPlans))
      
      toast({
        title: "Plan saved locally",
        description: "Sign in to sync your plans across devices",
      })
      return
    }

    setSaving(true)
    try {
      // Save plan to Supabase
      const { data, error } = await supabase
        .from('hobby_plans')
        .insert({
          user_id: user.id,
          hobby: planData.hobby,
          title: planData.title,
          overview: planData.overview,
          plan_data: planData
        })
        .select()

      if (error) throw error

      // Create initial progress record
      if (data?.[0]) {
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            plan_id: data[0].id,
            completed_days: [],
            current_day: 1,
            unlocked_days: [1]
          })
      }

      toast({
        title: "Plan saved!",
        description: "Your hobby plan has been saved to your dashboard.",
      })
    } catch (error: any) {
      console.error('Error saving plan:', error)
      toast({
        title: "Error",
        description: "Failed to save plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateProgress = async (planId: string, dayNumber: number, completed: boolean) => {
    if (!user) return

    try {
      const { data: progress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('plan_id', planId)
        .eq('user_id', user.id)
        .single()

      if (fetchError) throw fetchError

      let completedDays = [...progress.completed_days]
      let unlockedDays = [...progress.unlocked_days]

      if (completed && !completedDays.includes(dayNumber)) {
        completedDays.push(dayNumber)
        // Unlock next day if not already unlocked
        if (!unlockedDays.includes(dayNumber + 1) && dayNumber < 7) {
          unlockedDays.push(dayNumber + 1)
        }
      } else if (!completed) {
        completedDays = completedDays.filter(day => day !== dayNumber)
      }

      const { error: updateError } = await supabase
        .from('user_progress')
        .update({
          completed_days: completedDays,
          current_day: Math.max(1, Math.min(...unlockedDays.filter(day => !completedDays.includes(day)))),
          unlocked_days: unlockedDays,
          last_accessed_at: new Date().toISOString()
        })
        .eq('id', progress.id)

      if (updateError) throw updateError

      toast({
        title: completed ? "Day completed!" : "Progress updated",
        description: completed ? `Great job completing day ${dayNumber}!` : "Your progress has been updated.",
      })
    } catch (error: any) {
      console.error('Error updating progress:', error)
      toast({
        title: "Error",
        description: "Failed to update progress.",
        variant: "destructive",
      })
    }
  }

  return {
    savePlan,
    updateProgress,
    saving
  }
}