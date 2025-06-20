
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { 
  Edit2, 
  Trash2, 
  Users, 
  Calendar,
  MapPin,
  Video,
  Eye,
  Star
} from 'lucide-react';
import { Meetup } from '@/types/admin-events';

interface AdminEventsTableProps {
  events: Meetup[];
  selectedEvents: Set<string>;
  onSelectEvent: (eventId: string) => void;
  onSelectAll: () => void;
  onEdit: (event: Meetup) => void;
  onDelete: (eventId: string) => void;
  onViewAttendees: (eventId: string) => void;
  onToggleHomepageFeatured: (eventId: string, featured: boolean) => void;
}

const AdminEventsTable = ({
  events,
  selectedEvents,
  onSelectEvent,
  onSelectAll,
  onEdit,
  onDelete,
  onViewAttendees,
  onToggleHomepageFeatured
}: AdminEventsTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={selectedEvents.size === events.length && events.length > 0}
                onChange={onSelectAll}
                className="rounded"
              />
            </TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Attendees</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Organizer</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const isPastEvent = new Date(event.date_time) < new Date();
            
            return (
              <TableRow key={event.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedEvents.has(event.id)}
                    onChange={() => onSelectEvent(event.id)}
                    className="rounded"
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {event.title}
                      {event.homepage_featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
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
                  <Switch
                    checked={event.homepage_featured || false}
                    onCheckedChange={(checked) => onToggleHomepageFeatured(event.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {event.profiles?.full_name || 'System'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewAttendees(event.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(event)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(event.id)}
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
  );
};

export default AdminEventsTable;
