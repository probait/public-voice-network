
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BarChart3, Users, MapPin, Calendar, AlertTriangle, CheckCircle, Leaf, Heart } from "lucide-react";

const Data = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Navigation />
      
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Canadian flair */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Leaf className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-5xl font-bold text-gray-900">Community Voices</h1>
              <Leaf className="h-8 w-8 text-red-600 ml-3" />
            </div>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Real concerns from real Canadians about AI across our great nation. 
              From coast to coast, these voices represent the heart of our democratic dialogue.
            </p>
            <div className="mt-6 flex items-center justify-center text-sm text-red-700">
              <Heart className="h-4 w-4 mr-2" />
              <span>Powered by community participation • Updated daily</span>
            </div>
          </div>

          {/* Key Policy Recommendations - Redesigned with Canadian styling */}
          <div className="bg-white border-l-8 border-red-600 rounded-r-lg shadow-lg p-8 mb-16">
            <div className="flex items-center mb-8">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-red-800">Priority Actions for Canada</h2>
                <p className="text-red-600 mt-2">Based on community input from across the country</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                  <h3 className="text-xl font-semibold text-red-800">Immediate Community Needs</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-800">Fair AI hiring practices for all Canadians</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-800">Worker retraining programs in every province</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-800">Protect Indigenous data sovereignty</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-800">Transparent healthcare AI for all</span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-blue-800">Building Canada's Future</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">AI education in schools from K-12</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">Rural broadband for digital equity</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">National AI ethics council</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">Cross-provincial AI standards</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Community Stats - Redesigned */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Growing Movement</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 text-center border-t-4 border-red-500 hover:shadow-lg transition-shadow">
                <Users className="h-10 w-10 text-red-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">2,347</div>
                <div className="text-sm text-gray-600 font-medium">Voices Heard</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
                <MapPin className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">13</div>
                <div className="text-sm text-gray-600 font-medium">Provinces & Territories</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center border-t-4 border-green-500 hover:shadow-lg transition-shadow">
                <BarChart3 className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">8</div>
                <div className="text-sm text-gray-600 font-medium">Key Sectors</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 text-center border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
                <Calendar className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">47</div>
                <div className="text-sm text-gray-600 font-medium">Community Events</div>
              </div>
            </div>
          </div>

          {/* What Canadians Are Saying */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Canadians Are Saying</h2>
              <p className="text-lg text-gray-600">Breaking down concerns by the issues that matter most</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { sector: "Employment", concerns: 487, topConcern: "Job displacement from automation", percentage: 21, color: "red" },
                { sector: "Healthcare", concerns: 412, topConcern: "AI bias in diagnostics", percentage: 18, color: "blue" },
                { sector: "Privacy", concerns: 356, topConcern: "Data collection without consent", percentage: 15, color: "green" },
                { sector: "Education", concerns: 298, topConcern: "AI replacing teachers", percentage: 13, color: "yellow" },
                { sector: "Ethics", concerns: 267, topConcern: "Algorithmic discrimination", percentage: 11, color: "purple" },
                { sector: "Economy", concerns: 234, topConcern: "Small business adaptation costs", percentage: 10, color: "indigo" },
                { sector: "Regulation", concerns: 189, topConcern: "Lack of oversight frameworks", percentage: 8, color: "pink" },
                { sector: "Other", concerns: 104, topConcern: "Environmental impact of AI", percentage: 4, color: "gray" }
              ].map((sector) => (
                <div key={sector.sector} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100">
                  <div className={`w-12 h-12 bg-${sector.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                    <div className={`w-6 h-6 bg-${sector.color}-500 rounded`}></div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{sector.sector}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Concerns:</span>
                      <span className="font-bold text-gray-900">{sector.concerns}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Share:</span>
                      <span className="font-bold text-gray-900">{sector.percentage}%</span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Top Concern:</p>
                    <p className="text-sm text-gray-800 leading-tight">{sector.topConcern}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coast to Coast - Regional Analysis */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">From Coast to Coast</h2>
              <p className="text-lg text-gray-600">Every province and territory has a voice in Canada's AI future</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { province: "ON", name: "Ontario", submissions: 687, topConcern: "Employment automation", flag: "🇨🇦" },
                { province: "QC", name: "Quebec", submissions: 523, topConcern: "Language preservation in AI", flag: "⚜️" },
                { province: "BC", name: "British Columbia", submissions: 445, topConcern: "Tech sector worker rights", flag: "🏔️" },
                { province: "AB", name: "Alberta", submissions: 298, topConcern: "Energy sector AI transition", flag: "🛢️" },
                { province: "MB", name: "Manitoba", submissions: 134, topConcern: "Rural healthcare AI access", flag: "🌾" },
                { province: "SK", name: "Saskatchewan", submissions: 89, topConcern: "Agricultural data ownership", flag: "🌾" },
                { province: "NS", name: "Nova Scotia", submissions: 76, topConcern: "Maritime industry changes", flag: "⚓" },
                { province: "NB", name: "New Brunswick", submissions: 45, topConcern: "Bilingual AI services", flag: "🦞" },
                { province: "NL", name: "Newfoundland", submissions: 32, topConcern: "Resource sector automation", flag: "🐟" },
                { province: "PE", name: "Prince Edward Island", submissions: 12, topConcern: "Tourism industry AI", flag: "🥔" },
                { province: "YT", name: "Yukon", submissions: 4, topConcern: "Northern connectivity", flag: "❄️" },
                { province: "NT", name: "Northwest Territories", submissions: 2, topConcern: "Indigenous data rights", flag: "🏔️" }
              ].map((region) => (
                <div key={region.province} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-l-4 border-red-500">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{region.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{region.flag}</span>
                      <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {region.province}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Community voices:</span>
                      <span className="font-bold text-red-600 text-lg">{region.submissions}</span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Primary concern:</p>
                    <p className="text-sm text-gray-800 leading-tight font-medium">{region.topConcern}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Events Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Conversations</h2>
              <p className="text-lg text-gray-600">Real discussions happening in communities across Canada</p>
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2" />
                <div className="text-xl font-bold">6</div>
                <div className="text-sm opacity-90">Community Events</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <div className="text-xl font-bold">1,109</div>
                <div className="text-sm opacity-90">Participants</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 text-center">
                <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                <div className="text-xl font-bold">22.3h</div>
                <div className="text-sm opacity-90">Recorded Discussions</div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4 text-center">
                <MapPin className="h-6 w-6 mx-auto mb-2" />
                <div className="text-xl font-bold">6</div>
                <div className="text-sm opacity-90">Cities Visited</div>
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  title: "AI and the Future of Work",
                  location: "Toronto, ON",
                  date: "December 8, 2024",
                  attendees: 245,
                  duration: "4.5h",
                  themes: ["Job displacement", "Retraining programs", "Union perspectives"],
                  quote: "We need policies that protect workers while embracing technological advancement.",
                  emoji: "🏭"
                },
                {
                  title: "Healthcare AI Ethics Forum",
                  location: "Vancouver, BC",
                  date: "December 5, 2024",
                  attendees: 189,
                  duration: "3.2h",
                  themes: ["Diagnostic bias", "Patient privacy", "Rural access"],
                  quote: "AI should augment human judgment in healthcare, never replace it entirely.",
                  emoji: "🏥"
                },
                {
                  title: "Indigenous Data Sovereignty Summit",
                  location: "Winnipeg, MB",
                  date: "December 1, 2024",
                  attendees: 156,
                  duration: "6.0h",
                  themes: ["Traditional knowledge", "Data ownership", "Cultural preservation"],
                  quote: "Our communities must control how AI systems use data about our lands and peoples.",
                  emoji: "🪶"
                },
                {
                  title: "AI in Education Roundtable",
                  location: "Montreal, QC",
                  date: "November 28, 2024",
                  attendees: 134,
                  duration: "2.8h",
                  themes: ["Student privacy", "Teacher training", "Multilingual support"],
                  quote: "Quebec's education system must ensure AI serves our linguistic and cultural values.",
                  emoji: "🎓"
                },
                {
                  title: "Rural Innovation & AI",
                  location: "Calgary, AB",
                  date: "November 25, 2024",
                  attendees: 98,
                  duration: "3.5h",
                  themes: ["Agricultural automation", "Connectivity gaps", "Energy transition"],
                  quote: "AI promises are empty without reliable rural internet infrastructure.",
                  emoji: "🚜"
                },
                {
                  title: "Maritime AI Opportunities",
                  location: "Halifax, NS",
                  date: "November 22, 2024",
                  attendees: 87,
                  duration: "2.3h",
                  themes: ["Fishing industry", "Coastal monitoring", "Tourism tech"],
                  quote: "Technology should enhance Maritime traditions, not replace them.",
                  emoji: "⚓"
                }
              ].map((event, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">{event.emoji}</span>
                        <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-gray-600">Attendees:</span>
                      <span className="font-bold text-gray-900 ml-2">{event.attendees}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-bold text-gray-900 ml-2">{event.duration}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2 text-gray-700">Key Discussion Points:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.themes.map((theme, i) => (
                        <span key={i} className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <p className="text-xs text-red-600 mb-1 font-medium uppercase tracking-wide">Community Voice:</p>
                    <p className="text-sm italic text-red-800 font-medium">"{event.quote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Data;
