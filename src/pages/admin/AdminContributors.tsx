
import { useState, useEffect } from 'react';
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
  Star, 
  StarOff,
  Users,
  Building,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ContributorForm from '@/components/admin/ContributorForm';
import BulkActions from '@/components/admin/BulkActions';

const AdminContributors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContributors, setSelectedContributors] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContributor, setEditingContributor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch contributors with search and pagination
  const { data: contributorsData, isLoading } = useQuery({
    queryKey: ['contributors', searchTerm, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('contributors')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,organization.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { contributors: data || [], total: count || 0 };
    }
  });

  // Delete contributor mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contributors')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributors'] });
      toast({ title: 'Contributor deleted successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting contributor', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      const updates = {
        is_featured: !isFeatured,
        featured_until: !isFeatured ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
      };

      const { error } = await supabase
        .from('contributors')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributors'] });
      toast({ title: 'Featured status updated' });
    }
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('contributors')
        .delete()
        .in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributors'] });
      setSelectedContributors([]);
      toast({ title: `${selectedContributors.length} contributors deleted` });
    }
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContributors(contributorsData?.contributors.map(c => c.id) || []);
    } else {
      setSelectedContributors([]);
    }
  };

  const handleSelectContributor = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedContributors([...selectedContributors, id]);
    } else {
      setSelectedContributors(selectedContributors.filter(cId => cId !== id));
    }
  };

  const totalPages = Math.ceil((contributorsData?.total || 0) / pageSize);

  return (
    <AdminLayout requiredRole="content_manager">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contributors Management</h1>
            <p className="text-gray-600 mt-2">Manage policy experts and contributors</p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingContributor(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contributor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingContributor ? 'Edit Contributor' : 'Add New Contributor'}
                </DialogTitle>
              </DialogHeader>
              <ContributorForm
                contributor={editingContributor}
                onClose={() => {
                  setShowForm(false);
                  setEditingContributor(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contributors ({contributorsData?.total || 0})
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search contributors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedContributors.length > 0 && (
              <BulkActions
                selectedCount={selectedContributors.length}
                onBulkDelete={() => bulkDeleteMutation.mutate(selectedContributors)}
                onBulkFeature={() => {
                  // Implementation for bulk feature toggle
                }}
              />
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedContributors.length === contributorsData?.contributors.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading contributors...
                      </TableCell>
                    </TableRow>
                  ) : contributorsData?.contributors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No contributors found
                      </TableCell>
                    </TableRow>
                  ) : (
                    contributorsData?.contributors.map((contributor) => (
                      <TableRow key={contributor.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedContributors.includes(contributor.id)}
                            onCheckedChange={(checked) => 
                              handleSelectContributor(contributor.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {contributor.headshot_url ? (
                              <img
                                src={contributor.headshot_url} 
                                alt={contributor.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <Users className="h-4 w-4 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{contributor.name}</div>
                              {contributor.institution && (
                                <div className="text-sm text-gray-500">{contributor.institution}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            {contributor.organization || 'Not specified'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {contributor.email || 'Not provided'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {contributor.is_featured && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(contributor.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFeaturedMutation.mutate({
                                id: contributor.id,
                                isFeatured: contributor.is_featured
                              })}
                            >
                              {contributor.is_featured ? (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              ) : (
                                <Star className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingContributor(contributor);
                                setShowForm(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this contributor?')) {
                                  deleteMutation.mutate(contributor.id);
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

export default AdminContributors;
