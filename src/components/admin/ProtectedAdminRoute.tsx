
import { ReactNode, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserPermissions, AdminSection } from '@/hooks/useUserPermissions';
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
  const { hasPermission, canAccessAdminPortal, loading: permissionsLoading } = useUserPermissions();
  const location = useLocation();
  const toastShownRef = useRef(false);

  // Show loading state while authentication and permissions are being checked
  const isLoading = authLoading || permissionsLoading;

  // If loading, show a skeleton loader
  if (isLoading) {
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
    // Store current path for redirect after login
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/?showAuth=true" replace />;
  }

  // Check if user can access admin portal at all
  if (!canAccessAdminPortal()) {
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
    if (!toastShownRef.current) {
      toast.error(`You don't have permission to access the ${requiredSection} section`);
      toastShownRef.current = true;
    }
    // Don't set redirect here - we're still in admin area
    return <Navigate to="/admin" replace />;
  }

  // User has the necessary permissions, render the requested route
  return <>{children}</>;
};

export default ProtectedAdminRoute;
