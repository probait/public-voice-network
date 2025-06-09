
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewSubmissionForm from "@/components/NewSubmissionForm";
import CampaignFeed from "@/components/CampaignFeed";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            The world's platform for change
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Start a campaign. Mobilize supporters. Create change.
          </p>
          {!user && (
            <Link to="/auth">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3">
                Start a campaign
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Campaign Form Section - Only show if user is logged in */}
      {user && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewSubmissionForm />
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">500M+</div>
              <div className="text-gray-600">People taking action</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">195</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">100K+</div>
              <div className="text-gray-600">Victories every month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Campaigns Feed */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent campaigns</h2>
            <Link to="/feed">
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                View all campaigns
              </Button>
            </Link>
          </div>
          <CampaignFeed limit={5} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-red-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to start your campaign?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join millions of people creating positive change in their communities and beyond.
          </p>
          {!user ? (
            <Link to="/auth">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3">
                Get started
              </Button>
            </Link>
          ) : (
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3" onClick={() => {
              document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Start your campaign
            </Button>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
