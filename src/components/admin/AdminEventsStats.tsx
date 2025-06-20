
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Meetup } from '@/types/admin-events';

interface AdminEventsStatsProps {
  events: Meetup[];
}

const AdminEventsStats = ({ events }: AdminEventsStatsProps) => {
  const getEventStats = () => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => new Date(e.date_time) > new Date()).length;
    const totalAttendees = events.reduce((sum, event) => sum + event.attendee_count, 0);
    const avgAttendance = totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0;

    return { totalEvents, upcomingEvents, totalAttendees, avgAttendance };
  };

  const stats = getEventStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEvents}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.upcomingEvents}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Attendees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.totalAttendees}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Avg. Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.avgAttendance}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEventsStats;
