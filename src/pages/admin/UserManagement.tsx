
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Settings } from 'lucide-react';
import { UserPermissionsModal } from '@/components/admin/UserPermissionsModal';

interface UserWithRole {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
  current_role: string | null;
  permissions_count?: number;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [permissionsModal, setPermissionsModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
  }>({ isOpen: false, userId: '', userName: '' });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async () => {
      // Get profiles with their roles and permission counts
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          created_at,
          user_role
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data: profiles, error } = await query;
      if (error) throw error;

      // Get permission counts for employees
      const employeeIds = profiles?.filter(p => p.user_role === 'employee').map(p => p.id) || [];
      
      let permissionCounts: { [userId: string]: number } = {};
      if (employeeIds.length > 0) {
        const { data: permissions, error: permError } = await supabase
          .from('user_section_permissions')
          .select('user_id')
          .in('user_id', employeeIds)
          .eq('has_access', true);

        if (!permError) {
          permissionCounts = permissions.reduce((acc, perm) => {
            acc[perm.user_id] = (acc[perm.user_id] || 0) + 1;
            return acc;
          }, {} as { [userId: string]: number });
        }
      }

      // Transform the data to match our interface
      const usersWithRoles = (profiles || []).map((profile: any) => ({
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        created_at: profile.created_at,
        current_role: profile.user_role || null,
        permissions_count: permissionCounts[profile.id] || 0
      }));

      return usersWithRoles as UserWithRole[];
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string | null }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ user_role: role as any })
        .eq('id', userId);
      
      if (error) throw error;
      return { userId, role };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });

      // Auto-open permissions modal when assigning employee role
      if (data.role === 'employee') {
        const user = users?.find(u => u.id === data.userId);
        if (user) {
          setPermissionsModal({
            isOpen: true,
            userId: data.userId,
            userName: user.full_name || user.email
          });
        }
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
      console.error('Error updating user role:', error);
    },
  });

  const handleAssignRole = (userId: string, role: string) => {
    const roleValue = role === 'remove' ? null : role;
    assignRoleMutation.mutate({ userId, role: roleValue });
  };

  const handleConfigurePermissions = (userId: string, userName: string) => {
    setPermissionsModal({
      isOpen: true,
      userId,
      userName
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'employee': return 'bg-blue-100 text-blue-800';
      case 'public': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissionSummary = (user: UserWithRole) => {
    if (user.current_role === 'admin') {
      return <Badge className="bg-green-100 text-green-800">Full Access</Badge>;
    }
    if (user.current_role === 'employee') {
      if (user.permissions_count === 0) {
        return <Badge variant="outline" className="text-yellow-600">No Permissions</Badge>;
      }
      return <Badge variant="outline">{user.permissions_count} sections</Badge>;
    }
    return null;
  };

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">
                          {user.full_name || 'Unknown User'}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.current_role ? (
                          <Badge className={getRoleBadgeColor(user.current_role)}>
                            {user.current_role.replace('_', ' ')}
                          </Badge>
                        ) : (
                          <Badge variant="outline">No Role</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {getPermissionSummary(user)}
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Select
                            value=""
                            onValueChange={(role) => {
                              handleAssignRole(user.id, role);
                            }}
                          >
                            <SelectTrigger className="w-44">
                              <SelectValue placeholder={user.current_role ? "Change role" : "Assign role"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="employee">Employee</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              {user.current_role && (
                                <SelectItem value="remove" className="text-red-600">
                                  Remove Role
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          
                          {user.current_role === 'employee' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConfigurePermissions(user.id, user.full_name || user.email)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <UserPermissionsModal
          isOpen={permissionsModal.isOpen}
          onClose={() => setPermissionsModal({ isOpen: false, userId: '', userName: '' })}
          userId={permissionsModal.userId}
          userName={permissionsModal.userName}
        />
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
