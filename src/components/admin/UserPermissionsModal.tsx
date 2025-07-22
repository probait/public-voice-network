
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { AdminSection } from '@/hooks/useUserPermissions';

interface UserPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const ADMIN_SECTIONS: { key: AdminSection; label: string; description: string }[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'View admin dashboard and analytics' },
  { key: 'articles', label: 'Articles', description: 'Manage articles and blog posts' },
  { key: 'contributors', label: 'Contributors', description: 'Manage contributors and authors' },
  { key: 'events', label: 'Events & Meetups', description: 'Manage events and meetups' },
  { key: 'thoughts', label: 'Citizen Thoughts', description: 'Review and manage thought submissions' },
  { key: 'partnerships', label: 'Partnerships', description: 'Manage partnership inquiries' },
  { key: 'newsletter', label: 'Newsletter', description: 'Manage newsletter settings and subscribers' },
  { key: 'users', label: 'User Management', description: 'Manage user roles and permissions' },
  { key: 'settings', label: 'Settings', description: 'Access admin settings' }
];

export const UserPermissionsModal = ({ isOpen, onClose, userId, userName }: UserPermissionsModalProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<AdminSection>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current permissions
  const { data: currentPermissions, isLoading } = useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_permissions', {
        user_id_param: userId
      });
      
      if (error) throw error;
      
      const permissions = new Set<AdminSection>();
      data?.forEach((perm: { section: string; has_access: boolean }) => {
        if (perm.has_access) {
          permissions.add(perm.section as AdminSection);
        }
      });
      
      return permissions;
    },
    enabled: isOpen && !!userId,
  });

  // Set selected permissions when data loads
  useState(() => {
    if (currentPermissions) {
      setSelectedPermissions(new Set(currentPermissions));
    }
  }, [currentPermissions]);

  const savePermissionsMutation = useMutation({
    mutationFn: async (permissions: Set<AdminSection>) => {
      // Delete existing permissions for this user
      await supabase
        .from('user_section_permissions')
        .delete()
        .eq('user_id', userId);

      // Insert new permissions
      if (permissions.size > 0) {
        const permissionRows = Array.from(permissions).map(section => ({
          user_id: userId,
          section,
          has_access: true
        }));

        const { error } = await supabase
          .from('user_section_permissions')
          .insert(permissionRows);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Success',
        description: 'User permissions updated successfully',
      });
      onClose();
    },
    onError: (error) => {
      console.error('Error updating permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user permissions',
        variant: 'destructive',
      });
    },
  });

  const handlePermissionChange = (section: AdminSection, checked: boolean) => {
    const newPermissions = new Set(selectedPermissions);
    if (checked) {
      newPermissions.add(section);
    } else {
      newPermissions.delete(section);
    }
    setSelectedPermissions(newPermissions);
  };

  const handleSave = () => {
    savePermissionsMutation.mutate(selectedPermissions);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">Loading permissions...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Permissions for {userName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select which admin sections this employee can access:
          </p>
          
          <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
            {ADMIN_SECTIONS.map((section) => (
              <div key={section.key} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={section.key}
                  checked={selectedPermissions.has(section.key)}
                  onCheckedChange={(checked) => handlePermissionChange(section.key, !!checked)}
                />
                <div className="flex-1">
                  <label htmlFor={section.key} className="font-medium cursor-pointer">
                    {section.label}
                  </label>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={savePermissionsMutation.isPending}
            >
              {savePermissionsMutation.isPending ? 'Saving...' : 'Save Permissions'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
