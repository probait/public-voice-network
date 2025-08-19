import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Download, Star, StarOff, Search, MessageSquare, Users, Edit2, Trash2, Filter } from 'lucide-react';
import BulkActions from '@/components/admin/BulkActions';

interface ThoughtsSubmission {
  id: string;
  name: string;
  email: string;
  province: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  featured: boolean;
  source: string;
  created_at: string;
  updated_at: string;
}



const AdminThoughtsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [orderBy, setOrderBy] = useState('created_at');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [viewingSubmission, setViewingSubmission] = useState<ThoughtsSubmission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch submissions with direct query
  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ['admin-thoughts', currentPage, pageSize, searchTerm, featuredFilter, categoryFilter, provinceFilter, orderBy, orderDirection],
    queryFn: async () => {
      let query = supabase
        .from('thoughts_submissions')
        .select('*', { count: 'exact' });

      // Apply filters
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }
      if (featuredFilter === 'featured') {
        query = query.eq('featured', true);
      } else if (featuredFilter === 'not-featured') {
        query = query.eq('featured', false);
      }
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }
      if (provinceFilter !== 'all') {
        query = query.eq('province', provinceFilter);
      }

      // Apply sorting and pagination
      query = query
        .order(orderBy, { ascending: orderDirection === 'asc' })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      
      return { submissions: data || [], totalSubmissions: count || 0 };
    },
  });

  // Fetch filter options
  const { data: filterOptions } = useQuery({
    queryKey: ['admin-thoughts-filters'],
    queryFn: async () => {
      const [categoriesRes, provincesRes] = await Promise.all([
        supabase.from('thoughts_submissions').select('category').not('category', 'is', null),
        supabase.from('thoughts_submissions').select('province').not('province', 'is', null)
      ]);

      const categories = [...new Set(categoriesRes.data?.map(item => item.category) || [])];
      const provinces = [...new Set(provincesRes.data?.map(item => item.province) || [])];

      return { categories, provinces };
    },
  });

  const submissions = submissionsData?.submissions || [];
  const totalSubmissions = submissionsData?.totalSubmissions || 0;

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from('thoughts_submissions')
        .update({ featured })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-thoughts'] });
      toast({
        title: 'Success',
        description: 'Featured status updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update featured status',
        variant: 'destructive',
      });
      console.error('Error updating featured status:', error);
    },
  });

  // Feature next batch mutation
  const featureNextBatchMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('thoughts_submissions')
        .select('id')
        .eq('source', 'voices_csv')
        .eq('featured', false)
        .gte('message.length()', 100)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const ids = data.map(item => item.id);
        const { error: updateError } = await supabase
          .from('thoughts_submissions')
          .update({ featured: true })
          .in('id', ids);
        
        if (updateError) throw updateError;
        return ids.length;
      }
      return 0;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['admin-thoughts'] });
      toast({
        title: 'Success',
        description: `Featured ${count} submissions`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to feature submissions',
        variant: 'destructive',
      });
      console.error('Error featuring submissions:', error);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('thoughts_submissions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-thoughts'] });
      toast({
        title: 'Success',
        description: 'Submission deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete submission',
        variant: 'destructive',
      });
      console.error('Error deleting submission:', error);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('thoughts_submissions')
        .delete()
        .in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-thoughts'] });
      toast({
        title: 'Success',
        description: 'Submissions deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete submissions',
        variant: 'destructive',
      });
      console.error('Error deleting submissions:', error);
    },
  });

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: async (filters: any) => {
      let query = supabase.from('thoughts_submissions').select('*');

      // Apply same filters as main query
      if (filters.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%,subject.ilike.%${filters.searchTerm}%,message.ilike.%${filters.searchTerm}%`);
      }
      if (filters.featuredFilter === 'featured') {
        query = query.eq('featured', true);
      } else if (filters.featuredFilter === 'not-featured') {
        query = query.eq('featured', false);
      }
      if (filters.categoryFilter !== 'all') {
        query = query.eq('category', filters.categoryFilter);
      }
      if (filters.provinceFilter !== 'all') {
        query = query.eq('province', filters.provinceFilter);
      }

      query = query.order(filters.orderBy, { ascending: filters.orderDirection === 'asc' });

      const { data, error } = await query;
      if (error) throw error;

      // Create CSV content
      const headers = ['Name', 'Email', 'Province', 'Category', 'Subject', 'Message', 'Featured', 'Source', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...(data || []).map(row => [
          `"${row.name.replace(/"/g, '""')}"`,
          `"${row.email.replace(/"/g, '""')}"`,
          `"${row.province.replace(/"/g, '""')}"`,
          `"${row.category.replace(/"/g, '""')}"`,
          `"${row.subject.replace(/"/g, '""')}"`,
          `"${row.message.replace(/"/g, '""')}"`,
          row.featured ? 'Yes' : 'No',
          `"${row.source.replace(/"/g, '""')}"`,
          new Date(row.created_at).toISOString()
        ].join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `thoughts_submissions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Export completed successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      });
      console.error('Error exporting data:', error);
    },
  });

  const toggleFeatured = (id: string, currentFeatured: boolean) => {
    toggleFeaturedMutation.mutate({ id, featured: !currentFeatured });
  };

  const featureNextBatch = () => {
    featureNextBatchMutation.mutate();
  };

  const exportToCSV = () => {
    exportMutation.mutate({
      searchTerm,
      featuredFilter,
      categoryFilter,
      provinceFilter,
      orderBy,
      orderDirection
    });
  };

  useEffect(() => {
    if (searchTerm || featuredFilter !== 'all' || categoryFilter !== 'all' || provinceFilter !== 'all') {
      setCurrentPage(1);
    }
  }, [searchTerm, featuredFilter, categoryFilter, provinceFilter]);

  const filteredSubmissions = submissions;
  const totalPages = Math.ceil(totalSubmissions / pageSize);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(filteredSubmissions.map(s => s.id));
    } else {
      setSelectedSubmissions([]);
    }
  };

  const handleSelectSubmission = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedSubmissions([...selectedSubmissions, id]);
    } else {
      setSelectedSubmissions(selectedSubmissions.filter(sId => sId !== id));
    }
  };

  const handleEdit = (submission: ThoughtsSubmission) => {
    setViewingSubmission(submission);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedSubmissions.length} submissions?`)) {
      bulkDeleteMutation.mutate(selectedSubmissions);
      setSelectedSubmissions([]);
    }
  };


  if (isLoading) {
    return (
      <AdminLayout requiredRole="admin">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Thoughts Management</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thoughts Management</h1>
            <p className="text-gray-600 mt-2">Manage citizen submissions and feature them on the homepage</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={featureNextBatch} disabled={featureNextBatchMutation.isPending} className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              {featureNextBatchMutation.isPending ? 'Featuring…' : 'Feature next 100'}
            </Button>
            <Button onClick={exportToCSV} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  All Submissions ({totalSubmissions})
                </CardTitle>
              </div>
              
              {/* Search Row */}
              <div className="w-full">
                <div className="relative max-w-md">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
              
              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-3">
                <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                  <SelectTrigger className="w-36">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="not-featured">Not Featured</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {filterOptions?.categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="All Provinces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    {filterOptions?.provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={`${orderBy}-${orderDirection}`} onValueChange={(value) => {
                  const [field, direction] = value.split('-');
                  setOrderBy(field);
                  setOrderDirection(direction as 'asc' | 'desc');
                }}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Newest First" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at-desc">Newest First</SelectItem>
                    <SelectItem value="created_at-asc">Oldest First</SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                    <SelectItem value="subject-asc">Subject A-Z</SelectItem>
                    <SelectItem value="subject-desc">Subject Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedSubmissions.length > 0 && (
              <BulkActions
                selectedCount={selectedSubmissions.length}
                onBulkDelete={handleBulkDelete}
                onClearSelection={() => setSelectedSubmissions([])}
              />
            )}

            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'No submissions found matching your search.' : 'No thoughts submitted yet.'}
                </p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedSubmissions.length === filteredSubmissions.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                       <TableHead className="min-w-[200px]">Citizen</TableHead>
                       <TableHead className="min-w-[200px]">Subject</TableHead>
                       <TableHead className="min-w-[120px]">Category</TableHead>
                       <TableHead className="min-w-[120px]">Province</TableHead>
                       <TableHead className="min-w-[100px]">Date</TableHead>
                       <TableHead className="min-w-[80px]">Featured</TableHead>
                       <TableHead className="min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedSubmissions.includes(submission.id)}
                            onCheckedChange={(checked) => 
                              handleSelectSubmission(submission.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{submission.name}</div>
                              <div className="text-sm text-gray-500 truncate">{submission.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{submission.subject}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{submission.message}</div>
                          </div>
                        </TableCell>
                         <TableCell>
                           <Badge variant="outline">{submission.category}</Badge>
                         </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{submission.province}</Badge>
                          </TableCell>
                         <TableCell>
                           {new Date(submission.created_at).toLocaleDateString()}
                         </TableCell>
                         <TableCell>
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => toggleFeatured(submission.id, submission.featured)}
                             className="hover:bg-yellow-50"
                           >
                              {submission.featured ? (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              ) : (
                                <Star className="h-4 w-4 text-gray-400" />
                              )}
                           </Button>
                         </TableCell>
                         <TableCell>
                           <div className="flex items-center space-x-2">
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => handleEdit(submission)}
                             >
                               <Edit2 className="h-4 w-4" />
                             </Button>
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => handleDelete(submission.id)}
                               className="text-red-600 hover:text-red-700"
                             >
                               <Trash2 className="h-4 w-4" />
                             </Button>
                           </div>
                         </TableCell>
                       </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            )}

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

        {/* Detail Dialog */}
        <Dialog open={!!viewingSubmission} onOpenChange={() => setViewingSubmission(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thought Submission Details</DialogTitle>
            </DialogHeader>
            {viewingSubmission && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <div className="p-3 bg-gray-50 rounded-md">{viewingSubmission.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="p-3 bg-gray-50 rounded-md">{viewingSubmission.email}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Province</label>
                    <div className="p-3 bg-gray-50 rounded-md">{viewingSubmission.province}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <div className="p-3 bg-gray-50 rounded-md">{viewingSubmission.category}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <div className="p-3 bg-gray-50 rounded-md font-medium">{viewingSubmission.subject}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {viewingSubmission.message}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <Badge variant={viewingSubmission.featured ? "default" : "secondary"}>
                      {viewingSubmission.featured ? 'Featured' : 'Not Featured'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Submitted on {new Date(viewingSubmission.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => toggleFeatured(viewingSubmission.id, viewingSubmission.featured)}
                    >
                      {viewingSubmission.featured ? (
                        <>
                          <StarOff className="h-4 w-4 mr-2" />
                          Unfeature
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          Feature
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDelete(viewingSubmission.id);
                        setViewingSubmission(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminThoughtsManagement;
