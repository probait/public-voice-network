
-- 1) Add tracking columns for safe, idempotent imports
ALTER TABLE public.thoughts_submissions
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS source_participant_id text,
  ADD COLUMN IF NOT EXISTS region text;

COMMENT ON COLUMN public.thoughts_submissions.source IS 'Origin of this submission (e.g., manual, bc_ai_survey_2025)';
COMMENT ON COLUMN public.thoughts_submissions.source_participant_id IS 'External participant identifier for deduping imports';
COMMENT ON COLUMN public.thoughts_submissions.region IS 'Survey-provided BC region (e.g., Vancouver / Lower Mainland)';

-- 2) Create a unique index to prevent duplicates across sources
-- Partial unique index: only enforced when source_participant_id is present
CREATE UNIQUE INDEX IF NOT EXISTS thoughts_submissions_source_pid_uniq
  ON public.thoughts_submissions (source, source_participant_id)
  WHERE source_participant_id IS NOT NULL;
