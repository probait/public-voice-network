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

      // Employee users - fetch their specific permissions
      if (role === 'employee') {
        // For now, set basic permissions for employees
        // TODO: Implement actual permission checking once database is updated
        setPermissions({
          dashboard: true, // All employees can see dashboard
          articles: false,
          contributors: false,
          events: false,
          thoughts: false,
          partnerships: false,
          newsletter: false,
          users: false,
          settings: false
        });
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