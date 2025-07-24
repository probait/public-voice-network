-- Fix storage policies for avatars bucket to work with current role system
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage contributor headshots" ON storage.objects;

-- Create new admin-only policy for headshots that matches the current role system
CREATE POLICY "Admins can manage contributor headshots" 
ON storage.objects 
FOR ALL
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'headshots'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Also add a policy for employees with contributors section access
CREATE POLICY "Contributors section access can manage headshots" 
ON storage.objects 
FOR ALL
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'headshots'
  AND has_section_permission(auth.uid(), 'contributors')
);