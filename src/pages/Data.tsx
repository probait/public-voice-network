
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectorAnalytics from "@/components/SectorAnalytics";
import RegionalAnalytics from "@/components/RegionalAnalytics";
import EventInsights from "@/components/EventInsights";
import { BarChart3, Users, MapPin, Calendar } from "lucide-react";

const Data = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">AI Policy Research Data</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Comprehensive analysis of Canadian concerns about AI across sectors and regions. 
              This data aggregates submissions from our platform and transcribed insights from public events.
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">2,347</div>
              <div className="text-sm text-gray-600">Total Submissions</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">13</div>
              <div className="text-sm text-gray-600">Provinces & Territories</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Key Sectors</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">47</div>
              <div className="text-sm text-gray-600">Events Transcribed</div>
            </div>
          </div>

          {/* Sector Analysis */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Concerns by Sector</h2>
            <SectorAnalytics />
          </div>

          {/* Regional Analysis */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Regional Analysis</h2>
            <RegionalAnalytics />
          </div>

          {/* Event Insights */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Event Insights</h2>
            <EventInsights />
          </div>

          {/* Policy Recommendations */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-red-800 mb-4">Key Policy Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-red-700 mb-2">Immediate Actions Needed</h4>
                <ul className="text-red-600 space-y-1 text-sm">
                  <li>• Implement AI bias testing requirements for hiring systems</li>
                  <li>• Establish worker retraining programs for AI-displaced jobs</li>
                  <li>• Create Indigenous data sovereignty frameworks</li>
                  <li>• Mandate transparent AI decision-making in healthcare</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-700 mb-2">Long-term Strategic Goals</h4>
                <ul className="text-red-600 space-y-1 text-sm">
                  <li>• Develop comprehensive AI education curricula</li>
                  <li>• Build rural broadband infrastructure for AI access</li>
                  <li>• Establish national AI ethics review board</li>
                  <li>• Create cross-provincial AI governance standards</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Data;
