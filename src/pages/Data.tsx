
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectorAnalytics from "@/components/SectorAnalytics";
import RegionalAnalytics from "@/components/RegionalAnalytics";
import EventInsights from "@/components/EventInsights";
import { BarChart3, Users, MapPin, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

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

          {/* Key Policy Recommendations - Moved to top */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-8 mb-12 shadow-sm">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-red-800">Key Policy Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                  <h3 className="text-xl font-semibold text-red-700">Immediate Actions Needed</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">Implement AI bias testing requirements for hiring systems</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">Establish worker retraining programs for AI-displaced jobs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">Create Indigenous data sovereignty frameworks</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">Mandate transparent AI decision-making in healthcare</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-red-600 mr-2" />
                  <h3 className="text-xl font-semibold text-red-700">Long-term Strategic Goals</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">Develop comprehensive AI education curricula</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">Build rural broadband infrastructure for AI access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">Establish national AI ethics review board</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">Create cross-provincial AI governance standards</span>
                  </li>
                </ul>
              </div>
            </div>
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Data;
