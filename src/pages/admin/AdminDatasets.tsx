import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Database,
  Download,
  Eye,
  EyeOff,
  ExternalLink,
  Filter,
  Building,
  FileType,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface DatasetFormData {
  title: string;
  description: string;
  category: string;
  format: string;
  source_organization: string;
  external_url: string;
  is_public: boolean;
}

const AdminDatasets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingDataset, setEditingDataset] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue } = useForm<DatasetFormData>();

  const { data: datasetsData, isLoading } = useQuery({
    queryKey: ['admin-datasets', searchTerm, categoryFilter, formatFilter, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('datasets')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,source_organization.ilike.%${searchTerm}%`);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (formatFilter !== 'all') {
        query = query.eq('format', formatFilter);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { datasets: data || [], total: count || 0 };
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: DatasetFormData) => {
      const { error } = await supabase
        .from('datasets')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-datasets'] });
      setShowForm(false);
      reset();
      toast({ title: 'Dataset created successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error creating dataset', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: DatasetFormData }) => {
      const { error } = await supabase
        .from('datasets')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-datasets'] });
      setShowForm(false);
      setEditingDataset(null);
      reset();
      toast({ title: 'Dataset updated successfully' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('datasets')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-datasets'] });
      toast({ title: 'Dataset deleted successfully' });
    }
  });

  const togglePublicMutation = useMutation({
    mutationFn: async ({ id, isPublic }: { id: string; isPublic: boolean }) => {
      const { error } = await supabase
        .from('datasets')
        .update({
          is_public: !isPublic,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-datasets'] });
      toast({ title: 'Dataset visibility updated' });
    }
  });

  const onSubmit = (data: DatasetFormData) => {
    if (editingDataset) {
      updateMutation.mutate({ id: editingDataset.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (dataset: any) => {
    setEditingDataset(dataset);
    setValue('title', dataset.title);
    setValue('description', dataset.description || '');
    setValue('category', dataset.category || '');
    setValue('format', dataset.format || '');
    setValue('source_organization', dataset.source_organization || '');
    setValue('external_url', dataset.external_url || '');
    setValue('is_public', dataset.is_public || false);
    setShowForm(true);
  };

  const categories = [
    'Government',
    'Healthcare',
    'Education',
    'Transportation',
    'Environment',
    'Economy',
    'Demographics',
    'Technology',
    'Research'
  ];

  const formats = [
    'CSV',
    'JSON',
    'XML',
    'PDF',
    'Excel',
    'API',
    'Database',
    'Other'
  ];

  const totalPages = Math.ceil((datasetsData?.total || 0) / pageSize);

  return (
    <AdminLayout requiredRole="content_manager">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Datasets Management</h1>
            <p className="text-gray-600 mt-2">Manage public datasets and data resources</p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingDataset(null);
                reset();
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Dataset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingDataset ? 'Edit Dataset' : 'Add New Dataset'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    {...register('title', { required: true })}
                    placeholder="Dataset title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    {...register('description')}
                    placeholder="Dataset description..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Format</label>
                    <Select onValueChange={(value) => setValue('format', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        {formats.map(format => (
                          <SelectItem key={format} value={format}>{format}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Source Organization</label>
                  <Input
                    {...register('source_organization')}
                    placeholder="Organization that provided the dataset"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">External URL</label>
                  <Input
                    {...register('external_url')}
                    placeholder="https://..."
                    type="url"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('is_public')}
                    id="public"
                    className="rounded"
                  />
                  <label htmlFor="public" className="text-sm font-medium">
                    Public (visible to all users)
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingDataset ? 'Update' : 'Add'} Dataset
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Datasets</p>
                  <p className="text-2xl font-bold">{datasetsData?.total || 0}</p>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Public</p>
                  <p className="text-2xl font-bold text-green-600">
                    {datasetsData?.datasets.filter(d => d.is_public).length || 0}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Private</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {datasetsData?.datasets.filter(d => !d.is_public).length || 0}
                  </p>
                </div>
                <EyeOff className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
                <FileType className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Datasets ({datasetsData?.total || 0})
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search datasets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={formatFilter} onValueChange={setFormatFilter}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    {formats.map(format => (
                      <SelectItem key={format} value={format}>{format}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dataset</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading datasets...
                      </TableCell>
                    </TableRow>
                  ) : datasetsData?.datasets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {searchTerm ? 'No datasets found matching your search.' : 'No datasets created yet.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    datasetsData?.datasets.map((dataset) => (
                      <TableRow key={dataset.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{dataset.title}</div>
                            {dataset.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {dataset.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {dataset.category && (
                            <Badge variant="outline">{dataset.category}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {dataset.format && (
                            <Badge variant="secondary">{dataset.format}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{dataset.source_organization || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={dataset.is_public ? "default" : "secondary"}>
                            {dataset.is_public ? 'Public' : 'Private'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(dataset.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {dataset.external_url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(dataset.external_url, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePublicMutation.mutate({
                                id: dataset.id,
                                isPublic: dataset.is_public
                              })}
                            >
                              {dataset.is_public ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(dataset)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this dataset?')) {
                                  deleteMutation.mutate(dataset.id);
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

export default AdminDatasets;