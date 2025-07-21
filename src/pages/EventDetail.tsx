
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatEventDetailDate } from "@/lib/dateUtils";
import { Calendar, MapPin, Video, ExternalLink, ArrowLeft, List } from "lucide-react";
import ResponsiveImage from "@/components/ResponsiveImage";

interface EventDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  date_time: string;
  category: string;
  is_virtual: boolean;
  meeting_link: string | null;
  created_at: string;
  image_url?: string;
  profiles: {
    full_name: string;
  } | null;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');

  // Determine navigation based on referrer
  const isFromHome = from === 'home';
  const backButtonText = isFromHome ? 'Back to Homepage' : 'Back to Events';
  const backButtonPath = isFromHome ? '/' : '/events';

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event-detail', id],
    queryFn: async (): Promise<EventDetail | null> => {
      if (!id) return null;

      const { data: eventData, error } = await supabase
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
          image_url
        `)
        .eq('id', id)
        .single();

      if (error) {
        
        throw error;
      }


      // Get organizer profile
      let profile = null;
      if (eventData.user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', eventData.user_id)
          .single();

        if (profileData) {
          profile = { full_name: profileData.full_name };
        }
      }

      return {
        ...eventData,
        profiles: profile
      };
    },
    enabled: !!id
  });

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) {
      return "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=400&fit=crop";
    }
    
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    return imageUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
              <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate('/events')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <nav className="mb-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate(backButtonPath)}
              className="p-0 h-auto font-normal text-gray-600 hover:text-gray-900 w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backButtonText}
            </Button>
            
            {isFromHome && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/events')}
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-fit"
              >
                <List className="h-4 w-4 mr-2" />
                Show all events
              </Button>
            )}
          </nav>

          <Card className="overflow-hidden">
            {/* Event Image */}
            <div className="w-full h-64 md:h-80 overflow-hidden">
              <ResponsiveImage
                src={getImageUrl(event.image_url)}
                alt={event.title}
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>

            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                    {event.title}
                  </CardTitle>
                  
                  {/* Event Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-5 w-5" />
                       <span className="text-lg">
                         {formatEventDetailDate(event.date_time)}
                       </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      {event.is_virtual ? <Video className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                      <span className="text-lg">
                        {event.is_virtual ? 'Virtual Meeting' : event.location}
                      </span>
                    </div>
                    
                  </div>

                  {/* Tags */}
                  <div className="flex items-center space-x-2 mt-4">
                    <Badge variant="secondary" className="text-sm">
                      {event.category}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Free
                    </Badge>
                  </div>
                </div>

                {/* Action Button */}
                <div className="md:ml-8">
                  {event.meeting_link ? (
                    <Button 
                      asChild 
                      size="lg"
                      className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
                    >
                      <a href={event.meeting_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Join Event
                      </a>
                    </Button>
                  ) : (
                    <Button 
                      disabled 
                      size="lg"
                      className="w-full md:w-auto"
                    >
                      Event Link Not Available
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Organizer */}
              {event.profiles && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Organized by</h3>
                  <p className="text-gray-700">{event.profiles.full_name}</p>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About this event</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
