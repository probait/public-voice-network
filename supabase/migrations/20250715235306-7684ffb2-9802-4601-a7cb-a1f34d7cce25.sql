-- Add is_published field to contributors table and update existing records
ALTER TABLE public.contributors 
ADD COLUMN is_published boolean DEFAULT true;

-- Update all existing contributors to be published by default
UPDATE public.contributors 
SET is_published = true;