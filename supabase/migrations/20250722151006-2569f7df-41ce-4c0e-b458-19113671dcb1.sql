
-- Phase 2: Update RLS Policies to Support Section-Based Permissions

-- Update Articles table policies
DROP POLICY IF EXISTS "Authenticated users can manage articles" ON public.articles;
CREATE POLICY "Admins and employees with articles access can manage" 
ON public.articles 
FOR ALL 
USING (public.is_admin_or_has_section(auth.uid(), 'articles'));

-- Update Contributors table policies  
DROP POLICY IF EXISTS "Authenticated users can manage contributors" ON public.contributors;
CREATE POLICY "Admins and employees with contributors access can manage" 
ON public.contributors 
FOR ALL 
USING (public.is_admin_or_has_section(auth.uid(), 'contributors'));

-- Update Meetups/Events table policies
DROP POLICY IF EXISTS "Only admins can create meetups" ON public.meetups;
DROP POLICY IF EXISTS "Only admins can update meetups" ON public.meetups;
DROP POLICY IF EXISTS "Only admins can delete meetups" ON public.meetups;

CREATE POLICY "Admins and employees with events access can create" 
ON public.meetups 
FOR INSERT 
WITH CHECK (public.is_admin_or_has_section(auth.uid(), 'events'));

CREATE POLICY "Admins and employees with events access can update" 
ON public.meetups 
FOR UPDATE 
USING (public.is_admin_or_has_section(auth.uid(), 'events'));

CREATE POLICY "Admins and employees with events access can delete" 
ON public.meetups 
FOR DELETE 
USING (public.is_admin_or_has_section(auth.uid(), 'events'));

-- Update Thoughts Submissions table policies
DROP POLICY IF EXISTS "Admins can view all thoughts submissions" ON public.thoughts_submissions;
DROP POLICY IF EXISTS "Admins can update thoughts submissions" ON public.thoughts_submissions;
DROP POLICY IF EXISTS "Admins can delete thoughts submissions" ON public.thoughts_submissions;

CREATE POLICY "Admins and employees with thoughts access can view" 
ON public.thoughts_submissions 
FOR SELECT 
USING (public.is_admin_or_has_section(auth.uid(), 'thoughts') OR featured = true);

CREATE POLICY "Admins and employees with thoughts access can update" 
ON public.thoughts_submissions 
FOR UPDATE 
USING (public.is_admin_or_has_section(auth.uid(), 'thoughts'));

CREATE POLICY "Admins and employees with thoughts access can delete" 
ON public.thoughts_submissions 
FOR DELETE 
USING (public.is_admin_or_has_section(auth.uid(), 'thoughts'));

-- Update Partnership Inquiries table policies
DROP POLICY IF EXISTS "Admins can view all partnership inquiries" ON public.partnership_inquiries;
DROP POLICY IF EXISTS "Admins can update partnership inquiries" ON public.partnership_inquiries;
DROP POLICY IF EXISTS "Admins can delete partnership inquiries" ON public.partnership_inquiries;

CREATE POLICY "Admins and employees with partnerships access can view" 
ON public.partnership_inquiries 
FOR SELECT 
USING (public.is_admin_or_has_section(auth.uid(), 'partnerships'));

CREATE POLICY "Admins and employees with partnerships access can update" 
ON public.partnership_inquiries 
FOR UPDATE 
USING (public.is_admin_or_has_section(auth.uid(), 'partnerships'));

CREATE POLICY "Admins and employees with partnerships access can delete" 
ON public.partnership_inquiries 
FOR DELETE 
USING (public.is_admin_or_has_section(auth.uid(), 'partnerships'));

-- Update Newsletter Settings table policies
DROP POLICY IF EXISTS "Admins can manage newsletter settings" ON public.newsletter_settings;
CREATE POLICY "Admins and employees with newsletter access can manage" 
ON public.newsletter_settings 
FOR ALL 
USING (public.is_admin_or_has_section(auth.uid(), 'newsletter'));

-- Update Newsletter Subscribers table policies
DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can delete subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Admins and employees with newsletter access can view subscribers" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (public.is_admin_or_has_section(auth.uid(), 'newsletter'));

CREATE POLICY "Admins and employees with newsletter access can update subscribers" 
ON public.newsletter_subscribers 
FOR UPDATE 
USING (public.is_admin_or_has_section(auth.uid(), 'newsletter'));

CREATE POLICY "Admins and employees with newsletter access can delete subscribers" 
ON public.newsletter_subscribers 
FOR DELETE 
USING (public.is_admin_or_has_section(auth.uid(), 'newsletter'));

-- Update User Role History table policies (for users section)
DROP POLICY IF EXISTS "Admins can view all role history" ON public.user_role_history;
DROP POLICY IF EXISTS "Admins can insert role history" ON public.user_role_history;

CREATE POLICY "Admins and employees with users access can view role history" 
ON public.user_role_history 
FOR SELECT 
USING (public.is_admin_or_has_section(auth.uid(), 'users') OR auth.uid() = user_id);

CREATE POLICY "Admins can insert role history" 
ON public.user_role_history 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update Partnerships table policies (related to partnerships section)
DROP POLICY IF EXISTS "Authenticated users can manage partnerships" ON public.partnerships;
CREATE POLICY "Admins and employees with partnerships access can manage" 
ON public.partnerships 
FOR ALL 
USING (public.is_admin_or_has_section(auth.uid(), 'partnerships'));

-- Update Datasets table policies (related to settings section)
DROP POLICY IF EXISTS "Authenticated users can manage datasets" ON public.datasets;
CREATE POLICY "Admins and employees with settings access can manage" 
ON public.datasets 
FOR ALL 
USING (public.is_admin_or_has_section(auth.uid(), 'settings'));

-- Update Fellows table policies (related to contributors section)
DROP POLICY IF EXISTS "Authenticated users can manage fellows" ON public.fellows;
CREATE POLICY "Admins and employees with contributors access can manage" 
ON public.fellows 
FOR ALL 
USING (public.is_admin_or_has_section(auth.uid(), 'contributors'));
