-- Add user_role field to profiles table
ALTER TABLE public.profiles ADD COLUMN user_role public.app_role;

-- Rename user_roles to user_role_history for audit trail
ALTER TABLE public.user_roles RENAME TO user_role_history;

-- Add audit fields to user_role_history (checking if columns don't exist first)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_role_history' AND column_name = 'change_type') THEN
        ALTER TABLE public.user_role_history ADD COLUMN change_type text CHECK (change_type IN ('assigned', 'changed', 'removed'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_role_history' AND column_name = 'previous_role') THEN
        ALTER TABLE public.user_role_history ADD COLUMN previous_role public.app_role;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_role_history' AND column_name = 'new_role') THEN
        ALTER TABLE public.user_role_history ADD COLUMN new_role public.app_role;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_role_history' AND column_name = 'change_reason') THEN
        ALTER TABLE public.user_role_history ADD COLUMN change_reason text;
    END IF;
END
$$;

-- Copy role data to new_role if it exists in role column
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_role_history' AND column_name = 'role') THEN
        UPDATE public.user_role_history SET new_role = role WHERE new_role IS NULL;
        ALTER TABLE public.user_role_history DROP COLUMN role;
    END IF;
END
$$;

-- Update existing records to have change_type as 'assigned'
UPDATE public.user_role_history SET change_type = 'assigned' WHERE change_type IS NULL;

-- Make change_type NOT NULL after populating existing records
ALTER TABLE public.user_role_history ALTER COLUMN change_type SET NOT NULL;

-- Migrate existing role data to profiles.user_role (taking the highest role per user)
UPDATE public.profiles 
SET user_role = (
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
    -- Only proceed if user_role actually changed
    IF OLD.user_role IS DISTINCT FROM NEW.user_role THEN
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
                WHEN OLD.user_role IS NULL AND NEW.user_role IS NOT NULL THEN 'assigned'
                WHEN OLD.user_role IS NOT NULL AND NEW.user_role IS NULL THEN 'removed'
                ELSE 'changed'
            END,
            OLD.user_role,
            NEW.user_role,
            auth.uid(), -- Will be null for direct DB changes
            now()
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS trigger_profile_role_change ON public.profiles;
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
DROP POLICY IF EXISTS "Users can view their own role history" ON public.user_role_history;
DROP POLICY IF EXISTS "Admins can view all role history" ON public.user_role_history;
DROP POLICY IF EXISTS "Admins can insert role history" ON public.user_role_history;

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

-- Update get_user_role function to use profiles.user_role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT user_role
  FROM public.profiles
  WHERE id = _user_id
  LIMIT 1
$$;