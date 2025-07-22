
import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useUserPermissions, AdminSection } from '@/hooks/useUserPermissions';
import ProtectedAdminRoute from './ProtectedAdminRoute';

interface AdminLayoutProps {
  children: ReactNode;
  requiredSection?: AdminSection;
}

const AdminLayout = ({ children, requiredSection }: AdminLayoutProps) => {
  return (
    <ProtectedAdminRoute requiredSection={requiredSection}>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex h-[calc(100vh-4rem)]">
          <AdminSidebar />
          <div className="flex-1 overflow-auto">
            <main className="p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminLayout;
