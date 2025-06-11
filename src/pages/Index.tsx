
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
          <EventbriteFeed />
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
          
          {/* Intro Video Section */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  poster="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop"
                >
                  <source src="/intro-video.mp4" type="video/mp4" />
                  <p className="text-gray-600">
                    Your browser does not support the video tag. 
                    <a href="/intro-video.mp4" className="text-red-600 hover:underline">
                      Download the video instead
                    </a>
                  </p>
                </video>
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
