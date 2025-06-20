
-- Add image_url column to meetups table
ALTER TABLE public.meetups ADD COLUMN image_url TEXT;

-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);

-- Create policy to allow public access to event images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'event-images');

-- Create policy to allow authenticated users to upload event images
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-images' AND auth.role() = 'authenticated');

-- Create policy to allow users to update their own event images
CREATE POLICY "Allow users to update own images" ON storage.objects FOR UPDATE USING (bucket_id = 'event-images' AND auth.role() = 'authenticated');

-- Create policy to allow users to delete their own event images
CREATE POLICY "Allow users to delete own images" ON storage.objects FOR DELETE USING (bucket_id = 'event-images' AND auth.role() = 'authenticated');
