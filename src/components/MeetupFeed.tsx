
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, format } from "date-fns";
import { Calendar, MapPin, Users, Video } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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

const MeetupFeed = ({ limit }: { limit?: number }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendingMeetups, setAttendingMeetups] = useState<Set<string>>(new Set());

  const { data: meetups = [], isLoading, error, refetch } = useQuery({
    queryKey: ['meetups', limit, user?.id],
    queryFn: async (): Promise<Meetup[]> => {
      let query = supabase
        .from('meetups')
        .select(`
          id,
          title,
          description,
          location,
          date_time,
          max_attendees,
          category,
          is_virtual,
          meeting_link,
          created_at,
          user_id,
          attendees(count),
          attendees!inner(user_id)
        `)
        .order('date_time', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data: meetupsData, error } = await query;
      
      if (error) {
        console.error('Error fetching meetups:', error);
        throw error;
      }

      // Now get the profiles for the meetup organizers
      const userIds = meetupsData?.map(meetup => meetup.user_id).filter(Boolean) || [];
      
      let profilesData: any[] = [];
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);
        
        if (!profilesError) {
          profilesData = profiles || [];
        }
      }

      return (meetupsData || []).map(meetup => ({
        ...meetup,
        profiles: profilesData.find(profile => profile.id === meetup.user_id) || null,
        attendee_count: meetup.attendees?.length || 0,
        user_attending: user ? meetup.attendees?.some((a: any) => a.user_id === user.id) || false : false
      }));
    },
  });

  const handleAttendance = async (meetupId: string, isAttending: boolean) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to join meetups.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isAttending) {
        // Remove attendance
        const { error } = await supabase
          .from('attendees')
          .delete()
          .eq('meetup_id', meetupId)
          .eq('user_id', user.id);

        if (error) throw error;

        setAttendingMeetups(prev => {
          const newSet = new Set(prev);
          newSet.delete(meetupId);
          return newSet;
        });

        toast({
          title: "Left meetup",
          description: "You're no longer attending this meetup."
        });
      } else {
        // Add attendance
        const { error } = await supabase
          .from('attendees')
          .insert({
            meetup_id: meetupId,
            user_id: user.id
          });

        if (error) throw error;

        setAttendingMeetups(prev => new Set(prev).add(meetupId));

        toast({
          title: "Joined meetup!",
          description: "You're now attending this meetup."
        });
      }

      refetch();
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast({
        title: "Error",
        description: "There was an error updating your attendance.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Error loading meetups. Please try again later.</p>
      </div>
    );
  }

  if (meetups.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No meetups scheduled yet. Be the first to organize one!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {meetups.map((meetup) => {
        const isAttending = attendingMeetups.has(meetup.id) || meetup.user_attending;
        const isPastEvent = new Date(meetup.date_time) < new Date();
        
        return (
          <Card key={meetup.id} className="hover:shadow-lg transition-shadow">
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
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{meetup.attendee_count}/{meetup.max_attendees}</span>
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
                    variant={isAttending ? "outline" : "default"}
                    onClick={() => handleAttendance(meetup.id, isAttending)}
                    className={isAttending ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white" : "bg-red-600 hover:bg-red-700 text-white"}
                  >
                    {isAttending ? "Leave" : "Join"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MeetupFeed;
