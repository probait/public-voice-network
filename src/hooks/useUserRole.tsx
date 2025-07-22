
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'employee' | 'public' | null;

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_user_role', {
          _user_id: user.id
        });

        if (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        } else {
          setRole(data as UserRole);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasRole = (requiredRole: UserRole) => {
    if (!role || !requiredRole) return false;
    
    const roleHierarchy = {
      admin: 3,
      employee: 2,
      public: 1
    };
    
    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  const isAdmin = () => role === 'admin';
  const isEmployee = () => role === 'employee';
  const isPublic = () => role === 'public';

  return {
    role,
    loading,
    hasRole,
    isAdmin,
    isEmployee,
    isPublic
  };
};
