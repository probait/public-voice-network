
-- First, modify the meetups table to allow NULL user_id for system-created events
ALTER TABLE public.meetups ALTER COLUMN user_id DROP NOT NULL;

-- Insert the three sample events from EventbriteFeed into the meetups table
-- These will now be managed through the admin portal
INSERT INTO public.meetups (
  title,
  description,
  location,
  date_time,
  max_attendees,
  category,
  is_virtual,
  meeting_link,
  user_id
) VALUES 
(
  'AI & Future of Work Panel Discussion',
  'Join industry leaders and experts as they discuss how artificial intelligence is reshaping the workplace and what it means for Canadian workers and businesses.',
  'Toronto, ON',
  '2025-07-10 18:30:00+00',
  100,
  'Panel Discussion',
  false,
  null,
  NULL
),
(
  'Future of Work: AI Impact on Canadian Jobs',
  'A panel discussion on how artificial intelligence will reshape the Canadian job market and what workers need to know.',
  'Vancouver, BC',
  '2025-07-22 18:30:00+00',
  75,
  'Employment',
  false,
  null,
  NULL
),
(
  'AI in Healthcare: Opportunities and Challenges',
  'Exploring how AI can transform Canadian healthcare while addressing privacy concerns and ensuring equitable access.',
  'Montreal, QC',
  '2025-08-05 13:00:00+00',
  50,
  'Healthcare',
  false,
  null,
  NULL
);

-- Add a homepage_featured column to the meetups table to control which events show on homepage
ALTER TABLE public.meetups ADD COLUMN homepage_featured boolean DEFAULT false;

-- Mark the first event as featured for homepage
UPDATE public.meetups 
SET homepage_featured = true 
WHERE title = 'AI & Future of Work Panel Discussion';
