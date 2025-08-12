
-- Fix Supabase schema to match your application
ALTER TABLE public.hobby_plans 
ADD COLUMN IF NOT EXISTS hobby TEXT;

-- Update existing records if needed
UPDATE public.hobby_plans 
SET hobby = hobby_name 
WHERE hobby IS NULL AND hobby_name IS NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_hobby_plans_hobby ON public.hobby_plans(hobby);

