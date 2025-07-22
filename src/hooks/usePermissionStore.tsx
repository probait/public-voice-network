
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { AdminSection } from "./useUserPermissions";

interface UserAccessRights {
  role: 'admin' | 'employee' | 'public' | null;
  permissions: {
    [K in AdminSection]?: boolean;
  };
}

export const usePermissionStore = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userPermissions", user?.id],
    queryFn: async (): Promise<UserAccessRights> => {
      if (!user) {
        return { role: null, permissions: {} };
      }

      // Get user role and permissions in parallel
      const [roleResponse, permissionsResponse] = await Promise.all([
        supabase.rpc('get_user_role', { _user_id: user.id }),
        supabase.rpc('get_user_permissions', { user_id_param: user.id })
      ]);

      if (roleResponse.error) throw roleResponse.error;

      const role = roleResponse.data as UserAccessRights['role'];
      
      // For admin users, grant all permissions
      if (role === 'admin') {
        return {
          role,
          permissions: {
            dashboard: true,
            articles: true,
            contributors: true,
            events: true,
            thoughts: true,
            partnerships: true,
            newsletter: true,
            users: true,
            settings: true
          }
        };
      }

      // For employees, use their specific permissions
      if (role === 'employee') {
        const permissions: UserAccessRights['permissions'] = {};
        permissionsResponse.data?.forEach(({ section, has_access }) => {
          permissions[section as AdminSection] = has_access;
        });
        return { role, permissions };
      }

      // For public users or unknown roles, no permissions
      return { role, permissions: {} };
    },
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
    enabled: !!user
  });
};
