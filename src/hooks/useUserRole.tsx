
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'moderator' | 'content_manager' | 'viewer' | null;

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
          setRole(data);
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
      admin: 4,
      moderator: 3,
      content_manager: 2,
      viewer: 1
    };
    
    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  const isAdmin = () => role === 'admin';
  const isModerator = () => hasRole('moderator');
  const isContentManager = () => hasRole('content_manager');

  return {
    role,
    loading,
    hasRole,
    isAdmin,
    isModerator,
    isContentManager
  };
};
