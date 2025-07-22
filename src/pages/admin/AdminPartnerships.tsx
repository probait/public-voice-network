import { useState } from 'react';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminPartnerships = () => {
  return (
    <ProtectedAdminRoute requiredSection="partnerships">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Partnerships Management</h1>
          <Button>
            Create Partnership
          </Button>
        </div>
        
        <div className="text-center p-8 text-gray-500">
          Partnerships management coming soon...
        </div>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminPartnerships;