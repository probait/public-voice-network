import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Star, StarOff, Search, MessageSquare, Users } from 'lucide-react';
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
  created_at: string;
  updated_at: string;
}

const AdminThoughtsManagement = () => {
  const [submissions, setSubmissions] = useState<ThoughtsSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('thoughts_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch thoughts submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('thoughts_submissions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, status: newStatus } : sub
        )
      );

      toast({
        title: "Status updated",
        description: "Submission status has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('thoughts_submissions')
        .update({ featured: !currentFeatured })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, featured: !currentFeatured } : sub
        )
      );

      toast({
        title: currentFeatured ? "Unfeatured" : "Featured",
        description: `Thought ${currentFeatured ? 'removed from' : 'added to'} homepage`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Name',
      'Email', 
      'Province',
      'Category',
      'Subject',
      'Message',
      'Status',
      'Featured',
      'Submitted Date'
    ];

    const csvData = submissions.map(submission => [
      submission.name,
      submission.email,
      submission.province,
      submission.category,
      submission.subject,
      submission.message.replace(/"/g, '""'), // Escape quotes
      submission.status,
      submission.featured ? 'Yes' : 'No',
      new Date(submission.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `thoughts-submissions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export complete",
      description: "CSV file has been downloaded",
    });
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter(submission =>
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedSubmissions.length} submissions?`)) {
      try {
        const { error } = await supabase
          .from('thoughts_submissions')
          .delete()
          .in('id', selectedSubmissions);

        if (error) throw error;

        await fetchSubmissions();
        setSelectedSubmissions([]);
        toast({
          title: 'Success',
          description: `${selectedSubmissions.length} submissions deleted successfully`,
        });
      } catch (error) {
        console.error('Error deleting submissions:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete submissions',
          variant: 'destructive',
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
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
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                All Submissions ({filteredSubmissions.length})
              </CardTitle>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
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
                      <TableHead>Citizen</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Province</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Date</TableHead>
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
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{submission.name}</div>
                              <div className="text-sm text-gray-500">{submission.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{submission.subject}</div>
                            <div className="text-sm text-gray-500 truncate">{submission.message}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{submission.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{submission.province}</Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={submission.status}
                            onValueChange={(value) => updateStatus(submission.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
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
                              <StarOff className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          {new Date(submission.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminThoughtsManagement;