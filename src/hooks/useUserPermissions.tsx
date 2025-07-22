
import { useAuth } from './useAuth';
import { useUserRole } from './useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export type AdminSection = 
  | 'dashboard' 
  | 'articles' 
  | 'contributors' 
  | 'events' 
  | 'thoughts' 
  | 'partnerships' 
  | 'newsletter' 
  | 'users' 
  | 'settings';

interface UserPermissions {
  [key: string]: boolean;
}

export const useUserPermissions = () => {
  const { user } = useAuth();
  const { role, isAdmin } = useUserRole();
  
  const { data: permissions = {}, isLoading: loading } = useQuery({
    queryKey: ['userPermissions', user?.id, role],
    queryFn: async (): Promise<UserPermissions> => {
      console.log('🔍 [useUserPermissions] Fetching permissions for:', { userId: user?.id, role });
      
      if (!user || !role) {
        console.log('🔍 [useUserPermissions] No user or role, returning empty permissions');
        return {};
      }

      // Admins have access to everything
      if (role === 'admin') {
        const adminPermissions = {
          dashboard: true,
          articles: true,
          contributors: true,
          events: true,
          thoughts: true,
          partnerships: true,
          newsletter: true,
          users: true,
          settings: true
        };
        console.log('🔍 [useUserPermissions] Admin permissions:', adminPermissions);
        return adminPermissions;
      }

      // Public users have no admin access
      if (role === 'public') {
        console.log('🔍 [useUserPermissions] Public user, no permissions');
        return {};
      }

      // Employee users - fetch their specific permissions from the database
      if (role === 'employee') {
        try {
          console.log('🔍 [useUserPermissions] Fetching employee permissions for user:', user.id);
          
          const { data, error } = await supabase
            .from('user_section_permissions')
            .select('section, has_access')
            .eq('user_id', user.id);

          if (error) {
            console.error('🔍 [useUserPermissions] Error fetching user permissions:', error);
            return {};
          } else {
            const userPermissions: UserPermissions = {};
            data?.forEach((perm) => {
              userPermissions[perm.section] = perm.has_access;
            });
            console.log('🔍 [useUserPermissions] Employee permissions fetched:', userPermissions);
            return userPermissions;
          }
        } catch (error) {
          console.error('🔍 [useUserPermissions] Error fetching user permissions:', error);
          return {};
        }
      }

      console.log('🔍 [useUserPermissions] Unknown role, returning empty permissions');
      return {};
    },
    // Cache permissions for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Don't refetch on window focus for permissions
    refetchOnWindowFocus: false,
    // Only fetch when we have both user and role
    enabled: !!user && !!role,
  });

  const hasPermission = (section: AdminSection) => {
    console.log('🔍 [hasPermission] Checking permission for section:', section, { role, isAdmin: isAdmin(), permission: permissions[section] });
    
    // Admins have access to everything
    if (isAdmin()) {
      console.log('🔍 [hasPermission] User is admin, granting access to:', section);
      return true;
    }
    
    // Check specific permission
    const hasAccess = permissions[section] === true;
    console.log('🔍 [hasPermission] Permission check result:', { section, hasAccess, permissions });
    return hasAccess;
  };

  const hasAnyPermission = () => {
    console.log('🔍 [hasAnyPermission] Checking if user has any permission:', { role, permissions, isAdmin: isAdmin() });
    
    // Admins have access to everything
    if (isAdmin()) {
      console.log('🔍 [hasAnyPermission] User is admin, has all permissions');
      return true;
    }
    
    // Check if any permission is true
    const permissionValues = Object.values(permissions);
    const hasAny = permissionValues.length > 0 && permissionValues.some(perm => perm === true);
    
    console.log('🔍 [hasAnyPermission] Permission analysis:', {
      permissionValues,
      hasAny,
      permissionsObject: permissions
    });
    
    return hasAny;
  };

  const canAccessAdminPortal = () => {
    console.log('🔍 [canAccessAdminPortal] Checking admin portal access:', { role, hasAny: hasAnyPermission() });
    
    // Only admin and employee roles can access admin portal
    const canAccess = role === 'admin' || (role === 'employee' && hasAnyPermission());
    
    console.log('🔍 [canAccessAdminPortal] Final decision:', {
      role,
      isEmployee: role === 'employee',
      hasAnyPerms: hasAnyPermission(),
      canAccess
    });
    
    return canAccess;
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    canAccessAdminPortal
  };
};
