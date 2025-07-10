-- Comprehensive user role migration with audit trail
-- Step 1: Add user_role column to profiles table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'user_role'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN user_role public.app_role;
    END IF;
END $$;

-- Step 2: Handle user_role_history table
DO $$
BEGIN
    -- If user_roles exists and user_role_history doesn't, rename it
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles' AND table_schema = 'public')
       AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_role_history' AND table_schema = 'public') THEN
        ALTER TABLE public.user_roles RENAME TO user_role_history;
    END IF;
END $$;

-- Step 3: Add audit fields to user_role_history
DO $$
BEGIN
    -- Add change_type if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_role_history' AND column_name = 'change_type'
    ) THEN
        ALTER TABLE public.user_role_history ADD COLUMN change_type text;
        UPDATE public.user_role_history SET change_type = 'assigned' WHERE change_type IS NULL;
        ALTER TABLE public.user_role_history ALTER COLUMN change_type SET NOT NULL;
    END IF;

    -- Add previous_role if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_role_history' AND column_name = 'previous_role'
    ) THEN
        ALTER TABLE public.user_role_history ADD COLUMN previous_role public.app_role;
    END IF;

    -- Handle role/new_role column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_role_history' AND column_name = 'role'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_role_history' AND column_name = 'new_role'
    ) THEN
        ALTER TABLE public.user_role_history RENAME COLUMN role TO new_role;
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_role_history' AND column_name = 'new_role'
    ) THEN
        ALTER TABLE public.user_role_history ADD COLUMN new_role public.app_role;
    END IF;

    -- Add change_reason if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_role_history' AND column_name = 'change_reason'
    ) THEN
        ALTER TABLE public.user_role_history ADD COLUMN change_reason text;
    END IF;
END $$;

-- Step 4: Migrate existing role data to profiles.user_role
UPDATE public.profiles 
SET user_role = (
    SELECT new_role 
    FROM public.user_role_history 
    WHERE user_role_history.user_id = profiles.id 
    ORDER BY 
        CASE new_role 
            WHEN 'admin' THEN 4
            WHEN 'moderator' THEN 3
            WHEN 'content_manager' THEN 2
            WHEN 'viewer' THEN 1
            ELSE 0
        END DESC,
        assigned_at DESC 
    LIMIT 1
)
WHERE user_role IS NULL
AND EXISTS (
    SELECT 1 FROM public.user_role_history 
    WHERE user_role_history.user_id = profiles.id
);

-- Step 5: Create trigger function for role change auditing
CREATE OR REPLACE FUNCTION public.handle_profile_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only log if the role actually changed
    IF OLD.user_role IS DISTINCT FROM NEW.user_role THEN
        INSERT INTO public.user_role_history (
            user_id,
            previous_role,
            new_role,
            change_type,
            change_reason,
            assigned_by,
            assigned_at
        ) VALUES (
            NEW.id,
            OLD.user_role,
            NEW.user_role,
            CASE 
                WHEN OLD.user_role IS NULL THEN 'assigned'
                WHEN NEW.user_role IS NULL THEN 'removed'
                ELSE 'changed'
            END,
            'Role updated via profiles table',
            auth.uid(),
            now()
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Step 6: Create trigger on profiles table
DROP TRIGGER IF EXISTS trigger_profile_role_change ON public.profiles;
CREATE TRIGGER trigger_profile_role_change
    AFTER UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_role_change();

-- Step 7: Update RLS policies for user_role_history
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_role_history;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_role_history;
DROP POLICY IF EXISTS "Admins can assign roles" ON public.user_role_history;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_role_history;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_role_history;

-- Create new RLS policies for user_role_history
CREATE POLICY "Users can view their own role history" 
    ON public.user_role_history 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all role history" 
    ON public.user_role_history 
    FOR SELECT 
    USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert role history" 
    ON public.user_role_history 
    FOR INSERT 
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Step 8: Update get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT user_role 
    FROM public.profiles 
    WHERE id = _user_id
    LIMIT 1;
$$;