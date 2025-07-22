
import React, { useState, useEffect } from 'react';
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
import { Download, Search, Building2, Edit2, Trash2, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';
import BulkActions from '@/components/admin/BulkActions';
import { usePartnershipInquiries, PartnershipInquiry } from '@/hooks/usePartnershipInquiries';

const AdminPartnerships = () => {
  const [totalInquiries, setTotalInquiries] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [organizationTypeFilter, setOrganizationTypeFilter] = useState('all');
  const [orderBy, setOrderBy] = useState('created_at');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);
  const [viewingInquiry, setViewingInquiry] = useState<PartnershipInquiry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const { 
    inquiries, 
    loading, 
    fetchInquiries, 
    updateInquiryStatus, 
    deleteInquiry, 
    bulkDelete 
  } = usePartnershipInquiries();
  
  const { toast } = useToast();

  const loadInquiries = async () => {
    const result = await fetchInquiries({
      search: searchTerm,
      status: statusFilter,
      organizationType: organizationTypeFilter,
      orderBy,
      orderDirection,
      page: currentPage,
      pageSize
    });
    setTotalInquiries(result.count);
  };

  useEffect(() => {
    loadInquiries();
  }, [currentPage, searchTerm, statusFilter, organizationTypeFilter, orderBy, orderDirection]);

  // Reset to first page when filters change
  useEffect(() => {
    if (searchTerm || statusFilter !== 'all' || organizationTypeFilter !== 'all') {
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, organizationTypeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'in_progress':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const exportToCSV = async () => {
    try {
      // Fetch ALL inquiries for export (not just current page)
      let query = supabase
        .from('partnership_inquiries')
        .select('*');

      // Apply the same filters that are currently active
      if (searchTerm) {
        query = query.or(`contact_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,organization_name.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (organizationTypeFilter !== 'all') {
        query = query.eq('organization_type', organizationTypeFilter);
      }

      // Apply ordering
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });

      const { data: allInquiries, error } = await query;

      if (error) throw error;

      const headers = [
        'Organization Name',
        'Contact Name',
        'Email',
        'Phone',
        'Organization Type',
        'Status',
        'Message',
        'Submitted Date'
      ];

      const csvData = (allInquiries || []).map(inquiry => [
        inquiry.organization_name,
        inquiry.contact_name,
        inquiry.email,
        inquiry.phone || '',
        inquiry.organization_type,
        inquiry.status || 'new',
        inquiry.message.replace(/"/g, '""'), // Escape quotes
        new Date(inquiry.created_at).toLocaleDateString()
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `partnership-inquiries-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export complete",
        description: `CSV file with ${csvData.length} partnership inquiries has been downloaded`,
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the CSV file",
        variant: "destructive",
      });
    }
  };

  const totalPages = Math.ceil(totalInquiries / pageSize);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInquiries(inquiries.map(i => i.id));
    } else {
      setSelectedInquiries([]);
    }
  };

  const handleSelectInquiry = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedInquiries([...selectedInquiries, id]);
    } else {
      setSelectedInquiries(selectedInquiries.filter(iId => iId !== id));
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateInquiryStatus(id, newStatus);
    await loadInquiries(); // Refresh the list
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this partnership inquiry?')) {
      await deleteInquiry(id);
      await loadInquiries(); // Refresh the list
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedInquiries.length} partnership inquiries?`)) {
      await bulkDelete(selectedInquiries);
      setSelectedInquiries([]);
      await loadInquiries(); // Refresh the list
    }
  };

  if (loading && inquiries.length === 0) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Partnership Inquiries</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partnership Inquiries</h1>
            <p className="text-gray-600 mt-2">Manage partnership inquiries from organizations</p>
          </div>
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  All Inquiries ({totalInquiries})
                </CardTitle>
              </div>
              
              {/* Search Row */}
              <div className="w-full">
                <div className="relative max-w-md">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search inquiries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
              
              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={organizationTypeFilter} onValueChange={setOrganizationTypeFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="non-profit">Non-Profit</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
                    <SelectItem value="organization_name-asc">Organization A-Z</SelectItem>
                    <SelectItem value="organization_name-desc">Organization Z-A</SelectItem>
                    <SelectItem value="contact_name-asc">Contact A-Z</SelectItem>
                    <SelectItem value="contact_name-desc">Contact Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedInquiries.length > 0 && (
              <BulkActions
                selectedCount={selectedInquiries.length}
                onBulkDelete={handleBulkDelete}
                onClearSelection={() => setSelectedInquiries([])}
              />
            )}

            {inquiries.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'No inquiries found matching your search.' : 'No partnership inquiries yet.'}
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
                          checked={selectedInquiries.length === inquiries.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                       <TableHead className="min-w-[200px]">Organization</TableHead>
                       <TableHead className="min-w-[150px]">Contact</TableHead>
                       <TableHead className="min-w-[120px]">Type</TableHead>
                       <TableHead className="min-w-[100px]">Status</TableHead>
                       <TableHead className="min-w-[100px]">Date</TableHead>
                       <TableHead className="min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedInquiries.includes(inquiry.id)}
                            onCheckedChange={(checked) => 
                              handleSelectInquiry(inquiry.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{inquiry.organization_name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{inquiry.message}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{inquiry.contact_name}</div>
                              <div className="text-sm text-gray-500 truncate">{inquiry.email}</div>
                            </div>
                          </div>
                        </TableCell>
                         <TableCell>
                           <Badge variant="outline">{inquiry.organization_type}</Badge>
                         </TableCell>
                         <TableCell>
                           <Select 
                             value={inquiry.status || 'new'} 
                             onValueChange={(value) => handleStatusChange(inquiry.id, value)}
                           >
                             <SelectTrigger className="w-32">
                               <div className="flex items-center gap-2">
                                 {getStatusIcon(inquiry.status || 'new')}
                                 <SelectValue />
                               </div>
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="new">New</SelectItem>
                               <SelectItem value="in_progress">In Progress</SelectItem>
                               <SelectItem value="completed">Completed</SelectItem>
                               <SelectItem value="rejected">Rejected</SelectItem>
                             </SelectContent>
                           </Select>
                         </TableCell>
                         <TableCell>
                           {new Date(inquiry.created_at).toLocaleDateString()}
                         </TableCell>
                         <TableCell>
                           <div className="flex items-center space-x-2">
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => setViewingInquiry(inquiry)}
                             >
                               <Edit2 className="h-4 w-4" />
                             </Button>
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => handleDelete(inquiry.id)}
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
        <Dialog open={!!viewingInquiry} onOpenChange={() => setViewingInquiry(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Partnership Inquiry Details</DialogTitle>
            </DialogHeader>
            {viewingInquiry && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Name</label>
                    <div className="p-3 bg-gray-50 rounded-md">{viewingInquiry.organization_name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Type</label>
                    <div className="p-3 bg-gray-50 rounded-md">{viewingInquiry.organization_type}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Name</label>
                    <div className="p-3 bg-gray-50 rounded-md">{viewingInquiry.contact_name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="p-3 bg-gray-50 rounded-md">{viewingInquiry.email}</div>
                  </div>
                </div>

                {viewingInquiry.phone && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <div className="p-3 bg-gray-50 rounded-md">{viewingInquiry.phone}</div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {viewingInquiry.message}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(viewingInquiry.status || 'new')}>
                      {viewingInquiry.status || 'new'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Submitted on {new Date(viewingInquiry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select 
                      value={viewingInquiry.status || 'new'} 
                      onValueChange={(value) => {
                        handleStatusChange(viewingInquiry.id, value);
                        setViewingInquiry({ ...viewingInquiry, status: value });
                      }}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDelete(viewingInquiry.id);
                        setViewingInquiry(null);
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

export default AdminPartnerships;
