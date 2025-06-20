
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPrompts = () => {
  return (
    <AdminLayout requiredRole="content_manager">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Prompts Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Prompts management functionality coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPrompts;
