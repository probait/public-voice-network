
import { ReactNode, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserPermissions, AdminSection } from '@/hooks/useUserPermissions';
import { useUserRole } from '@/hooks/useUserRole';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";

interface ProtectedAdminRouteProps {
  children: ReactNode;
  requiredSection?: AdminSection;
}

const ProtectedAdminRoute = ({ 
  children, 
  requiredSection 
}: ProtectedAdminRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const { hasPermission, canAccessAdminPortal, loading: permissionsLoading } = useUserPermissions();
  const location = useLocation();
  const toastShownRef = useRef(false);

  // Show loading state while authentication, role, and permissions are being checked
  const isLoading = authLoading || roleLoading || permissionsLoading;

  // Debug logging
  useEffect(() => {
    console.log('🔐 [ProtectedAdminRoute] State check:', {
      path: location.pathname,
      user: user?.id,
      role,
      authLoading,
      roleLoading,
      permissionsLoading,
      isLoading,
      canAccessPortal: !isLoading ? canAccessAdminPortal() : 'loading',
      requiredSection,
      hasRequiredSection: requiredSection ? hasPermission(requiredSection) : 'no section required'
    });
  }, [user, role, authLoading, roleLoading, permissionsLoading, location.pathname, requiredSection]);

  // If loading, show a skeleton loader
  if (isLoading) {
    console.log('🔐 [ProtectedAdminRoute] Showing loading state');
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-16 bg-white border-b">
          <Skeleton className="h-full" />
        </div>
        <div className="flex h-[calc(100vh-4rem)]">
          <div className="w-64 bg-white border-r">
            <Skeleton className="h-full" />
          </div>
          <div className="flex-1 p-8">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User not authenticated, redirect to login
  if (!user) {
    console.log('🔐 [ProtectedAdminRoute] No user, redirecting to login');
    // Store current path for redirect after login
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/?showAuth=true" replace />;
  }

  // Check if user can access admin portal at all
  if (!canAccessAdminPortal()) {
    console.log('🔐 [ProtectedAdminRoute] User cannot access admin portal, redirecting home');
    if (!toastShownRef.current) {
      toast.error("You don't have permission to access the admin area");
      toastShownRef.current = true;
    }
    // Clear any redirect to prevent infinite loops
    sessionStorage.removeItem('redirectAfterLogin');
    return <Navigate to="/" replace />;
  }

  // If a specific section is required, check that permission
  if (requiredSection && !hasPermission(requiredSection)) {
    console.log('🔐 [ProtectedAdminRoute] User lacks required section permission:', requiredSection);
    if (!toastShownRef.current) {
      toast.error(`You don't have permission to access the ${requiredSection} section`);
      toastShownRef.current = true;
    }
    // Don't set redirect here - we're still in admin area
    return <Navigate to="/admin" replace />;
  }

  // User has the necessary permissions, render the requested route
  console.log('🔐 [ProtectedAdminRoute] Access granted, rendering children');
  return <>{children}</>;
};

export default ProtectedAdminRoute;
