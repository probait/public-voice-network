
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Globe, Linkedin, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { mockContributors } from "@/data/mockContributors";

const Contributors = () => {
  const { data: contributors, isLoading } = useQuery({
    queryKey: ['contributors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contributors')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Use mock data if no real contributors are available
  const displayContributors = contributors && contributors.length > 0 ? contributors : mockContributors;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Contributors</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the experts, researchers, and thought leaders who contribute to Canada's AI policy discourse. 
              Their diverse perspectives help shape informed policy recommendations for our nation's AI future.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2 mb-3"></div>
                        <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayContributors?.map((contributor) => (
                <Card key={contributor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={contributor.headshot_url || ''} alt={contributor.name} />
                        <AvatarFallback className="bg-red-100 text-red-600 text-lg font-semibold">
                          {contributor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{contributor.name}</h3>
                        {(contributor.organization || contributor.institution) && (
                          <p className="text-sm text-gray-600 mb-2">
                            {contributor.organization && contributor.institution 
                              ? `${contributor.organization}, ${contributor.institution}`
                              : contributor.organization || contributor.institution}
                          </p>
                        )}
                        
                        {contributor.bio && (
                          <p className="text-gray-700 text-sm mb-3 line-clamp-3">{contributor.bio}</p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Link to={`/contributors/${contributor.id}`}>
                            <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                              View Profile
                            </Button>
                          </Link>
                          
                          <div className="flex gap-1">
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
                            {contributor.twitter_url && (
                              <Button size="sm" variant="ghost" asChild>
                                <a href={contributor.twitter_url} target="_blank" rel="noopener noreferrer">
                                  <Twitter className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                            {contributor.email && (
                              <Button size="sm" variant="ghost" asChild>
                                <a href={`mailto:${contributor.email}`}>
                                  <Mail className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contributors;
