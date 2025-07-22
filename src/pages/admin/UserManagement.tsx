import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableHead 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MoreVertical, 
  Edit, 
  Trash, 
  Search,
  Copy
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { UserPermissionsModal } from '@/components/admin/UserPermissionsModal';

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  role: string | null;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id, email, full_name, created_at');

      if (searchTerm) {
        query = query.ilike('full_name', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        data.map(async (user) => {
          const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .limit(1)
            .single();

          if (rolesError) {
            console.error('Error fetching role for user:', user.id, rolesError);
            return { ...user, role: null };
          }

          return { ...user, role: rolesData?.role || null };
        })
      );

      return usersWithRoles;
    },
  });

  const { mutate: updateUserRole, isLoading: isUpdatingRole } = useMutation(
    async ({ userId, role }: { userId: string; role: string | null }) => {
      // Delete existing roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        throw new Error(`Error deleting existing roles: ${deleteError.message}`);
      }

      if (role) {
        // Insert the new role
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role }]);

        if (insertError) {
          throw new Error(`Error assigning role: ${insertError.message}`);
        }
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        toast({
          title: 'Success',
          description: 'User role updated successfully',
        });
      },
      onError: (error: any) => {
        console.error('Error updating user role:', error);
        toast({
          title: 'Error',
          description: 'Failed to update user role',
          variant: 'destructive',
        });
      },
    }
  );

  const handleRoleChange = async (userId: string, role: string | null) => {
    await updateUserRole({ userId, role });
  };

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleCopyUserId = (userId: string) => {
    navigator.clipboard.writeText(userId);
    toast({
      title: 'Copied!',
      description: 'User ID copied to clipboard.',
    });
  };

  return (
    <ProtectedAdminRoute adminOnly={true}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Users</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">Loading...</TableCell>
                  </TableRow>
                ) : users?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">No users found.</TableCell>
                  </TableRow>
                ) : (
                  users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select value={user.role || 'public'} onValueChange={(role) => handleRoleChange(user.id, role)}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="">No Role</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenModal(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Permissions</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyUserId(user.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              <span>Copy User ID</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedUser && (
          <UserPermissionsModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            userId={selectedUser.id}
            userName={selectedUser.full_name}
          />
        )}
      </div>
    </ProtectedAdminRoute>
  );
};

export default UserManagement;
