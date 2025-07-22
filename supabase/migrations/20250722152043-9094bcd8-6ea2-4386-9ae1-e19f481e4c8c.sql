
-- Remove the unique constraint that prevents multiple role history records per user
ALTER TABLE public.user_role_history DROP CONSTRAINT IF EXISTS user_roles_user_id_unique;

-- Also remove any other potential unique constraints on user_id
ALTER TABLE public.user_role_history DROP CONSTRAINT IF EXISTS user_role_history_user_id_unique;
