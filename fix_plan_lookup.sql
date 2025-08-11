
-- Ensure hobby field exists for better plan matching
ALTER TABLE public.hobby_plans 
ADD COLUMN IF NOT EXISTS hobby TEXT;

-- Update existing records to use hobby field
UPDATE public.hobby_plans 
SET hobby = hobby_name 
WHERE hobby IS NULL AND hobby_name IS NOT NULL;

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_hobby_plans_hobby ON public.hobby_plans(hobby);
CREATE INDEX IF NOT EXISTS idx_hobby_plans_user_hobby ON public.hobby_plans(user_id, hobby);

-- Verify the fix
SELECT id, user_id, hobby, hobby_name, title 
FROM public.hobby_plans 
WHERE user_id = '773c3f18-025a-432d-ae3d-fa13be3faef8'
LIMIT 5;

