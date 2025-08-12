
-- Fix missing 'hobby' column in hobby_plans table
ALTER TABLE public.hobby_plans 
ADD COLUMN IF NOT EXISTS hobby TEXT;

-- Update existing records to populate hobby field from hobby_name
UPDATE public.hobby_plans 
SET hobby = hobby_name 
WHERE hobby IS NULL AND hobby_name IS NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_hobby_plans_hobby ON public.hobby_plans(hobby);

-- Verify the fix worked
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'hobby_plans' 
AND table_schema = 'public'
ORDER BY ordinal_position;
