-- Restrict public access to sensitive profile data and expose a safe public view

-- 1) Remove overly-permissive public SELECT policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- 2) Create safer SELECT policies
-- Admins or employees with users access can view all profiles
CREATE POLICY "Admins and employees with users access can view profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin_or_has_section(auth.uid(), 'users'::text));

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 3) Create a SECURITY DEFINER function that returns only non-sensitive public fields
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE(id uuid, full_name text, avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT id, full_name, avatar_url
  FROM public.profiles
$$;

-- 4) Create a view that exposes only safe fields for public consumption
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT * FROM public.get_public_profiles();

-- 5) Grant access to the public view (no emails exposed)
GRANT SELECT ON public.profiles_public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profiles() TO anon, authenticated;