-- Add current_role field to profiles table
ALTER TABLE public.profiles ADD COLUMN current_role public.app_role;

-- Rename user_roles to user_role_history for audit trail
ALTER TABLE public.user_roles RENAME TO user_role_history;

-- Add audit fields to user_role_history
ALTER TABLE public.user_role_history 
ADD COLUMN change_type text CHECK (change_type IN ('assigned', 'changed', 'removed')),
ADD COLUMN previous_role public.app_role,
ADD COLUMN new_role public.app_role,
ADD COLUMN change_reason text;

-- Rename role column to new_role for consistency
ALTER TABLE public.user_role_history RENAME COLUMN role TO new_role;

-- Update existing records to have change_type as 'assigned'
UPDATE public.user_role_history SET change_type = 'assigned' WHERE change_type IS NULL;

-- Make change_type NOT NULL after populating existing records
ALTER TABLE public.user_role_history ALTER COLUMN change_type SET NOT NULL;

-- Migrate existing role data to profiles.current_role (taking the highest role per user)
UPDATE public.profiles 
SET current_role = (
    SELECT new_role 
    FROM public.user_role_history 
    WHERE user_id = profiles.id 
    ORDER BY 
        CASE new_role
            WHEN 'admin' THEN 1
            WHEN 'moderator' THEN 2
            WHEN 'content_manager' THEN 3
            WHEN 'viewer' THEN 4
        END
    LIMIT 1
);

-- Create trigger function to log role changes
CREATE OR REPLACE FUNCTION public.handle_profile_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only proceed if current_role actually changed
    IF OLD.current_role IS DISTINCT FROM NEW.current_role THEN
        INSERT INTO public.user_role_history (
            user_id,
            change_type,
            previous_role,
            new_role,
            assigned_by,
            assigned_at
        ) VALUES (
            NEW.id,
            CASE 
                WHEN OLD.current_role IS NULL AND NEW.current_role IS NOT NULL THEN 'assigned'
                WHEN OLD.current_role IS NOT NULL AND NEW.current_role IS NULL THEN 'removed'
                ELSE 'changed'
            END,
            OLD.current_role,
            NEW.current_role,
            auth.uid(), -- Will be null for direct DB changes
            now()
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger on profiles table
CREATE TRIGGER trigger_profile_role_change
    AFTER UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_role_change();

-- Update RLS policies for the renamed table
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can assign roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- Create new RLS policies for user_role_history
CREATE POLICY "Users can view their own role history" 
    ON public.user_role_history 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all role history" 
    ON public.user_role_history 
    FOR SELECT 
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert role history" 
    ON public.user_role_history 
    FOR INSERT 
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update get_user_role function to use profiles.current_role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT current_role
  FROM public.profiles
  WHERE id = _user_id
  LIMIT 1
$$;