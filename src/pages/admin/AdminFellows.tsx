import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  GraduationCap,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FellowForm from '@/components/admin/FellowForm';
import BulkActions from '@/components/admin/BulkActions';

const AdminFellows = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFellows, setSelectedFellows] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFellow, setEditingFellow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch fellows with search and pagination
  const { data: fellowsData, isLoading } = useQuery({
    queryKey: ['fellows', searchTerm, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('fellows')
        .select(`
          *,
          contributors:contributor_id (
            name,
            email
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (searchTerm) {
        query = query.or(`program_description.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { fellows: data || [], total: count || 0 };
    }
  });

  // Delete fellow mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('fellows')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fellows'] });
      toast({ title: 'Fellow deleted successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting fellow', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  // Toggle current status mutation
  const toggleCurrentMutation = useMutation({
    mutationFn: async ({ id, isCurrent }: { id: string; isCurrent: boolean }) => {
      const { error } = await supabase
        .from('fellows')
        .update({ is_current: !isCurrent })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fellows'] });
      toast({ title: 'Current status updated' });
    }
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('fellows')
        .delete()
        .in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fellows'] });
      setSelectedFellows([]);
      toast({ title: `${selectedFellows.length} fellows deleted` });
    }
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFellows(fellowsData?.fellows.map(f => f.id) || []);
    } else {
      setSelectedFellows([]);
    }
  };

  const handleSelectFellow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedFellows([...selectedFellows, id]);
    } else {
      setSelectedFellows(selectedFellows.filter(fId => fId !== id));
    }
  };

  const totalPages = Math.ceil((fellowsData?.total || 0) / pageSize);

  return (
    <AdminLayout requiredSection="contributors">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fellows Management</h1>
            <p className="text-gray-600 mt-2">Manage fellowship programs and participants</p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingFellow(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Fellow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingFellow ? 'Edit Fellow' : 'Add New Fellow'}
                </DialogTitle>
              </DialogHeader>
              <FellowForm
                fellow={editingFellow}
                onClose={() => {
                  setShowForm(false);
                  setEditingFellow(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Fellows ({fellowsData?.total || 0})
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search fellows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedFellows.length > 0 && (
              <BulkActions
                selectedCount={selectedFellows.length}
                onBulkDelete={() => bulkDeleteMutation.mutate(selectedFellows)}
              />
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedFellows.length === fellowsData?.fellows.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Contributor</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading fellows...
                      </TableCell>
                    </TableRow>
                  ) : fellowsData?.fellows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No fellows found
                      </TableCell>
                    </TableRow>
                  ) : (
                    fellowsData?.fellows.map((fellow) => (
                      <TableRow key={fellow.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedFellows.includes(fellow.id)}
                            onCheckedChange={(checked) => 
                              handleSelectFellow(fellow.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {fellow.contributors?.name || 'No Contributor'}
                              </div>
                              {fellow.contributors?.email && (
                                <div className="text-sm text-gray-500">{fellow.contributors.email}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="truncate">
                              {fellow.program_description || 'No description'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {fellow.start_date && fellow.end_date ? (
                              <>
                                {new Date(fellow.start_date).toLocaleDateString()} - {new Date(fellow.end_date).toLocaleDateString()}
                              </>
                            ) : fellow.start_date ? (
                              <>From {new Date(fellow.start_date).toLocaleDateString()}</>
                            ) : (
                              'Not specified'
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={fellow.is_current ? "default" : "secondary"}>
                              {fellow.is_current ? "Current" : "Former"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(fellow.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCurrentMutation.mutate({
                                id: fellow.id,
                                isCurrent: fellow.is_current
                              })}
                            >
                              {fellow.is_current ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingFellow(fellow);
                                setShowForm(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this fellow?')) {
                                  deleteMutation.mutate(fellow.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFellows;