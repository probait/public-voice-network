
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Linkedin, Twitter, Mail, FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ContributorProfile = () => {
  const { id } = useParams<{ id: string }>();

  const { data: contributor, isLoading } = useQuery({
    queryKey: ['contributor', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contributors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: articles } = useQuery({
    queryKey: ['contributor-articles', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('author_id', id)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Temporarily hidden - Fellowship query
  // const { data: fellowship } = useQuery({
  //   queryKey: ['contributor-fellowship', id],
  //   queryFn: async () => {
  //     const { data, error } = await supabase
  //       .from('fellows')
  //       .select('*')
  //       .eq('contributor_id', id)
  //       .eq('is_current', true)
  //       .single();

  //     if (error && error.code !== 'PGRST116') {
  //       throw error;
  //     }

  //     return data;
  //   },
  //   enabled: !!id,
  // });
  const fellowship = null; // Temporarily disabled

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="animate-pulse">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!contributor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Contributor Not Found</h1>
            <p className="text-gray-600 mb-8">The contributor you're looking for doesn't exist.</p>
            <Link to="/contributors">
              <Button>View All Contributors</Button>
            </Link>
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
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/contributors">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Contributors
              </Button>
            </Link>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-start gap-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-red-100 mx-auto lg:mx-0 flex-shrink-0">
                  {contributor.headshot_url ? (
                    <img
                      src={contributor.headshot_url}
                      alt={contributor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-red-600 text-2xl sm:text-3xl font-semibold">
                      {contributor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center lg:text-left min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                    <div className="min-w-0 flex-1">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">{contributor.name}</h1>
                      {(contributor.organization || contributor.institution) && (
                        <p className="text-base sm:text-lg text-gray-600 mb-3 break-words">
                          {contributor.organization && contributor.institution 
                            ? `${contributor.organization}, ${contributor.institution}`
                            : contributor.organization || contributor.institution}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start flex-shrink-0">
                      {contributor.is_featured && (
                        <Badge className="bg-red-100 text-red-800 whitespace-nowrap">Featured Contributor</Badge>
                      )}
                      {/* Temporarily hidden - Fellowship badge */}
                      {/* {fellowship && (
                        <Badge className="bg-blue-100 text-blue-800">PolicyNow Fellow</Badge>
                      )} */}
                    </div>
                  </div>
                  
                  {contributor.bio && (
                    <p className="text-gray-700 leading-relaxed mb-6 break-words">{contributor.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                    {contributor.website_url && (
                      <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                        <a href={contributor.website_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                    {contributor.linkedin_url && (
                      <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                        <a href={contributor.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {contributor.twitter_url && (
                      <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                        <a href={contributor.twitter_url} target="_blank" rel="noopener noreferrer">
                          <Twitter className="w-4 h-4 mr-2" />
                          Twitter
                        </a>
                      </Button>
                    )}
                    {contributor.email && (
                      <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                        <a href={`mailto:${contributor.email}`}>
                          <Mail className="w-4 h-4 mr-2" />
                          Contact
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Temporarily hidden - Fellowship card */}
          {/* {fellowship && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">PolicyNow Fellow</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {fellowship.program_description && (
                  <p className="text-gray-700">{fellowship.program_description}</p>
                )}
                <div className="flex gap-4 mt-4 text-sm text-gray-600">
                  {fellowship.start_date && (
                    <span>Started: {new Date(fellowship.start_date).toLocaleDateString()}</span>
                  )}
                  {fellowship.end_date && (
                    <span>Ends: {new Date(fellowship.end_date).toLocaleDateString()}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )} */}

          {articles && articles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Contributions ({articles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div key={article.id} className="border-l-4 border-red-200 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-1 break-words">{article.title}</h3>
                      {article.published_at && (
                        <p className="text-sm text-gray-600">
                          Published {new Date(article.published_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContributorProfile;
