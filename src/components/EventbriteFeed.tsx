
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

interface EventbriteEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date_time: string;
  url: string;
  organizer: string;
  category: string;
  price: string;
  image_url: string;
}

// Hand-selected events - in a real app, these would come from Eventbrite API
const featuredEvents: EventbriteEvent[] = [
  {
    id: "1",
    title: "AI Ethics Symposium Toronto",
    description: "Join leading experts to discuss the ethical implications of AI development and deployment in Canadian society.",
    location: "Toronto, ON",
    date_time: "2025-07-15T14:00:00",
    url: "https://eventbrite.ca/example1",
    organizer: "University of Toronto AI Institute",
    category: "Ethics",
    price: "Free",
    image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop"
  },
  {
    id: "2",
    title: "Future of Work: AI Impact on Canadian Jobs",
    description: "A panel discussion on how artificial intelligence will reshape the Canadian job market and what workers need to know.",
    location: "Vancouver, BC",
    date_time: "2025-07-22T18:30:00",
    url: "https://eventbrite.ca/example2",
    organizer: "BC Tech Association",
    category: "Employment",
    price: "$25",
    image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop"
  },
  {
    id: "3",
    title: "AI in Healthcare: Opportunities and Challenges",
    description: "Exploring how AI can transform Canadian healthcare while addressing privacy concerns and ensuring equitable access.",
    location: "Montreal, QC",
    date_time: "2025-08-05T13:00:00",
    url: "https://eventbrite.ca/example3",
    organizer: "McGill Health Innovation",
    category: "Healthcare",
    price: "Free",
    image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop"
  }
];

const EventbriteFeed = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {featuredEvents.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="relative">
            <img 
              src={event.image_url} 
              alt={event.title}
              className="w-full h-48 object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                  {event.title}
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.date_time), 'MMM d, yyyy at h:mm a')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {event.description}
            </p>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {event.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {event.price}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-3">
              Organized by {event.organizer}
            </div>
            <Button 
              asChild 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <a href={event.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Eventbrite
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventbriteFeed;
