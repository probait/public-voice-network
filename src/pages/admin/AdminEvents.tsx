
import { useState } from 'react';
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
import AdminEventForm from '@/components/admin/AdminEventForm';
import BulkActions from '@/components/admin/BulkActions';
import AdminEventsStats from '@/components/admin/AdminEventsStats';
import AdminEventsTable from '@/components/admin/AdminEventsTable';
import { useAdminEvents } from '@/hooks/useAdminEvents';
import { Meetup } from '@/types/admin-events';

const AdminEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [editingEvent, setEditingEvent] = useState<Meetup | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingAttendees, setViewingAttendees] = useState<string | null>(null);

  const { 
    events, 
    isLoading, 
    deleteMutation, 
    bulkDeleteMutation, 
    toggleHomepageFeaturedMutation 
  } = useAdminEvents();

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectEvent = (eventId: string) => {
    const newSelected = new Set(selectedEvents);
    if (newSelected.has(eventId)) {
      newSelected.delete(eventId);
    } else {
      newSelected.add(eventId);
    }
    setSelectedEvents(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedEvents.size === filteredEvents.length) {
      setSelectedEvents(new Set());
    } else {
      setSelectedEvents(new Set(filteredEvents.map(event => event.id)));
    }
  };

  const handleEdit = (event: Meetup) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(eventId);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedEvents.size} events?`)) {
      bulkDeleteMutation.mutate([...selectedEvents]);
      setSelectedEvents(new Set());
    }
  };

  const handleToggleHomepageFeatured = (eventId: string, featured: boolean) => {
    toggleHomepageFeaturedMutation.mutate({ eventId, featured });
  };

  if (isLoading) {
    return (
      <AdminLayout requiredRole="content_manager">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredRole="content_manager">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingEvent(null);
                  setIsFormOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </DialogTitle>
              </DialogHeader>
              <AdminEventForm 
                event={editingEvent}
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingEvent(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <AdminEventsStats events={events} />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Events</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedEvents.size > 0 && (
              <BulkActions
                selectedCount={selectedEvents.size}
                onBulkDelete={handleBulkDelete}
                onClearSelection={() => setSelectedEvents(new Set())}
              />
            )}

            <AdminEventsTable
              events={filteredEvents}
              selectedEvents={selectedEvents}
              onSelectEvent={handleSelectEvent}
              onSelectAll={handleSelectAll}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewAttendees={setViewingAttendees}
              onToggleHomepageFeatured={handleToggleHomepageFeatured}
            />

            {filteredEvents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'No events found matching your search.' : 'No events created yet.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
