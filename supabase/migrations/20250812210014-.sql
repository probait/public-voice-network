-- Stage 1: Add safe RPCs for public featured thoughts without exposing emails
-- These functions are SECURITY DEFINER with fixed search_path to avoid privilege escalation

-- 1) Public featured thoughts (limited columns)
CREATE OR REPLACE FUNCTION public.get_featured_thoughts_public()
RETURNS TABLE (
  id uuid,
  name text,
  province text,
  category text,
  subject text,
  message text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT id, name, province, category, subject, message, created_at
  FROM public.thoughts_submissions
  WHERE featured = true
  ORDER BY created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_featured_thoughts_public() TO anon, authenticated;

-- 2) Category counts for featured thoughts
CREATE OR REPLACE FUNCTION public.get_featured_thoughts_category_counts()
RETURNS TABLE (
  category text,
  count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT COALESCE(category, 'Uncategorized') AS category,
         COUNT(*)::bigint AS count
  FROM public.thoughts_submissions
  WHERE featured = true
  GROUP BY COALESCE(category, 'Uncategorized')
  ORDER BY COUNT(*) DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_featured_thoughts_category_counts() TO anon, authenticated;
