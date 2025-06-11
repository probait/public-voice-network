
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BarChart3, Users, MapPin, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

const Data = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Key Policy Recommendations - At the top */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Employment</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Concerns:</span>
                    <span className="font-semibold">487</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <span className="font-semibold">21%</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Top Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Job displacement from automation</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Healthcare</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Concerns:</span>
                    <span className="font-semibold">412</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <span className="font-semibold">18%</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Top Concern:</p>
                    <p className="text-sm font-medium text-gray-800">AI bias in diagnostics</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Privacy</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Concerns:</span>
                    <span className="font-semibold">356</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <span className="font-semibold">15%</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Top Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Data collection without consent</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Education</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Concerns:</span>
                    <span className="font-semibold">298</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <span className="font-semibold">13%</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Top Concern:</p>
                    <p className="text-sm font-medium text-gray-800">AI replacing teachers</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Ethics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Concerns:</span>
                    <span className="font-semibold">267</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <span className="font-semibold">11%</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Top Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Algorithmic discrimination</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Economy</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Concerns:</span>
                    <span className="font-semibold">234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <span className="font-semibold">10%</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Top Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Small business adaptation costs</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Regulation</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Concerns:</span>
                    <span className="font-semibold">189</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <span className="font-semibold">8%</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Top Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Lack of oversight frameworks</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Other</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Concerns:</span>
                    <span className="font-semibold">104</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <span className="font-semibold">4%</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Top Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Environmental impact of AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Analysis */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Regional Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex justify-between">
                  <span>Ontario</span>
                  <span className="text-sm font-normal text-gray-500">(ON)</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions:</span>
                    <span className="font-semibold">687</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Primary Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Employment automation</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex justify-between">
                  <span>Quebec</span>
                  <span className="text-sm font-normal text-gray-500">(QC)</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions:</span>
                    <span className="font-semibold">523</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Primary Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Language preservation in AI</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex justify-between">
                  <span>British Columbia</span>
                  <span className="text-sm font-normal text-gray-500">(BC)</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions:</span>
                    <span className="font-semibold">445</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Primary Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Tech sector worker rights</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex justify-between">
                  <span>Alberta</span>
                  <span className="text-sm font-normal text-gray-500">(AB)</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions:</span>
                    <span className="font-semibold">298</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Primary Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Energy sector AI transition</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex justify-between">
                  <span>Manitoba</span>
                  <span className="text-sm font-normal text-gray-500">(MB)</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions:</span>
                    <span className="font-semibold">134</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Primary Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Rural healthcare AI access</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex justify-between">
                  <span>Saskatchewan</span>
                  <span className="text-sm font-normal text-gray-500">(SK)</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions:</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Primary Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Agricultural data ownership</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex justify-between">
                  <span>Nova Scotia</span>
                  <span className="text-sm font-normal text-gray-500">(NS)</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions:</span>
                    <span className="font-semibold">76</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Primary Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Maritime industry changes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex justify-between">
                  <span>New Brunswick</span>
                  <span className="text-sm font-normal text-gray-500">(NB)</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions:</span>
                    <span className="font-semibold">45</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Primary Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Bilingual AI services</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex justify-between">
                  <span>Newfoundland</span>
                  <span className="text-sm font-normal text-gray-500">(NL)</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions:</span>
                    <span className="font-semibold">32</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Primary Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Resource sector automation</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex justify-between">
                  <span>Prince Edward Island</span>
                  <span className="text-sm font-normal text-gray-500">(PE)</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions:</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Primary Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Tourism industry AI</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex justify-between">
                  <span>Yukon</span>
                  <span className="text-sm font-normal text-gray-500">(YT)</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions:</span>
                    <span className="font-semibold">4</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Primary Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Northern connectivity</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex justify-between">
                  <span>Northwest Territories</span>
                  <span className="text-sm font-normal text-gray-500">(NT)</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions:</span>
                    <span className="font-semibold">2</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Primary Concern:</p>
                    <p className="text-sm font-medium text-gray-800">Indigenous data rights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Insights */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Event Insights</h2>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold">6</div>
                <div className="text-sm text-gray-600">Events Held</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-xl font-bold">1,109</div>
                <div className="text-sm text-gray-600">Total Attendees</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-bold">22.3h</div>
                <div className="text-sm text-gray-600">Transcribed Content</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <MapPin className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="text-xl font-bold">6</div>
                <div className="text-sm text-gray-600">Cities Visited</div>
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">AI and the Future of Work - Toronto</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    December 8, 2024
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Toronto, ON
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Attendees: <strong>245</strong></span>
                    <span>Transcribed: <strong>4.5h</strong></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Key Themes:</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Job displacement</span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Retraining programs</span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Union perspectives</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Representative Quote:</p>
                    <p className="text-sm italic text-gray-700">"We need policies that protect workers while embracing technological advancement."</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Healthcare AI Ethics Forum - Vancouver</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    December 5, 2024
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Vancouver, BC
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Attendees: <strong>189</strong></span>
                    <span>Transcribed: <strong>3.2h</strong></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Key Themes:</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Diagnostic bias</span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Patient privacy</span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Rural access</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Representative Quote:</p>
                    <p className="text-sm italic text-gray-700">"AI should augment human judgment in healthcare, never replace it entirely."</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Indigenous Data Sovereignty Summit - Winnipeg</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    December 1, 2024
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Winnipeg, MB
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Attendees: <strong>156</strong></span>
                    <span>Transcribed: <strong>6.0h</strong></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Key Themes:</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Traditional knowledge</span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Data ownership</span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Cultural preservation</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Representative Quote:</p>
                    <p className="text-sm italic text-gray-700">"Our communities must control how AI systems use data about our lands and peoples."</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">AI in Education Roundtable - Montreal</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    November 28, 2024
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Montreal, QC
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Attendees: <strong>134</strong></span>
                    <span>Transcribed: <strong>2.8h</strong></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Key Themes:</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Student privacy</span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Teacher training</span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Multilingual support</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Representative Quote:</p>
                    <p className="text-sm italic text-gray-700">"Quebec's education system must ensure AI serves our linguistic and cultural values."</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Rural Innovation & AI - Calgary</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    November 25, 2024
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Calgary, AB
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Attendees: <strong>98</strong></span>
                    <span>Transcribed: <strong>3.5h</strong></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Key Themes:</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Agricultural automation</span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Connectivity gaps</span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Energy transition</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Representative Quote:</p>
                    <p className="text-sm italic text-gray-700">"AI promises are empty without reliable rural internet infrastructure."</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Maritime AI Opportunities - Halifax</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    November 22, 2024
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Halifax, NS
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Attendees: <strong>87</strong></span>
                    <span>Transcribed: <strong>2.3h</strong></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Key Themes:</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Fishing industry</span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Coastal monitoring</span>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Tourism tech</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Representative Quote:</p>
                    <p className="text-sm italic text-gray-700">"Technology should enhance Maritime traditions, not replace them."</p>
                  </div>
                </div>
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
