import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Search, 
  Calendar,
  MapPin,
  Video,
  Eye
} from 'lucide-react';
import AdminEventForm from '@/components/admin/AdminEventForm';
import BulkActions from '@/components/admin/BulkActions';

interface Meetup {
  id: string;
  title: string;
  description: string;
  location: string;
  date_time: string;
  max_attendees: number | null;
  category: string | null;
  is_virtual: boolean | null;
  meeting_link: string | null;
  created_at: string;
  attendee_count: number;
  profiles: {
    full_name: string | null;
  } | null;
}

const AdminEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [editingEvent, setEditingEvent] = useState<Meetup | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingAttendees, setViewingAttendees] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async (): Promise<Meetup[]> => {
      const { data, error } = await supabase
        .from('meetups')
        .select(`
          *,
          profiles!meetups_user_id_fkey(full_name),
          attendees(count)
        `)
        .order('date_time', { ascending: false });

      if (error) throw error;

      return (data || []).map(event => ({
        ...event,
        attendee_count: Array.isArray(event.attendees) ? event.attendees.length : 0,
        profiles: event.profiles && typeof event.profiles === 'object' && event.profiles !== null && 'full_name' in event.profiles 
          ? { full_name: event.profiles.full_name }
          : null
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('meetups')
        .delete()
        .eq('id', eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: 'Event deleted successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting event', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (eventIds: string[]) => {
      const { error } = await supabase
        .from('meetups')
        .delete()
        .in('id', eventIds);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setSelectedEvents(new Set());
      toast({ title: 'Events deleted successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting events', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

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
    }
  };

  const getEventStats = () => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => new Date(e.date_time) > new Date()).length;
    const totalAttendees = events.reduce((sum, event) => sum + event.attendee_count, 0);
    const avgAttendance = totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0;

    return { totalEvents, upcomingEvents, totalAttendees, avgAttendance };
  };

  const stats = getEventStats();

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.upcomingEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Attendees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalAttendees}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg. Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.avgAttendance}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Events Table */}
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

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedEvents.size === filteredEvents.length && filteredEvents.length > 0}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => {
                    const isPastEvent = new Date(event.date_time) < new Date();
                    
                    return (
                      <TableRow key={event.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedEvents.has(event.id)}
                            onChange={() => handleSelectEvent(event.id)}
                            className="rounded"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {event.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {format(new Date(event.date_time), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(event.date_time), 'h:mm a')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {event.is_virtual ? (
                              <Video className="h-4 w-4 text-blue-500" />
                            ) : (
                              <MapPin className="h-4 w-4 text-green-500" />
                            )}
                            <span className="text-sm truncate max-w-xs">
                              {event.is_virtual ? 'Virtual' : event.location}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{event.category || 'General'}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>{event.attendee_count}/{event.max_attendees || 'Unlimited'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {event.profiles?.full_name || 'Unknown'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewingAttendees(event.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(event)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(event.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

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
