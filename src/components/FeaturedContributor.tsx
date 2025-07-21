
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Linkedin, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedContributor = () => {
  const { data: contributor, isLoading } = useQuery({
    queryKey: ['featured-contributor'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contributors')
        .select('*')
        .eq('is_featured', true)
        .gte('featured_until', new Date().toISOString())
        .order('featured_until', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
  });

  if (isLoading || !contributor) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-red-100 flex-shrink-0">
            {contributor.headshot_url ? (
              <img
                src={contributor.headshot_url}
                alt={contributor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-red-600 text-lg font-semibold">
                {contributor.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{contributor.name}</h3>
                {(contributor.organization || contributor.institution) && (
                  <p className="text-sm text-gray-600">
                    {contributor.organization && contributor.institution 
                      ? `${contributor.organization}, ${contributor.institution}`
                      : contributor.organization || contributor.institution}
                  </p>
                )}
              </div>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                Featured Contributor
              </span>
            </div>
            
            {contributor.bio && (
              <p className="text-gray-700 text-sm mb-3 line-clamp-3">{contributor.bio}</p>
            )}
            
            <div className="flex items-center gap-3">
              <Link to={`/contributors/${contributor.id}`}>
                <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                  View Profile
                </Button>
              </Link>
              
              <div className="flex gap-2">
                {contributor.website_url && (
                  <Button size="sm" variant="ghost" asChild>
                    <a href={contributor.website_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {contributor.linkedin_url && (
                  <Button size="sm" variant="ghost" asChild>
                    <a href={contributor.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedContributor;
