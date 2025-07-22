import { useState } from 'react';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminThoughts = () => {
  return (
    <ProtectedAdminRoute requiredSection="thoughts">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Thoughts Management</h1>
          <Button>
            Add Thought
          </Button>
        </div>
        
        <div className="text-center p-8 text-gray-500">
          Thoughts management coming soon...
        </div>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminThoughts;