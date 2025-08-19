-- Fix RLS policies for thoughts_submissions table to use 'public' role like other working policies
-- This matches the pattern used by profiles and other working tables

DROP POLICY IF EXISTS "Admins and employees with thoughts access can view all fields" ON public.thoughts_submissions;
DROP POLICY IF EXISTS "Admins and employees with thoughts access can update all" ON public.thoughts_submissions;
DROP POLICY IF EXISTS "Admins and employees with thoughts access can delete all" ON public.thoughts_submissions;

-- Recreate policies using 'public' role instead of 'authenticated'
CREATE POLICY "Admins and employees with thoughts access can view all fields" 
ON public.thoughts_submissions 
FOR SELECT 
TO public
USING (is_admin_or_has_section(auth.uid(), 'thoughts'::text));

CREATE POLICY "Admins and employees with thoughts access can update all" 
ON public.thoughts_submissions 
FOR UPDATE 
TO public
USING (is_admin_or_has_section(auth.uid(), 'thoughts'::text));

CREATE POLICY "Admins and employees with thoughts access can delete all" 
ON public.thoughts_submissions 
FOR DELETE 
TO public
USING (is_admin_or_has_section(auth.uid(), 'thoughts'::text));