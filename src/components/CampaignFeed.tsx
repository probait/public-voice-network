
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

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
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns', limit],
    queryFn: async () => {
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
      if (error) throw error;
      return data as Campaign[];
    }
  });

  const getDisplayName = (campaign: Campaign) => {
    if (campaign.is_anonymous) return "Anonymous";
    return campaign.profiles?.full_name || "Unknown User";
  };

  const getInitials = (name: string) => {
    if (name === "Anonymous") return "A";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      environment: "bg-green-100 text-green-800",
      education: "bg-blue-100 text-blue-800",
      healthcare: "bg-red-100 text-red-800",
      "social-justice": "bg-purple-100 text-purple-800",
      politics: "bg-gray-100 text-gray-800",
      economy: "bg-yellow-100 text-yellow-800",
      other: "bg-gray-100 text-gray-800"
    };
    return colors[category] || colors.other;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No campaigns yet. Be the first to start a campaign!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={!campaign.is_anonymous ? campaign.profiles?.avatar_url : undefined} />
                <AvatarFallback className="bg-red-100 text-red-600">
                  {getInitials(getDisplayName(campaign))}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{getDisplayName(campaign)}</h3>
                    {campaign.location && (
                      <span className="text-sm text-gray-500">• {campaign.location}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {campaign.category && (
                      <Badge variant="secondary" className={getCategoryColor(campaign.category)}>
                        {campaign.category.replace('-', ' ')}
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3">{campaign.title}</h2>
                <p className="text-gray-700 leading-relaxed">{campaign.content}</p>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <button className="hover:text-red-600 transition-colors">Support</button>
                    <button className="hover:text-red-600 transition-colors">Share</button>
                    <button className="hover:text-red-600 transition-colors">Comment</button>
                  </div>
                  <div className="text-sm text-gray-500">
                    0 supporters
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CampaignFeed;
