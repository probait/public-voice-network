-- Create has_section_permission function
CREATE OR REPLACE FUNCTION public.has_section_permission(_user_id uuid, _section text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_section_permissions usp
    WHERE usp.user_id = _user_id
      AND usp.section::text = _section
      AND usp.has_access = true
  )
$$;

-- Create is_admin_or_has_section function
CREATE OR REPLACE FUNCTION public.is_admin_or_has_section(_user_id uuid, _section text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    public.has_role(_user_id, 'admin'::app_role) OR 
    public.has_section_permission(_user_id, _section)
$$;