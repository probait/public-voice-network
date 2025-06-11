import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EventbriteFeed from "@/components/EventbriteFeed";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import SubmissionsFeed from "@/components/SubmissionsFeed";

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
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
              <img 
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop"
                alt="AI and technology in Canada" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Voices from Canadians Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Voices from Across Canada
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real Canadians sharing their thoughts, concerns, and hopes about AI's impact on their communities
            </p>
          </div>
          <SubmissionsFeed />
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
        </div>
      </section>

      {/* Featured Issues */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Key Issues Facing Canada
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=64&h=64&fit=crop" alt="Job displacement" className="w-8 h-8 rounded" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Job Displacement</h3>
              <p className="text-gray-600">
                How will AI automation affect Canadian workers across industries from manufacturing to professional services?
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=64&h=64&fit=crop" alt="Privacy and security" className="w-8 h-8 rounded" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Privacy & Rights</h3>
              <p className="text-gray-600">
                What safeguards do we need to protect Canadian privacy and civil liberties in an AI-driven world?
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=64&h=64&fit=crop" alt="Healthcare innovation" className="w-8 h-8 rounded" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Healthcare Innovation</h3>
              <p className="text-gray-600">
                How can AI improve Canadian healthcare while ensuring equitable access across all provinces and territories?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming AI Events in Canada</h2>
            <Link to="/events">
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                View all events
              </Button>
            </Link>
          </div>
          <EventbriteFeed />
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
