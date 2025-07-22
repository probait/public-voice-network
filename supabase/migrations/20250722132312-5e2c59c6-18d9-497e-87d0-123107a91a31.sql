-- Create the get_user_permissions function that returns user's section permissions
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