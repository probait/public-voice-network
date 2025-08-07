-- Add external link fields to meetups table
ALTER TABLE public.meetups 
ADD COLUMN external_url TEXT,
ADD COLUMN external_link_text TEXT;