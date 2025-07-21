
-- Create a function to get the total count of thoughts submissions
-- This function bypasses RLS and is accessible to everyone
CREATE OR REPLACE FUNCTION public.get_total_thoughts_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COUNT(*) FROM public.thoughts_submissions;
$$;

-- Grant execute permission to anonymous users so the count is publicly accessible
GRANT EXECUTE ON FUNCTION public.get_total_thoughts_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_total_thoughts_count() TO authenticated;
