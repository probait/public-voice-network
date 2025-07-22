
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePermissionStore } from "@/hooks/usePermissionStore";
import { AdminSection } from "@/hooks/useUserPermissions";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredSection?: AdminSection;
}

const ProtectedAdminRoute = ({ children, requiredSection }: ProtectedAdminRouteProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const { data: accessRights, isLoading } = usePermissionStore();

  // Show loading skeleton while permissions are being fetched
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

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user has required access
  const hasAccess = accessRights?.role === 'admin' || 
    (accessRights?.role === 'employee' && (!requiredSection || accessRights.permissions[requiredSection]));

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
