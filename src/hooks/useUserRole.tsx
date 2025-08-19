
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
        console.log('useUserRole - No user or session:', { user: !!user, session: !!session });
        setRole(null);
        setLoading(false);
        return;
      }

      console.log('useUserRole - Fetching role for user:', user.id);

      try {
        // First try the RPC function
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_role', {
          _user_id: user.id
        });

        if (rpcError) {
          console.warn('useUserRole - RPC function failed:', rpcError);
          
          // Fallback: Query profiles table directly
          console.log('useUserRole - Trying fallback profile query...');
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_role')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('useUserRole - Profile query also failed:', profileError);
            setRole('public'); // Default fallback
          } else {
            console.log('useUserRole - Profile query successful:', profileData);
            setRole(profileData.user_role as UserRole || 'public');
          }
        } else {
          console.log('useUserRole - RPC query successful:', rpcData);
          setRole(rpcData as UserRole);
        }
      } catch (error) {
        console.error('useUserRole - Unexpected error:', error);
        setRole('public'); // Default fallback
      } finally {
        setLoading(false);
      }
    };

    // Add small delay to ensure session is fully established
    if (user && session) {
      const timeoutId = setTimeout(fetchUserRole, 100);
      return () => clearTimeout(timeoutId);
    } else {
      fetchUserRole();
    }
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
