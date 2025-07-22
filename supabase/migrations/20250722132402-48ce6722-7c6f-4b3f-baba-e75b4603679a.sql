-- Create enum for admin sections
CREATE TYPE admin_section AS ENUM (
  'dashboard',
  'articles', 
  'contributors',
  'events',
  'thoughts',
  'partnerships',
  'newsletter',
  'users',
  'settings'
);

-- Create user_section_permissions table
CREATE TABLE public.user_section_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  section admin_section NOT NULL,
  has_access BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, section)
);

-- Enable RLS
ALTER TABLE public.user_section_permissions ENABLE ROW LEVEL SECURITY;

-- Only admins can manage permissions
CREATE POLICY "Admins can manage all permissions" ON public.user_section_permissions 
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Users can view their own permissions (for UI purposes)
CREATE POLICY "Users can view own permissions" ON public.user_section_permissions 
FOR SELECT USING (user_id = auth.uid());

-- Create the get_user_permissions function
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id_param UUID)
RETURNS TABLE(section TEXT, has_access BOOLEAN)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    usp.section::TEXT,
    usp.has_access
  FROM public.user_section_permissions usp
  WHERE usp.user_id = user_id_param;
$$;