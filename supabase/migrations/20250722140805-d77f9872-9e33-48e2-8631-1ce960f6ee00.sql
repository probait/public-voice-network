
-- Phase 1: Update app_role enum and create security functions

-- Step 1: Drop existing app_role enum and recreate with new 3-role system
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('public', 'employee', 'admin');

-- Step 2: Re-add the user_role column to profiles with new enum
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS user_role,
ADD COLUMN user_role public.app_role DEFAULT 'public';

-- Step 3: Update existing users - set all to 'public' by default (admins can reassign)
UPDATE public.profiles SET user_role = 'public';

-- Step 4: Update user_role_history table to use new enum
ALTER TABLE public.user_role_history 
ALTER COLUMN new_role TYPE public.app_role USING 'public'::public.app_role,
ALTER COLUMN previous_role TYPE public.app_role USING 'public'::public.app_role;

-- Step 5: Recreate has_role function for new enum
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND user_role = _role
  );
$$;

-- Step 6: Create has_section_permission function
CREATE OR REPLACE FUNCTION public.has_section_permission(_user_id UUID, _section TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_section_permissions usp
    JOIN public.profiles p ON p.id = usp.user_id
    WHERE usp.user_id = _user_id 
      AND usp.section = _section 
      AND usp.has_access = true
      AND p.user_role = 'employee'
  );
$$;

-- Step 7: Create is_admin_or_has_section function
CREATE OR REPLACE FUNCTION public.is_admin_or_has_section(_user_id UUID, _section TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    public.has_role(_user_id, 'admin') OR 
    public.has_section_permission(_user_id, _section);
$$;

-- Step 8: Update get_user_role function for new enum
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT user_role
  FROM public.profiles
  WHERE id = _user_id
  LIMIT 1
$$;

-- Step 9: Update all RLS policies to use new 3-role system

-- Contributors table policies
DROP POLICY IF EXISTS "Anyone can view published contributors" ON public.contributors;
DROP POLICY IF EXISTS "Admins can manage all contributors" ON public.contributors;
DROP POLICY IF EXISTS "Authenticated users can manage contributors" ON public.contributors;

CREATE POLICY "Public can view published contributors" 
ON public.contributors 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins and employees with contributors access can manage" 
ON public.contributors 
FOR ALL 
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_section_permission(auth.uid(), 'contributors')
);

-- Articles table policies
DROP POLICY IF EXISTS "Anyone can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can manage articles" ON public.articles;

CREATE POLICY "Public can view published articles" 
ON public.articles 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins and employees with articles access can manage" 
ON public.articles 
FOR ALL 
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_section_permission(auth.uid(), 'articles')
);

-- Meetups/Events table policies
DROP POLICY IF EXISTS "Anyone can view meetups" ON public.meetups;
DROP POLICY IF EXISTS "Only admins can create meetups" ON public.meetups;
DROP POLICY IF EXISTS "Only admins can update meetups" ON public.meetups;
DROP POLICY IF EXISTS "Only admins can delete meetups" ON public.meetups;

CREATE POLICY "Public can view events" 
ON public.meetups 
FOR SELECT 
USING (true);

CREATE POLICY "Admins and employees with events access can manage" 
ON public.meetups 
FOR INSERT, UPDATE, DELETE 
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_section_permission(auth.uid(), 'events')
);

-- Thoughts Submissions table policies
DROP POLICY IF EXISTS "Anyone can submit thoughts" ON public.thoughts_submissions;
DROP POLICY IF EXISTS "Admins can view all thoughts submissions" ON public.thoughts_submissions;
DROP POLICY IF EXISTS "Admins can update thoughts submissions" ON public.thoughts_submissions;
DROP POLICY IF EXISTS "Admins can delete thoughts submissions" ON public.thoughts_submissions;
DROP POLICY IF EXISTS "Anyone can view featured thoughts submissions" ON public.thoughts_submissions;

CREATE POLICY "Anyone can submit thoughts" 
ON public.thoughts_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can view featured thoughts" 
ON public.thoughts_submissions 
FOR SELECT 
USING (featured = true);

CREATE POLICY "Admins and employees with thoughts access can manage" 
ON public.thoughts_submissions 
FOR SELECT, UPDATE, DELETE 
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_section_permission(auth.uid(), 'thoughts')
);

-- Partnership Inquiries table policies
DROP POLICY IF EXISTS "Admins can view all partnership inquiries" ON public.partnership_inquiries;
DROP POLICY IF EXISTS "Admins can update partnership inquiries" ON public.partnership_inquiries;
DROP POLICY IF EXISTS "Admins can delete partnership inquiries" ON public.partnership_inquiries;

CREATE POLICY "Admins and employees with partnerships access can view" 
ON public.partnership_inquiries 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_section_permission(auth.uid(), 'partnerships')
);

CREATE POLICY "Admins and employees with partnerships access can manage" 
ON public.partnership_inquiries 
FOR UPDATE, DELETE 
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_section_permission(auth.uid(), 'partnerships')
);

-- Newsletter Settings table policies
DROP POLICY IF EXISTS "Admins can manage newsletter settings" ON public.newsletter_settings;

CREATE POLICY "Admins and employees with newsletter access can manage" 
ON public.newsletter_settings 
FOR ALL 
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_section_permission(auth.uid(), 'newsletter')
);

-- Newsletter Subscribers table policies
DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can delete subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Admins and employees with newsletter access can view subscribers" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_section_permission(auth.uid(), 'newsletter')
);

CREATE POLICY "Admins and employees with newsletter access can manage subscribers" 
ON public.newsletter_subscribers 
FOR UPDATE, DELETE 
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_section_permission(auth.uid(), 'newsletter')
);

-- User Role History table policies
DROP POLICY IF EXISTS "Admins can view all role history" ON public.user_role_history;
DROP POLICY IF EXISTS "Admins can insert role history" ON public.user_role_history;

CREATE POLICY "Admins and employees with users access can view role history" 
ON public.user_role_history 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_section_permission(auth.uid(), 'users') OR
  auth.uid() = user_id
);

CREATE POLICY "Admins can insert role history" 
ON public.user_role_history 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Step 10: Update handle_new_user function to set default role to 'public'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, user_role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url',
    'public'::public.app_role
  );
  RETURN NEW;
END;
$$;
