-- Step 1: Update app_role enum to new 3-role system
-- Handle all dependencies by dropping and recreating them

-- First, create temporary columns to store current role data
ALTER TABLE public.profiles ADD COLUMN temp_role text;
ALTER TABLE public.user_role_history ADD COLUMN temp_new_role text;
ALTER TABLE public.user_role_history ADD COLUMN temp_previous_role text;

-- Copy existing role data to temporary columns with mapping
UPDATE public.profiles 
SET temp_role = CASE 
  WHEN user_role = 'admin' THEN 'admin'
  WHEN user_role = 'moderator' THEN 'employee' 
  WHEN user_role = 'content_manager' THEN 'employee'
  WHEN user_role = 'viewer' THEN 'public'
  ELSE 'public'
END
WHERE user_role IS NOT NULL;

UPDATE public.user_role_history 
SET temp_new_role = CASE 
  WHEN new_role = 'admin' THEN 'admin'
  WHEN new_role = 'moderator' THEN 'employee'
  WHEN new_role = 'content_manager' THEN 'employee' 
  WHEN new_role = 'viewer' THEN 'public'
  ELSE 'public'
END;

UPDATE public.user_role_history 
SET temp_previous_role = CASE 
  WHEN previous_role = 'admin' THEN 'admin'
  WHEN previous_role = 'moderator' THEN 'employee'
  WHEN previous_role = 'content_manager' THEN 'employee'
  WHEN previous_role = 'viewer' THEN 'public'
  ELSE 'public'
END
WHERE previous_role IS NOT NULL;

-- Drop all RLS policies that depend on app_role
DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can delete subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can manage newsletter settings" ON public.newsletter_settings;
DROP POLICY IF EXISTS "Admins can view all role history" ON public.user_role_history;
DROP POLICY IF EXISTS "Admins can insert role history" ON public.user_role_history;
DROP POLICY IF EXISTS "Admins can view all thoughts submissions" ON public.thoughts_submissions;
DROP POLICY IF EXISTS "Admins can update thoughts submissions" ON public.thoughts_submissions;
DROP POLICY IF EXISTS "Admins can delete thoughts submissions" ON public.thoughts_submissions;
DROP POLICY IF EXISTS "Admins can view all partnership inquiries" ON public.partnership_inquiries;
DROP POLICY IF EXISTS "Admins can update partnership inquiries" ON public.partnership_inquiries;
DROP POLICY IF EXISTS "Admins can delete partnership inquiries" ON public.partnership_inquiries;
DROP POLICY IF EXISTS "Only admins can create meetups" ON public.meetups;
DROP POLICY IF EXISTS "Only admins can update meetups" ON public.meetups;
DROP POLICY IF EXISTS "Only admins can delete meetups" ON public.meetups;
DROP POLICY IF EXISTS "Admins can manage all contributors" ON public.contributors;
DROP POLICY IF EXISTS "Admins can manage contributor headshots" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all permissions" ON public.user_section_permissions;

-- Drop functions that depend on app_role
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);
DROP FUNCTION IF EXISTS public.get_user_role(uuid);

-- Drop columns that use the old enum
ALTER TABLE public.profiles DROP COLUMN user_role;
ALTER TABLE public.user_role_history DROP COLUMN new_role;
ALTER TABLE public.user_role_history DROP COLUMN previous_role;

-- Now we can safely drop the enum
DROP TYPE public.app_role;

-- Create the new enum with 3 roles
CREATE TYPE public.app_role AS ENUM ('public', 'employee', 'admin');

-- Recreate columns with new enum type
ALTER TABLE public.profiles ADD COLUMN user_role public.app_role DEFAULT 'public';
ALTER TABLE public.user_role_history ADD COLUMN new_role public.app_role;
ALTER TABLE public.user_role_history ADD COLUMN previous_role public.app_role;

-- Migrate data back from temporary columns
UPDATE public.profiles 
SET user_role = temp_role::public.app_role 
WHERE temp_role IS NOT NULL;

UPDATE public.user_role_history 
SET new_role = temp_new_role::public.app_role 
WHERE temp_new_role IS NOT NULL;

UPDATE public.user_role_history 
SET previous_role = temp_previous_role::public.app_role 
WHERE temp_previous_role IS NOT NULL;

-- Set default role for any users without roles
UPDATE public.profiles 
SET user_role = 'public' 
WHERE user_role IS NULL;

-- Recreate the security functions with new enum
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND user_role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT user_role 
    FROM public.profiles 
    WHERE id = _user_id
    LIMIT 1;
$$;

-- Recreate RLS policies with new roles
CREATE POLICY "Admins can view all subscribers" ON public.newsletter_subscribers 
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update subscribers" ON public.newsletter_subscribers 
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete subscribers" ON public.newsletter_subscribers 
FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage newsletter settings" ON public.newsletter_settings 
FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all role history" ON public.user_role_history 
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert role history" ON public.user_role_history 
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all thoughts submissions" ON public.thoughts_submissions 
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update thoughts submissions" ON public.thoughts_submissions 
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete thoughts submissions" ON public.thoughts_submissions 
FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all partnership inquiries" ON public.partnership_inquiries 
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update partnership inquiries" ON public.partnership_inquiries 
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete partnership inquiries" ON public.partnership_inquiries 
FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can create meetups" ON public.meetups 
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update meetups" ON public.meetups 
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete meetups" ON public.meetups 
FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all contributors" ON public.contributors 
FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all permissions" ON public.user_section_permissions 
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Clean up temporary columns
ALTER TABLE public.profiles DROP COLUMN temp_role;
ALTER TABLE public.user_role_history DROP COLUMN temp_new_role;
ALTER TABLE public.user_role_history DROP COLUMN temp_previous_role;