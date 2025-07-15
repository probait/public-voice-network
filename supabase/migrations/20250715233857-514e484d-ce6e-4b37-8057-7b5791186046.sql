-- Add a published field to meetups table for visibility control
ALTER TABLE public.meetups ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;