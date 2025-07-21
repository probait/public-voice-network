
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  Calendar,
  MapPin,
  Video,
  Eye,
  EyeOff,
  Star,
  Image
} from 'lucide-react';
import { Meetup } from '@/types/admin-events';

interface AdminEventsTableProps {
  events: Meetup[];
  selectedEvents: Set<string>;
  onSelectEvent: (eventId: string) => void;
  onSelectAll: () => void;
  onEdit: (event: Meetup) => void;
  onDelete: (eventId: string) => void;
  onToggleHomepageFeatured: (eventId: string, featured: boolean) => void;
  onTogglePublished: (eventId: string, published: boolean) => void;
}

const AdminEventsTable = ({
  events,
  selectedEvents,
  onSelectEvent,
  onSelectAll,
  onEdit,
  onDelete,
  onToggleHomepageFeatured,
  onTogglePublished
}: AdminEventsTableProps) => {
  const featuredEventsCount = events.filter(event => event.homepage_featured).length;

  const handleFeaturedChange = (eventId: string, checked: boolean) => {
    if (checked && featuredEventsCount >= 3) {
      alert('You can only feature a maximum of 3 events. Please unfeature an existing event first.');
      return;
    }
    onToggleHomepageFeatured(eventId, checked);
  };

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) {
      return "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=225&fit=crop";
    }
    
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    return imageUrl;
  };

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
            <TableHead>Image</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Category</TableHead>
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
                  <div className="w-16 h-12 overflow-hidden rounded">
                    {event.image_url ? (
                      <img 
                        src={getImageUrl(event.image_url)}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=225&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Image className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeaturedChange(event.id, !event.homepage_featured)}
                    className="hover:bg-yellow-50"
                  >
                    {event.homepage_featured ? (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    ) : (
                      <Star className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
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
                      onClick={() => onTogglePublished(event.id, !event.is_published)}
                      title={event.is_published ? "Unpublish event" : "Publish event"}
                    >
                      {event.is_published ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(event)}
                      title="Edit event"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(event.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete event"
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
