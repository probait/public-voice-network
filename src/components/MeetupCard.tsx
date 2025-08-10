
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatEventDate } from "@/lib/dateUtils";
import { Calendar, MapPin, Video, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface Meetup {
  id: string;
  title: string;
  description: string;
  location: string;
  date_time: string;
  category: string;
  is_virtual: boolean;
  meeting_link: string | null;
  created_at: string;
  external_url?: string;
  external_link_text?: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
}

interface MeetupCardProps {
  meetup: Meetup;
  referrer?: string;
}

const MeetupCard = ({ meetup, referrer = "events" }: MeetupCardProps) => {
  const isPastEvent = new Date(meetup.date_time) < new Date();

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
      <div className="flex flex-col flex-1">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                {meetup.title}
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatEventDate(meetup.date_time)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  {meetup.is_virtual ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  <span>{meetup.is_virtual ? 'Virtual Meeting' : meetup.location}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1">
          <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
            {meetup.description}
          </p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {meetup.category}
              </Badge>
            </div>
          </div>
          {meetup.profiles && (
            <div className="flex items-center space-x-2 mb-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={meetup.profiles.avatar_url} />
                <AvatarFallback className="text-xs">
                  {meetup.profiles.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-500">
                {meetup.profiles.full_name}
              </span>
            </div>
          )}
          <div className="flex gap-2 mt-auto">
            {meetup.external_url ? (
              <>
                <Button asChild className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  <a href={meetup.external_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {meetup.external_link_text || 'Register'}
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                  <Link to={`/events/${meetup.id}?from=${referrer}`}>
                    Details
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                <Link to={`/events/${meetup.id}?from=${referrer}`}>
                  View Details
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default MeetupCard;
