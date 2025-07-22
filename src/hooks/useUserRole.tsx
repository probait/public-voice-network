
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'employee' | 'public' | null;

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: role = null, isLoading: loading } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async (): Promise<UserRole> => {
      if (!user) {
        return null;
      }

      try {
        const { data, error } = await supabase.rpc('get_user_role', {
          _user_id: user.id
        });

        if (error) {
          console.error('Error fetching user role:', error);
          return null;
        }
        
        return data as UserRole;
      } catch (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
    },
    // Cache role for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Don't refetch on window focus for roles
    refetchOnWindowFocus: false,
    // Only fetch when we have a user
    enabled: !!user,
  });

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
