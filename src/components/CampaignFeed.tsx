
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface Campaign {
  id: string;
  title: string;
  content: string;
  location: string;
  category: string;
  is_anonymous: boolean;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
}

const CampaignFeed = ({ limit }: { limit?: number }) => {
  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ['campaigns', limit],
    queryFn: async (): Promise<Campaign[]> => {
      let query = supabase
        .from('submissions')
        .select(`
          id,
          title,
          content,
          location,
          category,
          is_anonymous,
          created_at,
          profiles!inner(
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
      }

      return data || [];
    },
  });

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
        <p className="text-gray-500">Error loading campaigns. Please try again later.</p>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No campaigns yet. Be the first to start one!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                  {campaign.title || 'Untitled Campaign'}
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {!campaign.is_anonymous && campaign.profiles ? (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={campaign.profiles.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {campaign.profiles.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{campaign.profiles.full_name}</span>
                    </div>
                  ) : (
                    <span>Anonymous</span>
                  )}
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {campaign.content}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {campaign.category && (
                  <Badge variant="secondary" className="text-xs">
                    {campaign.category}
                  </Badge>
                )}
                {campaign.location && (
                  <span className="text-xs text-gray-500">📍 {campaign.location}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CampaignFeed;
