
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'employee' | 'public' | null;

export const useUserRole = () => {
  const { user, session } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user || !session) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        // First try the RPC function
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_role', {
          _user_id: user.id
        });

        if (rpcError) {
          // Fallback: Query profiles table directly
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_role')
            .eq('id', user.id)
            .single();

          if (profileError) {
            setRole('public'); // Default fallback
          } else {
            setRole(profileData.user_role as UserRole || 'public');
          }
        } else {
          setRole(rpcData as UserRole);
        }
      } catch (error) {
        console.error('useUserRole - Unexpected error:', error);
        setRole('public'); // Default fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user, session]);

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
