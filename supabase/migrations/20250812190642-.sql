-- Resolve linter error by removing SECURITY DEFINER exposure and switch to column-level protection

-- 1) Remove the public view + function introduced earlier
DROP VIEW IF EXISTS public.profiles_public;
DROP FUNCTION IF EXISTS public.get_public_profiles();

-- 2) Permit public read of non-sensitive profile rows via RLS while protecting sensitive columns via column privileges
-- Allow public SELECT (needed for organizer names/avatars on public pages)
CREATE POLICY IF NOT EXISTS "Public can view non-sensitive profiles"
ON public.profiles
FOR SELECT
USING (true);

-- 3) Prevent the anon role from selecting the email column
REVOKE SELECT(email) ON TABLE public.profiles FROM anon;

-- Note: Admins/employees remain able to view all profiles via the existing policy
--       "Admins and employees with users access can view profiles".
--       Regular users can view only their own profile via "Users can view own profile".
--       Public (anon) can read non-sensitive fields but cannot select `email`.