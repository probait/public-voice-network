-- Ensure unique index for upsert on (source, source_participant_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
      AND indexname = 'idx_thoughts_submissions_source_participant_unique'
  ) THEN
    CREATE UNIQUE INDEX idx_thoughts_submissions_source_participant_unique
      ON public.thoughts_submissions (source, source_participant_id);
  END IF;
END $$;