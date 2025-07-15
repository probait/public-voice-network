-- Drop existing RLS policies for meetups
DROP POLICY IF EXISTS "Users can create their own meetups" ON public.meetups;
DROP POLICY IF EXISTS "Users can update their own meetups" ON public.meetups;
DROP POLICY IF EXISTS "Users can delete their own meetups" ON public.meetups;

-- Create new admin-only policies for meetups
CREATE POLICY "Only admins can create meetups" 
ON public.meetups 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update meetups" 
ON public.meetups 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete meetups" 
ON public.meetups 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));