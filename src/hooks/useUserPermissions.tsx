
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useUserRole } from './useUserRole';
import { supabase } from '@/integrations/supabase/client';

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
  const { user, session } = useAuth();
  const { role, isAdmin, loading: roleLoading } = useUserRole();
  const [permissions, setPermissions] = useState<UserPermissions>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user || !session || roleLoading) {
        console.log('useUserPermissions - Waiting for auth/role:', { 
          user: !!user, 
          session: !!session, 
          roleLoading,
          role 
        });
        setPermissions({});
        setLoading(false);
        return;
      }

      if (!role) {
        console.log('useUserPermissions - No role available');
        setPermissions({});
        setLoading(false);
        return;
      }

      console.log('useUserPermissions - Fetching permissions for role:', role);

      // Admins have access to everything
      if (role === 'admin') {
        console.log('useUserPermissions - Setting admin permissions');
        setPermissions({
          dashboard: true,
          articles: true,
          contributors: true,
          events: true,
          thoughts: true,
          partnerships: true,
          newsletter: true,
          users: true,
          settings: true
        });
        setLoading(false);
        return;
      }

      // Public users have no admin access
      if (role === 'public') {
        console.log('useUserPermissions - Setting public permissions (none)');
        setPermissions({});
        setLoading(false);
        return;
      }

      // Employee users - fetch their specific permissions from the database
      if (role === 'employee') {
        try {
          console.log('useUserPermissions - Fetching employee permissions');
          const { data, error } = await supabase
            .from('user_section_permissions')
            .select('section, has_access')
            .eq('user_id', user.id);

          if (error) {
            console.error('useUserPermissions - Error fetching permissions:', error);
            setPermissions({});
          } else {
            console.log('useUserPermissions - Employee permissions fetched:', data);
            const userPermissions: UserPermissions = {};
            data?.forEach((perm) => {
              userPermissions[perm.section] = perm.has_access;
            });
            setPermissions(userPermissions);
          }
        } catch (error) {
          console.error('useUserPermissions - Unexpected error:', error);
          setPermissions({});
        }
      }

      setLoading(false);
    };

    // Add small delay to ensure role is established
    if (user && session && !roleLoading) {
      const timeoutId = setTimeout(fetchPermissions, 100);
      return () => clearTimeout(timeoutId);
    } else {
      fetchPermissions();
    }
  }, [user, session, role, roleLoading]);

  const hasPermission = (section: AdminSection) => {
    // Admins have access to everything
    if (isAdmin()) return true;
    
    // Check specific permission
    return permissions[section] === true;
  };

  const hasAnyPermission = () => {
    if (isAdmin()) return true;
    return Object.values(permissions).some(perm => perm === true);
  };

  const canAccessAdminPortal = () => {
    // Only admin and employee roles can access admin portal
    return role === 'admin' || (role === 'employee' && hasAnyPermission());
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    canAccessAdminPortal
  };
};
