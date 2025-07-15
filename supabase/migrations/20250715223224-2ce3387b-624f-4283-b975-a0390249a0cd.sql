-- Add featured field to thoughts_submissions table
ALTER TABLE public.thoughts_submissions 
ADD COLUMN featured BOOLEAN DEFAULT false NOT NULL;