
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Video, ExternalLink } from "lucide-react";

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
  image_url?: string;
  profiles: {
    full_name: string;
  } | null;
  attendee_count: number;
}

const EventbriteFeed = ({ showFeaturedOnly = false }: { showFeaturedOnly?: boolean }) => {
  const { data: meetups = [], isLoading, error } = useQuery({
    queryKey: ['external-events', showFeaturedOnly],
    queryFn: async (): Promise<Meetup[]> => {
      console.log('Fetching external events, showFeaturedOnly:', showFeaturedOnly);
      
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
          homepage_featured,
          image_url
        `)
        .order('date_time', { ascending: true });

      if (showFeaturedOnly) {
        query = query.eq('homepage_featured', true).limit(3);
      }

      const { data: meetupsData, error } = await query;
      
      if (error) {
        console.error('Error fetching meetups:', error);
        throw error;
      }

      console.log('Fetched meetups with images:', meetupsData?.map(m => ({ id: m.id, title: m.title, image_url: m.image_url })));

      // Get attendees count for each meetup
      if (!meetupsData || meetupsData.length === 0) {
        return [];
      }

      const meetupIds = meetupsData.map(m => m.id);
      const { data: attendeesData } = await supabase
        .from('attendees')
        .select('meetup_id')
        .in('meetup_id', meetupIds);

      // Get profiles for organizers
      const userIds = meetupsData.map(m => m.user_id).filter(Boolean);
      let profilesData: any[] = [];
      
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);
        
        if (profiles) {
          profilesData = profiles;
        }
      }

      return meetupsData.map(meetup => {
        const attendeeCount = attendeesData?.filter(a => a.meetup_id === meetup.id).length || 0;
        const profile = profilesData.find(p => p.id === meetup.user_id);
        
        return {
          id: meetup.id,
          title: meetup.title,
          description: meetup.description,
          location: meetup.location,
          date_time: meetup.date_time,
          max_attendees: meetup.max_attendees,
          category: meetup.category,
          is_virtual: meetup.is_virtual,
          meeting_link: meetup.meeting_link,
          created_at: meetup.created_at,
          image_url: meetup.image_url,
          attendee_count: attendeeCount,
          profiles: profile ? { full_name: profile.full_name } : null
        };
      });
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Error loading events. Please try again later.</p>
      </div>
    );
  }

  if (meetups.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {showFeaturedOnly ? 'No featured events available.' : 'No events scheduled yet.'}
        </p>
      </div>
    );
  }

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) {
      return "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=225&fit=crop";
    }
    
    // If it's already a full URL (starts with http), return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it's a data URL (base64), return as is
    if (imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    return imageUrl;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {meetups.map((meetup) => (
        <Card key={meetup.id} className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="relative">
            <div className="w-full h-48 overflow-hidden">
              <img 
                src={getImageUrl(meetup.image_url)}
                alt={meetup.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('Image failed to load for meetup:', meetup.id, 'URL:', meetup.image_url);
                  e.currentTarget.src = "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=225&fit=crop";
                }}
              />
            </div>
          </div>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                  {meetup.title}
                </CardTitle>
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {meetup.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Free
                </Badge>
              </div>
            </div>
            {meetup.profiles && (
              <div className="text-sm text-gray-500 mb-3">
                Organized by {meetup.profiles.full_name}
              </div>
            )}
            <Button 
              asChild 
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <a href={meetup.meeting_link || '#'} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View event details
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventbriteFeed;
