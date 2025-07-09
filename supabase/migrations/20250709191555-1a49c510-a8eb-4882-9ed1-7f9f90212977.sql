-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  source VARCHAR(100) DEFAULT 'popup',
  beehiv_id VARCHAR(255),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create newsletter settings table
CREATE TABLE public.newsletter_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  popup_enabled BOOLEAN DEFAULT true,
  popup_delay_seconds INTEGER DEFAULT 5,
  popup_frequency_days INTEGER DEFAULT 7,
  beehiv_publication_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Enable RLS on newsletter_settings
ALTER TABLE public.newsletter_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for newsletter_subscribers
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'content_manager'::app_role));

CREATE POLICY "Admins can update subscribers"
ON public.newsletter_subscribers
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'content_manager'::app_role));

CREATE POLICY "Admins can delete subscribers"
ON public.newsletter_subscribers
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for newsletter_settings
CREATE POLICY "Anyone can view newsletter settings"
ON public.newsletter_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage newsletter settings"
ON public.newsletter_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'content_manager'::app_role));

-- Insert default newsletter settings
INSERT INTO public.newsletter_settings (popup_enabled, popup_delay_seconds, popup_frequency_days)
VALUES (true, 5, 7);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_newsletter_subscribers_updated_at
    BEFORE UPDATE ON public.newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_newsletter_updated_at();

CREATE TRIGGER update_newsletter_settings_updated_at
    BEFORE UPDATE ON public.newsletter_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_newsletter_updated_at();