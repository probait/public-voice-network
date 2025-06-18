
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Calendar, ExternalLink, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Prompts = () => {
  const { data: prompts, isLoading } = useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  };

  const isOverdue = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate < today;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Curated Prompts</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Contribute to Canada's AI policy discourse by responding to our curated prompts. 
              Each prompt addresses critical questions about AI's impact on Canadian society, 
              economy, and governance. Your insights help shape evidence-based policy recommendations.
            </p>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                <h2 className="text-lg font-semibold text-purple-900">How to Contribute</h2>
              </div>
              <p className="text-purple-800 max-w-3xl mx-auto mb-4">
                Select a prompt that interests you, review the background materials, and submit your response. 
                Contributions can be academic papers, policy briefs, data analysis, or thoughtful commentary. 
                All submissions undergo peer review before publication.
              </p>
              <Link to="/get-involved">
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                  Learn More About Contributing
                </Button>
              </Link>
            </div>
          </div>

          {/* Active Prompts */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Current Prompts</h2>
              <Badge variant="outline" className="text-sm">
                {prompts?.length || 0} active prompts
              </Badge>
            </div>
            
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : prompts && prompts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {prompts.map((prompt) => (
                  <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl leading-tight pr-4">{prompt.title}</CardTitle>
                        <div className="flex flex-col gap-2">
                          {prompt.category && (
                            <Badge variant="outline" className="text-xs">
                              {prompt.category}
                            </Badge>
                          )}
                          {prompt.deadline && (
                            <Badge 
                              className={`text-xs ${
                                isOverdue(prompt.deadline) 
                                  ? 'bg-red-100 text-red-800' 
                                  : isDeadlineApproaching(prompt.deadline)
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              {isOverdue(prompt.deadline) ? 'Overdue' : 'Active'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {prompt.description && (
                        <p className="text-gray-700 mb-4 line-clamp-4">
                          {prompt.description}
                        </p>
                      )}
                      
                      {prompt.deadline && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Deadline: {new Date(prompt.deadline).toLocaleDateString()}
                            {isDeadlineApproaching(prompt.deadline) && (
                              <span className="text-yellow-600 font-medium ml-2">
                                (Due soon!)
                              </span>
                            )}
                            {isOverdue(prompt.deadline) && (
                              <span className="text-red-600 font-medium ml-2">
                                (Overdue)
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Link to="/get-involved">
                          <Button 
                            size="sm" 
                            className={
                              isOverdue(prompt.deadline) 
                                ? "bg-gray-400 hover:bg-gray-500" 
                                : "bg-purple-600 hover:bg-purple-700"
                            }
                            disabled={isOverdue(prompt.deadline)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {isOverdue(prompt.deadline) ? 'Deadline Passed' : 'Contribute'}
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-3">
                        Posted {new Date(prompt.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Prompts</h3>
                  <p className="text-gray-600 mb-6">
                    We're currently developing new prompts for contributors. Check back soon for opportunities to share your insights!
                  </p>
                  <Link to="/get-involved">
                    <Button variant="outline">
                      Get Notified of New Prompts
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </section>

          {/* How to Contribute Section */}
          <section className="mt-16">
            <div className="bg-white rounded-lg border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contribution Guidelines</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Choose Your Prompt</h3>
                  <p className="text-gray-600 text-sm">
                    Select a prompt that aligns with your expertise and interests
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Research & Write</h3>
                  <p className="text-gray-600 text-sm">
                    Develop your response using evidence-based analysis and clear reasoning
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Submit & Review</h3>
                  <p className="text-gray-600 text-sm">
                    Submit your contribution for peer review and potential publication
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Prompts;
