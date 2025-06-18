
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Linkedin, Twitter, Mail, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Fellows = () => {
  const { data: currentFellows, isLoading: loadingCurrent } = useQuery({
    queryKey: ['current-fellows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fellows')
        .select(`
          *,
          contributors (*)
        `)
        .eq('is_current', true)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: pastFellows, isLoading: loadingPast } = useQuery({
    queryKey: ['past-fellows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fellows')
        .select(`
          *,
          contributors (*)
        `)
        .eq('is_current', false)
        .order('end_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const renderFellowCard = (fellowship: any) => {
    const contributor = fellowship.contributors;
    if (!contributor) return null;

    return (
      <Card key={fellowship.id} className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={contributor.headshot_url || ''} alt={contributor.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                {contributor.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{contributor.name}</h3>
                <Badge className={fellowship.is_current ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {fellowship.is_current ? "Current Fellow" : "Past Fellow"}
                </Badge>
              </div>
              
              {(contributor.organization || contributor.institution) && (
                <p className="text-sm text-gray-600 mb-2">
                  {contributor.organization && contributor.institution 
                    ? `${contributor.organization}, ${contributor.institution}`
                    : contributor.organization || contributor.institution}
                </p>
              )}
              
              {fellowship.program_description && (
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{fellowship.program_description}</p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                {fellowship.start_date && (
                  <span>Started: {new Date(fellowship.start_date).toLocaleDateString()}</span>
                )}
                {fellowship.end_date && (
                  <span>Ended: {new Date(fellowship.end_date).toLocaleDateString()}</span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <Link to={`/contributors/${contributor.id}`}>
                  <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
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
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">PolicyNow Fellows Program</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              The PolicyNow Fellows Program brings together leading researchers, policy experts, and practitioners 
              to advance evidence-based AI policy research in Canada. Our fellows contribute cutting-edge analysis 
              and recommendations to help shape the future of AI governance.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Award className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-900">About the Program</h2>
              </div>
              <p className="text-blue-800 max-w-3xl mx-auto">
                Fellows engage in collaborative research, contribute to policy briefs, participate in roundtable discussions, 
                and help build a national network of AI policy expertise. The program emphasizes interdisciplinary approaches 
                and practical policy solutions that serve all Canadians.
              </p>
            </div>
          </div>

          {/* Current Fellows */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Current Fellows</h2>
            </div>
            
            {loadingCurrent ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
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
            ) : currentFellows && currentFellows.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentFellows.map(renderFellowCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">No current fellows at this time. Check back soon for updates!</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Past Fellows */}
          {pastFellows && pastFellows.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Past Fellows</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastFellows.map(renderFellowCard)}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Fellows;
