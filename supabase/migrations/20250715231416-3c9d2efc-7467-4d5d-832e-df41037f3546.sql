-- Add RLS policy to allow public read access to featured thoughts submissions
CREATE POLICY "Anyone can view featured thoughts submissions" 
ON public.thoughts_submissions 
FOR SELECT 
USING (featured = true);