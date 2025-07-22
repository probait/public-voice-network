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
  Search,
  Mail,
  Settings
} from 'lucide-react';
import AdminNewsletterForm from '@/components/admin/AdminNewsletterForm';
import BulkActions from '@/components/admin/BulkActions';
import AdminNewsletterStats from '@/components/admin/AdminNewsletterStats';
import AdminNewsletterTable from '@/components/admin/AdminNewsletterTable';
import { useAdminNewsletter } from '@/hooks/useAdminNewsletter';
import { NewsletterSubscriber } from '@/types/admin-newsletter';

const AdminNewsletter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState<Set<string>>(new Set());
  const [editingSubscriber, setEditingSubscriber] = useState<NewsletterSubscriber | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { 
    subscribers, 
    isLoading, 
    deleteMutation, 
    bulkDeleteMutation,
  } = useAdminNewsletter();

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSubscriber = (subscriberId: string) => {
    const newSelected = new Set(selectedSubscribers);
    if (newSelected.has(subscriberId)) {
      newSelected.delete(subscriberId);
    } else {
      newSelected.add(subscriberId);
    }
    setSelectedSubscribers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.size === filteredSubscribers.length) {
      setSelectedSubscribers(new Set());
    } else {
      setSelectedSubscribers(new Set(filteredSubscribers.map(subscriber => subscriber.id)));
    }
  };

  const handleEdit = (subscriber: NewsletterSubscriber) => {
    setEditingSubscriber(subscriber);
    setIsFormOpen(true);
  };

  const handleDelete = (subscriberId: string) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      deleteMutation.mutate(subscriberId);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedSubscribers.size} subscribers?`)) {
      bulkDeleteMutation.mutate([...selectedSubscribers]);
      setSelectedSubscribers(new Set());
    }
  };

  if (isLoading) {
    return (
      <ProtectedAdminRoute requiredSection="newsletter">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute requiredSection="newsletter">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingSubscriber(null);
                  setIsFormOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subscriber
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSubscriber ? 'Edit Subscriber' : 'Add New Subscriber'}
                </DialogTitle>
              </DialogHeader>
              <AdminNewsletterForm 
                subscriber={editingSubscriber}
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingSubscriber(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <AdminNewsletterStats subscribers={subscribers} />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Subscribers</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedSubscribers.size > 0 && (
              <BulkActions
                selectedCount={selectedSubscribers.size}
                onBulkDelete={handleBulkDelete}
                onClearSelection={() => setSelectedSubscribers(new Set())}
              />
            )}

            <AdminNewsletterTable
              subscribers={filteredSubscribers}
              selectedSubscribers={selectedSubscribers}
              onSelectSubscriber={handleSelectSubscriber}
              onSelectAll={handleSelectAll}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {filteredSubscribers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'No subscribers found matching your search.' : 'No subscribers added yet.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminNewsletter;
