-- Step 1: Update app_role enum to new 3-role system
-- First, we need to drop the existing enum and recreate it
-- But we need to handle existing data first

-- Create temporary column to store current roles
ALTER TABLE public.profiles ADD COLUMN temp_role text;
ALTER TABLE public.user_role_history ADD COLUMN temp_new_role text;
ALTER TABLE public.user_role_history ADD COLUMN temp_previous_role text;

-- Copy existing role data to temporary columns
UPDATE public.profiles 
SET temp_role = CASE 
  WHEN user_role = 'admin' THEN 'admin'
  WHEN user_role = 'moderator' THEN 'employee' 
  WHEN user_role = 'content_manager' THEN 'employee'
  WHEN user_role = 'viewer' THEN 'public'
  ELSE 'public'
END
WHERE user_role IS NOT NULL;

UPDATE public.user_role_history 
SET temp_new_role = CASE 
  WHEN new_role = 'admin' THEN 'admin'
  WHEN new_role = 'moderator' THEN 'employee'
  WHEN new_role = 'content_manager' THEN 'employee' 
  WHEN new_role = 'viewer' THEN 'public'
  ELSE 'public'
END;

UPDATE public.user_role_history 
SET temp_previous_role = CASE 
  WHEN previous_role = 'admin' THEN 'admin'
  WHEN previous_role = 'moderator' THEN 'employee'
  WHEN previous_role = 'content_manager' THEN 'employee'
  WHEN previous_role = 'viewer' THEN 'public'
  ELSE 'public'
END
WHERE previous_role IS NOT NULL;

-- Drop columns that use the old enum
ALTER TABLE public.profiles DROP COLUMN user_role;
ALTER TABLE public.user_role_history DROP COLUMN new_role;
ALTER TABLE public.user_role_history DROP COLUMN previous_role;

-- Drop the old enum
DROP TYPE public.app_role;

-- Create the new enum with 3 roles
CREATE TYPE public.app_role AS ENUM ('public', 'employee', 'admin');

-- Recreate columns with new enum type
ALTER TABLE public.profiles ADD COLUMN user_role public.app_role DEFAULT 'public';
ALTER TABLE public.user_role_history ADD COLUMN new_role public.app_role;
ALTER TABLE public.user_role_history ADD COLUMN previous_role public.app_role;

-- Migrate data back from temporary columns
UPDATE public.profiles 
SET user_role = temp_role::public.app_role 
WHERE temp_role IS NOT NULL;

UPDATE public.user_role_history 
SET new_role = temp_new_role::public.app_role 
WHERE temp_new_role IS NOT NULL;

UPDATE public.user_role_history 
SET previous_role = temp_previous_role::public.app_role 
WHERE temp_previous_role IS NOT NULL;

-- Drop temporary columns
ALTER TABLE public.profiles DROP COLUMN temp_role;
ALTER TABLE public.user_role_history DROP COLUMN temp_new_role;
ALTER TABLE public.user_role_history DROP COLUMN temp_previous_role;

-- Set default role for any users without roles
UPDATE public.profiles 
SET user_role = 'public' 
WHERE user_role IS NULL;