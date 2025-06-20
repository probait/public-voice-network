import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EventbriteFeed from "@/components/EventbriteFeed";
import FeaturedContributor from "@/components/FeaturedContributor";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import SubmissionsFeed from "@/components/SubmissionsFeed";
import MeetupFeed from "@/components/MeetupFeed";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // User is authenticated, stay on homepage
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        {/* House of Commons background image with overlay */}
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/d2c84baf-534d-4715-9e32-2deda000aca7.png" 
            alt="Canada House of Commons"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/85 to-orange-600/85"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                AI's Impact on Canada
              </h1>
              <p className="text-xl sm:text-2xl mb-8 opacity-90">
                Exploring the challenges, opportunities, and policy implications of artificial intelligence for Canadian communities.
              </p>
              <Link to="/get-involved">
                <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Get Involved
                </Button>
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4 text-white">Voices from Across Canada</h3>
                <div className="max-h-96 overflow-hidden">
                  <SubmissionsFeed />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Contributor Section */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedContributor />
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upcoming AI Events & AMAs
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join conversations, ask questions, and connect with experts discussing AI's impact on Canada
            </p>
          </div>
          
          {/* Community Meetups */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Community Meetups</h3>
            <MeetupFeed limit={6} />
          </div>

          {/* External Events */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">External Events & Conferences</h3>
            <EventbriteFeed />
          </div>

          <div className="text-center mt-8">
            <Link to="/events">
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                View all events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              The Future of AI in Canada
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              As artificial intelligence rapidly transforms our economy, healthcare, education, and daily lives, 
              Canadians deserve a voice in shaping how this technology impacts our communities. From coast to coast, 
              we're witnessing both the incredible potential and concerning challenges that AI brings to our nation.
            </p>
          </div>
          
          {/* YouTube Video Section */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/di25i8z0Tn4?si=M0VqjFfNU7HPoKza"
                  title="Understanding AI's Impact on Canada"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Understanding AI's Impact on Canada
                </h3>
                <p className="text-gray-600">
                  Watch this introduction to learn about the key challenges and opportunities 
                  that artificial intelligence presents for Canadian communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Issues */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Key Issues Facing Canada
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/articles/job-displacement" className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white border-0 shadow-md">
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop" 
                      alt="Job displacement and automation" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-red-600 transition-colors">
                      Job Displacement & Automation
                    </h3>
                    <p className="text-gray-600 mb-4">
                      How will AI automation affect Canadian workers across industries from manufacturing to professional services?
                    </p>
                    <div className="flex items-center text-red-600 font-medium">
                      Read more <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/articles/privacy-rights" className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white border-0 shadow-md">
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop" 
                      alt="Privacy and digital rights" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-red-600 transition-colors">
                      Privacy & Digital Rights
                    </h3>
                    <p className="text-gray-600 mb-4">
                      What safeguards do we need to protect Canadian privacy and civil liberties in an AI-driven world?
                    </p>
                    <div className="flex items-center text-red-600 font-medium">
                      Read more <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/articles/healthcare-innovation" className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white border-0 shadow-md">
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=225&fit=crop" 
                      alt="Healthcare innovation and AI" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-red-600 transition-colors">
                      Healthcare Innovation
                    </h3>
                    <p className="text-gray-600 mb-4">
                      How can AI improve Canadian healthcare while ensuring equitable access across all provinces and territories?
                    </p>
                    <div className="flex items-center text-red-600 font-medium">
                      Read more <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-red-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Your Voice Matters
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Share your thoughts, concerns, and ideas about how AI is affecting your community. 
            Together, we can shape a future that works for all Canadians.
          </p>
          <Link to="/get-involved">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3">
              Share Your Thoughts
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
