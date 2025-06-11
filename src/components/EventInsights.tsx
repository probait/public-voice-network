
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Mic } from "lucide-react";

const EventInsights = () => {
  const eventData = [
    {
      id: 1,
      title: "AI and the Future of Work - Toronto",
      date: "2024-12-08",
      location: "Toronto, ON",
      attendees: 245,
      transcriptedHours: 4.5,
      keyThemes: ["Job displacement", "Retraining programs", "Union perspectives"],
      topQuote: "We need policies that protect workers while embracing technological advancement."
    },
    {
      id: 2,
      title: "Healthcare AI Ethics Forum - Vancouver",
      date: "2024-12-05",
      location: "Vancouver, BC",
      attendees: 189,
      transcriptedHours: 3.2,
      keyThemes: ["Diagnostic bias", "Patient privacy", "Rural access"],
      topQuote: "AI should augment human judgment in healthcare, never replace it entirely."
    },
    {
      id: 3,
      title: "Indigenous Data Sovereignty Summit - Winnipeg",
      date: "2024-12-01",
      location: "Winnipeg, MB",
      attendees: 156,
      transcriptedHours: 6.0,
      keyThemes: ["Traditional knowledge", "Data ownership", "Cultural preservation"],
      topQuote: "Our communities must control how AI systems use data about our lands and peoples."
    },
    {
      id: 4,
      title: "AI in Education Roundtable - Montreal",
      date: "2024-11-28",
      location: "Montreal, QC",
      attendees: 134,
      transcriptedHours: 2.8,
      keyThemes: ["Student privacy", "Teacher training", "Multilingual support"],
      topQuote: "Quebec's education system must ensure AI serves our linguistic and cultural values."
    },
    {
      id: 5,
      title: "Rural Innovation & AI - Calgary",
      date: "2024-11-25",
      location: "Calgary, AB",
      attendees: 98,
      transcriptedHours: 3.5,
      keyThemes: ["Agricultural automation", "Connectivity gaps", "Energy transition"],
      topQuote: "AI promises are empty without reliable rural internet infrastructure."
    },
    {
      id: 6,
      title: "Maritime AI Opportunities - Halifax",
      date: "2024-11-22",
      location: "Halifax, NS",
      attendees: 87,
      transcriptedHours: 2.3,
      keyThemes: ["Fishing industry", "Coastal monitoring", "Tourism tech"],
      topQuote: "Technology should enhance Maritime traditions, not replace them."
    }
  ];

  const totalAttendees = eventData.reduce((sum, event) => sum + event.attendees, 0);
  const totalHours = eventData.reduce((sum, event) => sum + event.transcriptedHours, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold">{eventData.length}</div>
            <div className="text-sm text-gray-600">Events Held</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold">{totalAttendees.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Attendees</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Mic className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold">{totalHours.toFixed(1)}h</div>
            <div className="text-sm text-gray-600">Transcribed Content</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-xl font-bold">6</div>
            <div className="text-sm text-gray-600">Cities Visited</div>
          </CardContent>
        </Card>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {eventData.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.location}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Attendees: <strong>{event.attendees}</strong></span>
                  <span>Transcribed: <strong>{event.transcriptedHours}h</strong></span>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Key Themes:</p>
                  <div className="flex flex-wrap gap-1">
                    {event.keyThemes.map((theme, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500 mb-1">Representative Quote:</p>
                  <p className="text-sm italic text-gray-700">"{event.topQuote}"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventInsights;
