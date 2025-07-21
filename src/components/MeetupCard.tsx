
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Video } from "lucide-react";

interface Meetup {
  id: string;
  title: string;
  description: string;
  location: string;
  date_time: string;
  max_attendees: number;
  category: string;
  is_virtual: boolean;
  meeting_link: string | null;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
  attendee_count: number;
  user_attending: boolean;
}

interface MeetupCardProps {
  meetup: Meetup;
  onAttendanceChange: (meetupId: string, isAttending: boolean) => void;
}

const MeetupCard = ({ meetup, onAttendanceChange }: MeetupCardProps) => {
  const isPastEvent = new Date(meetup.date_time) < new Date();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {meetup.title}
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              {meetup.profiles ? (
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={meetup.profiles.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {meetup.profiles.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span>by {meetup.profiles.full_name}</span>
                </div>
              ) : (
                <span>Organizer</span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(meetup.date_time), 'MMM d, yyyy at h:mm a')}</span>
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
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {meetup.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {meetup.category && (
              <Badge variant="secondary" className="text-xs">
                {meetup.category}
              </Badge>
            )}
          </div>
          {!isPastEvent && (
            <Button
              size="sm"
              variant={meetup.user_attending ? "outline" : "default"}
              onClick={() => onAttendanceChange(meetup.id, meetup.user_attending)}
              className={meetup.user_attending ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white" : "bg-red-600 hover:bg-red-700 text-white"}
            >
              {meetup.user_attending ? "Leave" : "Join"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetupCard;
