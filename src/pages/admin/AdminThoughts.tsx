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
import AdminThoughtForm from '@/components/admin/AdminThoughtForm';
import BulkActions from '@/components/admin/BulkActions';
import AdminThoughtsStats from '@/components/admin/AdminThoughtsStats';
import AdminThoughtsTable from '@/components/admin/AdminThoughtsTable';
import { useAdminThoughts } from '@/hooks/useAdminThoughts';
import { ThoughtSubmission } from '@/types/admin-thoughts';

const AdminThoughts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThoughts, setSelectedThoughts] = useState<Set<string>>(new Set());
  const [editingThought, setEditingThought] = useState<ThoughtSubmission | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { 
    thoughts, 
    isLoading, 
    deleteMutation, 
    bulkDeleteMutation, 
    toggleFeaturedMutation
  } = useAdminThoughts();

  const filteredThoughts = thoughts.filter(thought =>
    thought.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thought.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thought.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectThought = (thoughtId: string) => {
    const newSelected = new Set(selectedThoughts);
    if (newSelected.has(thoughtId)) {
      newSelected.delete(thoughtId);
    } else {
      newSelected.add(thoughtId);
    }
    setSelectedThoughts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedThoughts.size === filteredThoughts.length) {
      setSelectedThoughts(new Set());
    } else {
      setSelectedThoughts(new Set(filteredThoughts.map(thought => thought.id)));
    }
  };

  const handleEdit = (thought: ThoughtSubmission) => {
    setEditingThought(thought);
    setIsFormOpen(true);
  };

  const handleDelete = (thoughtId: string) => {
    if (confirm('Are you sure you want to delete this thought submission?')) {
      deleteMutation.mutate(thoughtId);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedThoughts.size} thought submissions?`)) {
      bulkDeleteMutation.mutate([...selectedThoughts]);
      setSelectedThoughts(new Set());
    }
  };

  const handleToggleFeatured = (thoughtId: string, featured: boolean) => {
    toggleFeaturedMutation.mutate({ thoughtId, featured });
  };

  if (isLoading) {
    return (
      <ProtectedAdminRoute requiredSection="thoughts">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Citizen Thoughts Management</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute requiredSection="thoughts">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Citizen Thoughts Management</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingThought(null);
                  setIsFormOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Thought
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingThought ? 'Edit Thought Submission' : 'Create New Thought Submission'}
                </DialogTitle>
              </DialogHeader>
              <AdminThoughtForm 
                thought={editingThought}
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingThought(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <AdminThoughtsStats thoughts={thoughts} />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Thought Submissions</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search thoughts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedThoughts.size > 0 && (
              <BulkActions
                selectedCount={selectedThoughts.size}
                onBulkDelete={handleBulkDelete}
                onClearSelection={() => setSelectedThoughts(new Set())}
              />
            )}

            <AdminThoughtsTable
              thoughts={filteredThoughts}
              selectedThoughts={selectedThoughts}
              onSelectThought={handleSelectThought}
              onSelectAll={handleSelectAll}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
            />

            {filteredThoughts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'No thoughts found matching your search.' : 'No thoughts created yet.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminThoughts;
