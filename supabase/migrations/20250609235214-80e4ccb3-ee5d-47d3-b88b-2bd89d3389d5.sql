
-- Drop the existing submissions table and create a new meetups table
DROP TABLE IF EXISTS public.submissions;

-- Create meetups table for storing meetup events
CREATE TABLE public.meetups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  max_attendees INTEGER DEFAULT 20,
  category TEXT DEFAULT 'general',
  is_virtual BOOLEAN DEFAULT false,
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendees table for tracking who's attending which meetups
CREATE TABLE public.attendees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meetup_id UUID REFERENCES public.meetups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(meetup_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meetups
CREATE POLICY "Anyone can view meetups" 
  ON public.meetups 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own meetups" 
  ON public.meetups 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meetups" 
  ON public.meetups 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meetups" 
  ON public.meetups 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for attendees
CREATE POLICY "Anyone can view attendees" 
  ON public.attendees 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own attendance" 
  ON public.attendees 
  FOR ALL 
  USING (auth.uid() = user_id);
