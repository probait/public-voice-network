
-- Remove all attendee-related functionality from the database

-- First drop the attendees table completely
DROP TABLE IF EXISTS public.attendees CASCADE;

-- Remove max_attendees column from meetups table
ALTER TABLE public.meetups DROP COLUMN IF EXISTS max_attendees;

-- Note: RLS policies for attendees table will be automatically dropped when the table is dropped
