-- Create thoughts_submissions table
CREATE TABLE public.thoughts_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  province TEXT NOT NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'responded', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create partnership_inquiries table
CREATE TABLE public.partnership_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'responded', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.thoughts_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for thoughts_submissions
CREATE POLICY "Anyone can submit thoughts" 
ON public.thoughts_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all thoughts submissions" 
ON public.thoughts_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update thoughts submissions" 
ON public.thoughts_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete thoughts submissions" 
ON public.thoughts_submissions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for partnership_inquiries
CREATE POLICY "Anyone can submit partnership inquiries" 
ON public.partnership_inquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all partnership inquiries" 
ON public.partnership_inquiries 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update partnership inquiries" 
ON public.partnership_inquiries 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete partnership inquiries" 
ON public.partnership_inquiries 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for automatic updated_at
CREATE TRIGGER update_thoughts_submissions_updated_at
    BEFORE UPDATE ON public.thoughts_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partnership_inquiries_updated_at
    BEFORE UPDATE ON public.partnership_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();