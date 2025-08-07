import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MeetupCard from "./MeetupCard";
import MeetupLoadingSkeleton from "./MeetupLoadingSkeleton";

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

interface MeetupFeedProps {
  limit?: number;
  referrer?: string;
}

const MeetupFeed = ({ limit, referrer = "events" }: MeetupFeedProps) => {
  const { data: meetups = [], isLoading, error } = useQuery({
    queryKey: ['meetups', limit],
    queryFn: async (): Promise<Meetup[]> => {
      let query = supabase
        .from('meetups')
        .select(`
          id,
          title,
          description,
          location,
          date_time,
          category,
          is_virtual,
          meeting_link,
          created_at,
          user_id,
          external_url,
          external_link_text
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
        profiles: profilesData.find(profile => profile.id === meetup.user_id) || null
      }));
    },
  });

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
      {meetups.map((meetup) => (
        <MeetupCard
          key={meetup.id}
          meetup={meetup}
          referrer={referrer}
        />
      ))}
    </div>
  );
};

export default MeetupFeed;
