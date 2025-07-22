import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch site settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      setSiteName(data?.site_name || '');
      setSiteDescription(data?.site_description || '');
    },
  });

  // Update site settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('site_settings')
        .update({
          site_name: siteName,
          site_description: siteDescription,
        })
        .eq('id', settings?.id);

      if (error) {
        console.error('Error updating site settings:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Site settings updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update site settings.',
        variant: 'destructive',
      });
    },
  });

  const handleSaveSettings = async () => {
    updateSettingsMutation.mutate();
  };

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
            <Button onClick={handleSaveSettings} disabled={updateSettingsMutation.isPending}>
              {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminSettings;
