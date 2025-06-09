
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SubmissionForm from "@/components/SubmissionForm";
import CommunityFeed from "@/components/CommunityFeed";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 civic-text-gradient">
            Your Voice Matters
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Share the issues and concerns affecting your daily life. Together, we can drive understanding and change.
          </p>
        </div>
      </section>

      {/* Submission Form Section */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Share Your Concern</h2>
            <SubmissionForm />
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Community Voices is a public platform where anyone can share the issues and concerns affecting their daily life. 
            By collecting and sharing these voices, we aim to give policymakers, nonprofits, and commercial AI firms better 
            insight into the real challenges faced by communities across the globe.
          </p>
          <Link to="/about">
            <Button variant="outline">Learn More About Us</Button>
          </Link>
        </div>
      </section>

      {/* Recent Community Feed Preview */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recent Community Voices</h2>
            <Link to="/feed">
              <Button>View All</Button>
            </Link>
          </div>
          <CommunityFeed limit={5} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
