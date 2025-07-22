
-- Comprehensive RLS Policy Security Fixes
-- Phase 1: Fix Meetups Table - Filter by is_published for public access
DROP POLICY IF EXISTS "Anyone can view meetups" ON public.meetups;
CREATE POLICY "Public can view published meetups" 
ON public.meetups 
FOR SELECT 
USING (is_published = true);

-- Phase 2: Secure Fellows Table - Admin-only access
DROP POLICY IF EXISTS "Anyone can view fellows" ON public.fellows;
DROP POLICY IF EXISTS "Admins and employees with contributors access can manage" ON public.fellows;
CREATE POLICY "Only admins can manage fellows" 
ON public.fellows 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Phase 3: Secure Partnerships Table - Remove public access
DROP POLICY IF EXISTS "Anyone can view partnerships" ON public.partnerships;
-- Keep the existing admin/employee policy for partnerships section access

-- Phase 4: Clean up Contributors Table - Remove duplicate policies
DROP POLICY IF EXISTS "Admins can manage all contributors" ON public.contributors;
-- Keep the section-based policy and published visibility policy

-- Phase 5: Clean up Thoughts Submissions - Remove duplicate policy
DROP POLICY IF EXISTS "Anyone can view featured thoughts submissions" ON public.thoughts_submissions;
-- Keep the combined policy that handles both admin/employee access and featured visibility
