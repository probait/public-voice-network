
-- Drop all RLS policies on the prompts table
DROP POLICY IF EXISTS "Anyone can view active prompts" ON public.prompts;
DROP POLICY IF EXISTS "Authenticated users can manage prompts" ON public.prompts;

-- Drop the prompts table completely
DROP TABLE IF EXISTS public.prompts CASCADE;
