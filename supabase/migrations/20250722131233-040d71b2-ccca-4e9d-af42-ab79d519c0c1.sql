
-- Phase 1: Database Schema Redesign for 3-Role System

-- Step 1: Update the app_role enum to only include the 3 new roles
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('public', 'employee', 'admin');

-- Step 2: Create the user_section_permissions table
CREATE TABLE IF NOT EXISTS public.user_section_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    section TEXT NOT NULL CHECK (section IN (
        'dashboard', 'articles', 'contributors', 'events', 
        'thoughts', 'partnerships', 'newsletter', 'users', 'settings'
    )),
    has_access BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, section)
);

-- Enable RLS on the new table
ALTER TABLE public.user_section_permissions ENABLE ROW LEVEL SECURITY;

-- Step 3: Update existing security functions for the new role system

-- Update has_role function for the new enum
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

-- Create new has_section_permission function
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

-- Create is_admin_or_has_section function
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

-- Step 4: Update get_user_role function for the new enum
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

-- Step 5: Migrate existing users to new role structure
-- Set all current users to 'public' by default, admins can reassign as needed
UPDATE public.profiles SET user_role = 'public' WHERE user_role IS NOT NULL;

-- Step 6: Update RLS policies for user_section_permissions table
DROP POLICY IF EXISTS "Admins can manage all permissions" ON public.user_section_permissions;
DROP POLICY IF EXISTS "Users can view own permissions" ON public.user_section_permissions;

CREATE POLICY "Admins can manage all permissions" 
ON public.user_section_permissions 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own permissions" 
ON public.user_section_permissions 
FOR SELECT 
USING (user_id = auth.uid());

-- Step 7: Update Contributors table RLS policies
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

-- Step 8: Update Articles table RLS policies
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

-- Step 9: Update Meetups/Events table RLS policies
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

-- Step 10: Update Thoughts Submissions table RLS policies
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

-- Step 11: Update Profiles table RLS policies for role management
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Step 12: Update other table policies to use new role system

-- Partnership Inquiries
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

-- Newsletter Settings
DROP POLICY IF EXISTS "Admins can manage newsletter settings" ON public.newsletter_settings;

CREATE POLICY "Admins and employees with newsletter access can manage" 
ON public.newsletter_settings 
FOR ALL 
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_section_permission(auth.uid(), 'newsletter')
);

-- Newsletter Subscribers
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

-- Step 13: Update User Role History policies
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

-- Step 14: Add trigger to automatically update updated_at on user_section_permissions
CREATE OR REPLACE FUNCTION public.update_user_section_permissions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_user_section_permissions_updated_at ON public.user_section_permissions;
CREATE TRIGGER trigger_update_user_section_permissions_updated_at
    BEFORE UPDATE ON public.user_section_permissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_section_permissions_updated_at();
