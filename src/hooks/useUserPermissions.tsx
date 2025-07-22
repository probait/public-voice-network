
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
  const { user } = useAuth();
  const { role, isAdmin } = useUserRole();
  const [permissions, setPermissions] = useState<UserPermissions>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user || !role) {
        setPermissions({});
        setLoading(false);
        return;
      }

      // Admins have access to everything
      if (role === 'admin') {
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
        setPermissions({});
        setLoading(false);
        return;
      }

      // Employee users - fetch their specific permissions from the database
      if (role === 'employee') {
        try {
          const { data, error } = await supabase.rpc('get_user_permissions', {
            user_id_param: user.id
          });

          if (error) {
            console.error('Error fetching user permissions:', error);
            setPermissions({});
          } else {
            const userPermissions: UserPermissions = {};
            data?.forEach((perm: { section: string; has_access: boolean }) => {
              userPermissions[perm.section] = perm.has_access;
            });
            setPermissions(userPermissions);
          }
        } catch (error) {
          console.error('Error fetching user permissions:', error);
          setPermissions({});
        }
      }

      setLoading(false);
    };

    fetchPermissions();
  }, [user, role]);

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
