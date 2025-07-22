import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Search
} from 'lucide-react';
import AdminPartnershipInquiryForm from '@/components/admin/AdminPartnershipInquiryForm';
import BulkActions from '@/components/admin/BulkActions';
import AdminPartnershipInquiriesTable from '@/components/admin/AdminPartnershipInquiriesTable';
import { useAdminPartnershipInquiries } from '@/hooks/useAdminPartnershipInquiries';
import { PartnershipInquiry } from '@/types/admin-partnerships';

const AdminPartnershipInquiries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiries, setSelectedInquiries] = useState<Set<string>>(new Set());
  const [editingInquiry, setEditingInquiry] = useState<PartnershipInquiry | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { 
    inquiries, 
    isLoading, 
    deleteMutation, 
    bulkDeleteMutation,
  } = useAdminPartnershipInquiries();

  const filteredInquiries = inquiries.filter(inquiry =>
    inquiry.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectInquiry = (inquiryId: string) => {
    const newSelected = new Set(selectedInquiries);
    if (newSelected.has(inquiryId)) {
      newSelected.delete(inquiryId);
    } else {
      newSelected.add(inquiryId);
    }
    setSelectedInquiries(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedInquiries.size === filteredInquiries.length) {
      setSelectedInquiries(new Set());
    } else {
      setSelectedInquiries(new Set(filteredInquiries.map(inquiry => inquiry.id)));
    }
  };

  const handleEdit = (inquiry: PartnershipInquiry) => {
    setEditingInquiry(inquiry);
    setIsFormOpen(true);
  };

  const handleDelete = (inquiryId: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      deleteMutation.mutate(inquiryId);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedInquiries.size} inquiries?`)) {
      bulkDeleteMutation.mutate([...selectedInquiries]);
      setSelectedInquiries(new Set());
    }
  };

  if (isLoading) {
    return (
      <ProtectedAdminRoute requiredSection="partnerships">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Partnership Inquiries Management</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute requiredSection="partnerships">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Partnership Inquiries Management</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingInquiry(null);
                  setIsFormOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Inquiry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingInquiry ? 'Edit Inquiry' : 'Create New Inquiry'}
                </DialogTitle>
              </DialogHeader>
              <AdminPartnershipInquiryForm 
                inquiry={editingInquiry}
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingInquiry(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Inquiries</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedInquiries.size > 0 && (
              <BulkActions
                selectedCount={selectedInquiries.size}
                onBulkDelete={handleBulkDelete}
                onClearSelection={() => setSelectedInquiries(new Set())}
              />
            )}

            <AdminPartnershipInquiriesTable
              inquiries={filteredInquiries}
              selectedInquiries={selectedInquiries}
              onSelectInquiry={handleSelectInquiry}
              onSelectAll={handleSelectAll}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {filteredInquiries.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'No inquiries found matching your search.' : 'No inquiries created yet.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminPartnershipInquiries;
