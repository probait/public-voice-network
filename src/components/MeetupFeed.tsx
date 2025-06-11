
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MeetupCard from "./MeetupCard";
import MeetupLoadingSkeleton from "./MeetupLoadingSkeleton";
import { useMeetupAttendance } from "@/hooks/useMeetupAttendance";

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

  const { attendingMeetups, handleAttendance } = useMeetupAttendance(refetch);

  if (isLoading) {
    return <MeetupLoadingSkeleton />;
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
        
        return (
          <MeetupCard
            key={meetup.id}
            meetup={{
              ...meetup,
              user_attending: isAttending
            }}
            onAttendanceChange={handleAttendance}
          />
        );
      })}
    </div>
  );
};

export default MeetupFeed;
