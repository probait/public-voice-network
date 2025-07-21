-- Fix contributors table RLS policy to respect published status for public access
DROP POLICY IF EXISTS "Anyone can view contributors" ON public.contributors;

-- Only published contributors are visible to the public
CREATE POLICY "Anyone can view published contributors" 
ON public.contributors 
FOR SELECT 
USING (is_published = true);

-- Admins can manage all contributors regardless of published status
CREATE POLICY "Admins can manage all contributors" 
ON public.contributors 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'content_manager'::app_role));

-- Drop existing avatar storage policies that allow user self-management
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Create admin-only policies for contributor headshots in avatars bucket
CREATE POLICY "Admins can manage contributor headshots" 
ON storage.objects 
FOR ALL
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'headshots'
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'content_manager'::app_role))
);

-- Public can only view headshots of published contributors
CREATE POLICY "Public can view published contributor headshots" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'headshots'
  AND EXISTS (
    SELECT 1 FROM public.contributors 
    WHERE headshot_url = 'https://ioaujiprntosnbuskxxd.supabase.co/storage/v1/object/public/avatars/' || storage.objects.name
    AND is_published = true
  )
);