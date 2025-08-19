-- Phase 1: Security Hardening for thoughts_submissions table

-- Step 1: Drop the current permissive policy that allows public access
DROP POLICY IF EXISTS "Admins and employees with thoughts access can view" ON public.thoughts_submissions;

-- Step 2: Revoke all base table access from anon and authenticated roles
REVOKE ALL ON public.thoughts_submissions FROM anon, authenticated;

-- Step 3: Create restrictive RLS policies with explicit role targeting

-- Policy for admins and employees with thoughts access to view all fields
CREATE POLICY "Admins and employees with thoughts access can view all fields"
ON public.thoughts_submissions
FOR SELECT
TO authenticated
USING (is_admin_or_has_section(auth.uid(), 'thoughts'::text));

-- Policy for admins and employees with thoughts access to update
CREATE POLICY "Admins and employees with thoughts access can update"
ON public.thoughts_submissions
FOR UPDATE
TO authenticated
USING (is_admin_or_has_section(auth.uid(), 'thoughts'::text));

-- Policy for admins and employees with thoughts access to delete
CREATE POLICY "Admins and employees with thoughts access can delete"
ON public.thoughts_submissions
FOR DELETE
TO authenticated
USING (is_admin_or_has_section(auth.uid(), 'thoughts'::text));

-- Policy to allow anyone to submit thoughts (but not set featured = true)
CREATE POLICY "Anyone can submit thoughts"
ON public.thoughts_submissions
FOR INSERT
TO authenticated, anon
WITH CHECK (featured = false);

-- Step 4: Protect the featured flag - prevent users from setting featured = true
CREATE POLICY "Only admins can set featured flag"
ON public.thoughts_submissions
FOR UPDATE
TO authenticated
USING (is_admin_or_has_section(auth.uid(), 'thoughts'::text))
WITH CHECK (
  CASE 
    WHEN is_admin_or_has_section(auth.uid(), 'thoughts'::text) THEN true
    ELSE NEW.featured = OLD.featured -- Don't allow changing featured flag
  END
);

-- Step 5: Create safe public view exposing only safe columns (excluding email)
CREATE OR REPLACE VIEW public.featured_thoughts_safe AS
SELECT 
  id,
  name,
  province,
  category,
  subject,
  message,
  created_at
FROM public.thoughts_submissions
WHERE featured = true
ORDER BY created_at DESC;

-- Grant select access to the view for anon and authenticated
GRANT SELECT ON public.featured_thoughts_safe TO anon, authenticated;

-- Step 6: Create hardened security definer function with pagination
CREATE OR REPLACE FUNCTION public.get_featured_thoughts_safe(
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  name text,
  province text,
  category text,
  subject text,
  message text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
  SELECT 
    t.id,
    t.name,
    t.province,
    t.category,
    t.subject,
    t.message,
    t.created_at
  FROM public.thoughts_submissions AS t
  WHERE t.featured = true
  ORDER BY t.created_at DESC
  LIMIT GREATEST(COALESCE(p_limit, 50), 0)
  OFFSET GREATEST(COALESCE(p_offset, 0), 0);
$$;

-- Grant execute access to the function
GRANT EXECUTE ON FUNCTION public.get_featured_thoughts_safe(int, int) TO anon, authenticated;

-- Step 7: Drop the old insecure function if it exists
DROP FUNCTION IF EXISTS public.get_featured_thoughts_public();