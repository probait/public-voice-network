-- Step 1: Create a temporary table to consolidate roles to highest role per user
CREATE TEMP TABLE user_highest_roles AS
SELECT DISTINCT ON (user_id) 
  user_id, 
  role, 
  assigned_by, 
  assigned_at
FROM public.user_roles
ORDER BY user_id, 
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'moderator' THEN 2
    WHEN 'content_manager' THEN 3
    WHEN 'viewer' THEN 4
  END;

-- Step 2: Drop the existing unique constraint on (user_id, role)
ALTER TABLE public.user_roles DROP CONSTRAINT user_roles_user_id_role_key;

-- Step 3: Clear existing data and insert consolidated roles
DELETE FROM public.user_roles;
INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at)
SELECT user_id, role, assigned_by, assigned_at FROM user_highest_roles;

-- Step 4: Add unique constraint on user_id only (one role per user)
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);

-- Step 5: Update the get_user_role function to be simpler since there's only one role per user
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;