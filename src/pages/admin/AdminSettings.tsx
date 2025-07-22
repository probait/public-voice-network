import { useState } from 'react';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AdminSettings = () => {
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');

  return (
    <ProtectedAdminRoute adminOnly={true}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="AI Canada Voice"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                placeholder="Connecting AI enthusiasts and concerned citizens..."
              />
            </div>
            <Button>
              Save Settings
            </Button>
            <div className="text-center p-8 text-gray-500">
              Settings management coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminSettings;