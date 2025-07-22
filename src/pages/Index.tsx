
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import FeaturedContributor from '@/components/FeaturedContributor';
import MeetupFeed from '@/components/MeetupFeed';
import SubmissionsFeed from '@/components/SubmissionsFeed';
import CommunityFeed from '@/components/CommunityFeed';
import EventInsights from '@/components/EventInsights';
import ThoughtsSubmissionForm from '@/components/ThoughtsSubmissionForm';
import OrganizationContactForm from '@/components/OrganizationContactForm';
import AuthModal from '@/components/AuthModal';
import NewsletterPopup from '@/components/NewsletterPopup';
import { useAuth } from '@/hooks/useAuth';
import { useUserPermissions } from '@/hooks/useUserPermissions';

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { canAccessAdminPortal, loading: permissionsLoading } = useUserPermissions();

  // Handle auth modal from URL params
  useEffect(() => {
    if (searchParams.get('showAuth') === 'true') {
      setShowAuth(true);
    }
  }, [searchParams]);

  // Handle redirect after login - only attempt once and with proper checks
  useEffect(() => {
    // Don't attempt redirect if still loading or if noRedirect param is present
    if (authLoading || permissionsLoading || searchParams.has('noRedirect')) {
      return;
    }

    // Only proceed if user is authenticated
    if (!user) {
      return;
    }

    const redirectPath = sessionStorage.getItem('redirectAfterLogin');
    console.log('🏠 [Index] Checking redirect:', { user: user.id, redirectPath, canAccess: canAccessAdminPortal() });
    
    if (redirectPath && redirectPath.startsWith('/admin')) {
      // Check if user can actually access admin portal
      if (canAccessAdminPortal()) {
        console.log('🏠 [Index] User can access admin, redirecting to:', redirectPath);
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath, { replace: true });
      } else {
        console.log('🏠 [Index] User cannot access admin portal, clearing redirect');
        // User can't access admin portal, clear the redirect
        sessionStorage.removeItem('redirectAfterLogin');
      }
    }
  }, [user, authLoading, permissionsLoading, navigate, canAccessAdminPortal, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Shaping Canada's <span className="text-red-600">Policy Future</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connecting citizens, policymakers, and thought leaders to drive evidence-based policy solutions across Canada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowAuth(true)}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Join the Movement
              </button>
              <a 
                href="#get-involved" 
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-medium border border-red-600 hover:bg-red-50 transition-colors"
              >
                Get Involved
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Contributor Section */}
      <FeaturedContributor />

      {/* Event Insights Section */}
      <EventInsights />

      {/* Meetups Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Policy Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our community at policy discussions, workshops, and networking events across Canada.
            </p>
          </div>
          <MeetupFeed />
        </div>
      </section>

      {/* Community Submissions Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Citizen Thoughts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real insights from Canadians on policy issues that matter to our communities.
            </p>
          </div>
          <SubmissionsFeed />
        </div>
      </section>

      {/* Get Involved Section */}
      <section id="get-involved" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Involved</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Share your thoughts on policy issues or connect with us about partnership opportunities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Thoughts Submission Form */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Your Policy Thoughts</h3>
              <ThoughtsSubmissionForm />
            </div>
            
            {/* Partnership Form */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Partnership Opportunities</h3>
              <OrganizationContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Community Feed Section */}
      <CommunityFeed />

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />
      
      <NewsletterPopup />
    </div>
  );
};

export default Index;
