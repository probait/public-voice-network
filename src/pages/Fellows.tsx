
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { useNewsletterPopup } from "@/hooks/useNewsletterPopup";
import { 
  Globe, 
  Linkedin, 
  Twitter, 
  Mail, 
  Users, 
  Award, 
  BookOpen, 
  Target, 
  Network, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";

const Fellows = () => {
  const { showPopup, hidePopup, showPopupManually } = useNewsletterPopup();
  
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
              <AvatarFallback className="bg-red-100 text-red-600 text-lg font-semibold">
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
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 to-red-800 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                PolicyNow Fellows Program
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Join Canada's premier AI policy research fellowship. Shape the future of artificial intelligence governance while advancing your career in policy research.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-red-600 hover:bg-gray-100"
                  onClick={showPopupManually}
                >
                  <Bell className="mr-2 h-5 w-5" />
                  Get Notified When Applications Open
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="border-2 border-white text-white hover:bg-white hover:text-red-600 bg-transparent"
                  asChild
                >
                  <Link to="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop" 
                alt="Policy researcher working on AI governance" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Announcement Section */}
      <section className="py-16 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-red-100">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Bell className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Be the First to Know
            </h2>
            <p className="text-gray-600 mb-6">
              Applications for the next cohort of PolicyNow Fellows will open soon. Join our newsletter to receive an exclusive announcement about application dates, program details, and selection criteria.
            </p>
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700"
              onClick={showPopupManually}
            >
              <Mail className="mr-2 h-5 w-5" />
              Join Our Newsletter
            </Button>
          </div>
        </div>
      </section>

      {/* Program Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join the Fellows Program?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our fellowship provides unparalleled opportunities for professional growth, research collaboration, and policy impact.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Research Excellence</h3>
                <p className="text-gray-600">
                  Conduct cutting-edge research on AI policy with access to exclusive data, expert mentorship, and publication opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Network className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Elite Network</h3>
                <p className="text-gray-600">
                  Connect with leading policymakers, researchers, and industry leaders across Canada's AI ecosystem.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Target className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real Impact</h3>
                <p className="text-gray-600">
                  Your research directly influences Canadian AI policy through government briefings and public consultations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Collaborative Environment</h3>
                <p className="text-gray-600">
                  Work alongside interdisciplinary teams of economists, technologists, ethicists, and policy experts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Career Advancement</h3>
                <p className="text-gray-600">
                  Build expertise that positions you as a leader in the rapidly growing field of AI governance and policy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Flexible Program</h3>
                <p className="text-gray-600">
                  12-month fellowship with flexible scheduling to accommodate academic and professional commitments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What You'll Do as a Fellow</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Policy Research Projects</h3>
                    <p className="text-gray-600">Lead or contribute to high-impact research on AI governance, ethics, and regulation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Expert Roundtables</h3>
                    <p className="text-gray-600">Participate in monthly discussions with government officials and industry leaders</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Public Communications</h3>
                    <p className="text-gray-600">Author policy briefs, op-eds, and research publications for broad audiences</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Mentorship & Training</h3>
                    <p className="text-gray-600">Receive guidance from senior researchers and access professional development workshops</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop" 
                alt="Collaborative research environment" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Current and Past Fellows */}
      <main className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Current Fellows */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Current Fellows</h2>
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
              <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                <CardContent className="p-12 text-center">
                  <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
                    <Award className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Next Cohort Coming Soon</h3>
                  <p className="text-gray-600 mb-6">We're preparing to welcome our next cohort of talented fellows. Applications will open soon!</p>
                  <Button 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={showPopupManually}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Get Notified
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Past Fellows */}
          {pastFellows && pastFellows.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Award className="w-6 h-6 text-gray-600" />
                <h2 className="text-3xl font-bold text-gray-900">Past Fellows</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastFellows.map(renderFellowCard)}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <NewsletterPopup isOpen={showPopup} onClose={hidePopup} />
    </div>
  );
};

export default Fellows;
