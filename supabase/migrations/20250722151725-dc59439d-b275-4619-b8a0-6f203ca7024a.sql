-- Add RLS policy to allow admins to update user roles
CREATE POLICY "Admins can manage user roles" 
ON public.profiles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'::public.app_role));