-- Fix linter: 0010_security_definer_view
-- Set views to run with the privileges of the querying user instead of the view owner
-- This preserves RLS and prevents privilege escalation via views

-- Ensure the view exists before altering (safe to run even if already set)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'v' AND n.nspname = 'public' AND c.relname = 'profiles_public'
  ) THEN
    EXECUTE 'ALTER VIEW public.profiles_public SET (security_invoker = true)';
  END IF;
END $$;
