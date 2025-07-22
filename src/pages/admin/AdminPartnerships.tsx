import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import AdminLayout from '@/components/admin/AdminLayout';
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
import AdminPartnershipForm from '@/components/admin/AdminPartnershipForm';
import BulkActions from '@/components/admin/BulkActions';
import AdminPartnershipsStats from '@/components/admin/AdminPartnershipsStats';
import AdminPartnershipsTable from '@/components/admin/AdminPartnershipsTable';
import { useAdminPartnerships } from '@/hooks/useAdminPartnerships';
import { Partnership } from '@/types/admin-partnerships';

const AdminPartnerships = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartnerships, setSelectedPartnerships] = useState<Set<string>>(new Set());
  const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { 
    partnerships, 
    isLoading, 
    deleteMutation, 
    bulkDeleteMutation, 
    toggleHomepageFeaturedMutation,
    togglePublishedMutation 
  } = useAdminPartnerships();

  const filteredPartnerships = partnerships.filter(partnership =>
    partnership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partnership.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (partnership.category && partnership.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectPartnership = (partnershipId: string) => {
    const newSelected = new Set(selectedPartnerships);
    if (newSelected.has(partnershipId)) {
      newSelected.delete(partnershipId);
    } else {
      newSelected.add(partnershipId);
    }
    setSelectedPartnerships(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPartnerships.size === filteredPartnerships.length) {
      setSelectedPartnerships(new Set());
    } else {
      setSelectedPartnerships(new Set(filteredPartnerships.map(partnership => partnership.id)));
    }
  };

  const handleEdit = (partnership: Partnership) => {
    setEditingPartnership(partnership);
    setIsFormOpen(true);
  };

  const handleDelete = (partnershipId: string) => {
    if (confirm('Are you sure you want to delete this partnership?')) {
      deleteMutation.mutate(partnershipId);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedPartnerships.size} partnerships?`)) {
      bulkDeleteMutation.mutate([...selectedPartnerships]);
      setSelectedPartnerships(new Set());
    }
  };

  const handleToggleHomepageFeatured = (partnershipId: string, featured: boolean) => {
    toggleHomepageFeaturedMutation.mutate({ partnershipId, featured });
  };

  const handleTogglePublished = (partnershipId: string, published: boolean) => {
    togglePublishedMutation.mutate({ partnershipId, published });
  };

  if (isLoading) {
    return (
      <AdminLayout requiredRole="admin">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Partnerships Management</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <ProtectedAdminRoute requiredSection="partnerships">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Partnerships Management</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingPartnership(null);
                  setIsFormOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Partnership
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPartnership ? 'Edit Partnership' : 'Create New Partnership'}
                </DialogTitle>
              </DialogHeader>
              <AdminPartnershipForm 
                partnership={editingPartnership}
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingPartnership(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <AdminPartnershipsStats partnerships={partnerships} />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Partnerships</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search partnerships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedPartnerships.size > 0 && (
              <BulkActions
                selectedCount={selectedPartnerships.size}
                onBulkDelete={handleBulkDelete}
                onClearSelection={() => setSelectedPartnerships(new Set())}
              />
            )}

            <AdminPartnershipsTable
              partnerships={filteredPartnerships}
              selectedPartnerships={selectedPartnerships}
              onSelectPartnership={handleSelectPartnership}
              onSelectAll={handleSelectAll}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleHomepageFeatured={handleToggleHomepageFeatured}
              onTogglePublished={handleTogglePublished}
            />

            {filteredPartnerships.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'No partnerships found matching your search.' : 'No partnerships created yet.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminPartnerships;
