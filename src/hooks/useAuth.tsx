import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Function to prefetch user role and permissions with improved error handling
  const prefetchUserData = async (userId: string) => {
    if (!userId) return;

    try {
      console.log('🔄 [prefetchUserData] Starting prefetch for user:', userId);
      
      // Prefetch user role
      const { data: role, error: roleError } = await supabase.rpc('get_user_role', {
        _user_id: userId
      });
      
      if (roleError) {
        console.error('🔄 [prefetchUserData] Error fetching role:', roleError);
        return;
      }
      
      console.log('🔄 [prefetchUserData] Role fetched:', role);
      
      // Cache the role in React Query
      queryClient.setQueryData(['userRole', userId], role);
      
      // If role is admin or employee, prefetch permissions
      if (role === 'admin' || role === 'employee') {
        let permissions = {};
        
        if (role === 'admin') {
          // Admin has all permissions
          permissions = {
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
          console.log('🔄 [prefetchUserData] Admin permissions set:', permissions);
        } else if (role === 'employee') {
          // Fetch employee permissions
          console.log('🔄 [prefetchUserData] Fetching employee permissions');
          const { data, error: permError } = await supabase
            .from('user_section_permissions')
            .select('section, has_access')
            .eq('user_id', userId);
            
          if (permError) {
            console.error('🔄 [prefetchUserData] Error fetching permissions:', permError);
          } else if (data) {
            const userPermissions: Record<string, boolean> = {};
            data.forEach((perm) => {
              userPermissions[perm.section] = perm.has_access;
            });
            permissions = userPermissions;
            console.log('🔄 [prefetchUserData] Employee permissions fetched:', permissions);
          }
        }
        
        // Cache the permissions
        queryClient.setQueryData(['userPermissions', userId, role], permissions);
      }
    } catch (err) {
      console.error("🔄 [prefetchUserData] Error prefetching user data:", err);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 [AuthProvider] Auth state change:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check if this is a sign-in event and not an initial page load
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('🔐 [AuthProvider] User signed in, prefetching data');
          
          // Use setTimeout to prevent auth state deadlock
          setTimeout(async () => {
            // Prefetch user role and permissions
            await prefetchUserData(session.user.id);
            
            // Don't redirect if already on admin page
            if (window.location.pathname.startsWith('/admin')) {
              return;
            }
            
            try {
              // Check if user has admin access
              const { data: role } = await supabase.rpc('get_user_role', {
                _user_id: session.user.id
              });
              
              console.log('🔐 [AuthProvider] User role for redirect check:', role);
              
              if (role === 'admin' || role === 'employee') {
                // Check if we have a redirect stored
                const redirectPath = sessionStorage.getItem('redirectAfterLogin');
                console.log('🔐 [AuthProvider] Redirect path found:', redirectPath);
                
                // Only redirect if we have a path AND it's to an admin route
                if (redirectPath && redirectPath.startsWith('/admin')) {
                  // Add a safety check to prevent redirect loops
                  const hasRedirectParam = new URL(window.location.href).searchParams.has('noRedirect');
                  
                  if (!hasRedirectParam) {
                    console.log('🔐 [AuthProvider] Redirecting to:', redirectPath);
                    sessionStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectPath;
                  } else {
                    console.log('🔐 [AuthProvider] Redirect prevented by noRedirect param');
                  }
                } else {
                  console.log('🔐 [AuthProvider] No valid redirect path');
                }
              }
            } catch (err) {
              console.error("🔐 [AuthProvider] Error checking user role:", err);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log('🔐 [AuthProvider] User signed out, clearing cache');
          // Clear cached auth data on sign out
          queryClient.removeQueries({ queryKey: ['userRole'] });
          queryClient.removeQueries({ queryKey: ['userPermissions'] });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 [AuthProvider] Initial session check:', session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Prefetch data if user is already logged in
      if (session?.user) {
        console.log('🔐 [AuthProvider] Initial user found, prefetching data');
        prefetchUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  // Let's add a debugging function to help diagnose issues
  const logAuthState = () => {
    console.log("Auth state:", { 
      user: user?.id,
      role: queryClient.getQueryData(['userRole', user?.id]),
      redirectPath: sessionStorage.getItem('redirectAfterLogin')
    });
  };
  
  // Log auth state changes for debugging
  useEffect(() => {
    if (!loading) {
      logAuthState();
    }
  }, [loading, user]);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });
    return { error };
  };

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      }
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      }
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithMagicLink,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
