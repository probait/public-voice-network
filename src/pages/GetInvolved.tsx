
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ThoughtsSubmissionForm from "@/components/ThoughtsSubmissionForm";
import OrganizationContactForm from "@/components/OrganizationContactForm";
import { Button } from "@/components/ui/button";
import { Building2, Users, ChevronDown, ChevronUp } from "lucide-react";

const GetInvolved = () => {
  const [showOrgForm, setShowOrgForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Share Your Voice</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your thoughts and concerns about AI's impact on Canada matter. Whether you're worried about job displacement, 
              excited about healthcare innovations, or have questions about privacy rights, we want to hear from you.
            </p>
          </div>

          {/* Organization Partnership Section */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Organizations & Partners</h3>
                  <p className="text-gray-600 text-sm">
                    Businesses, investors, and institutions interested in collaboration
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowOrgForm(!showOrgForm)}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center gap-2"
              >
                Partner with Us
                {showOrgForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
            
            {showOrgForm && (
              <div className="mt-6 pt-6 border-t border-red-200">
                <div className="bg-white rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Partnership Inquiry</h4>
                  <OrganizationContactForm />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Submit Your Thoughts</h2>
            </div>
            <ThoughtsSubmissionForm />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Why Your Input Matters</h3>
            <p className="text-red-700">
              As AI technology rapidly evolves, policy makers need to hear from real Canadians about how these changes 
              are affecting their lives, work, and communities. Your submissions help inform public discourse and 
              policy decisions that will shape Canada's AI future.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GetInvolved;
