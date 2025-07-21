import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Calendar, MessageSquare, TrendingUp, Star, Clock, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';
const AdminDashboard = () => {
  const {
    data: stats,
    isLoading
  } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [contributors, articles, events, users, featuredEvents, upcomingEvents, recentUsers] = await Promise.all([supabase.from('contributors').select('id', {
        count: 'exact',
        head: true
      }), supabase.from('articles').select('id, is_published', {
        count: 'exact'
      }), supabase.from('meetups').select('id, date_time'), supabase.from('profiles').select('id, created_at'), supabase.from('meetups').select('id').eq('homepage_featured', true), supabase.from('meetups').select('id').gte('date_time', new Date().toISOString()), supabase.from('profiles').select('id, created_at').gte('created_at', subDays(new Date(), 7).toISOString())]);
      const publishedArticles = articles.data?.filter(a => a.is_published).length || 0;
      const todaysEvents = events.data?.filter(e => isAfter(new Date(e.date_time), new Date()) && format(new Date(e.date_time), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length || 0;
      return {
        contributors: contributors.count || 0,
        articles: articles.count || 0,
        publishedArticles,
        events: events.count || 0,
        users: users.count || 0,
        featuredEvents: featuredEvents.data?.length || 0,
        upcomingEvents: upcomingEvents.data?.length || 0,
        recentUsers: recentUsers.data?.length || 0,
        todaysEvents
      };
    }
  });
  const {
    data: recentActivity
  } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const [recentContributors, recentArticles, recentEvents, recentMeetups] = await Promise.all([supabase.from('contributors').select('name, created_at, is_featured').order('created_at', {
        ascending: false
      }).limit(5), supabase.from('articles').select('title, created_at, is_published').order('created_at', {
        ascending: false
      }).limit(5), supabase.from('meetups').select('title, created_at, date_time, homepage_featured').order('created_at', {
        ascending: false
      }).limit(5), supabase.from('attendees').select('created_at, meetup_id, meetups(title)').order('created_at', {
        ascending: false
      }).limit(10)]);
      return {
        contributors: recentContributors.data || [],
        articles: recentArticles.data || [],
        events: recentEvents.data || [],
        attendees: recentMeetups.data || []
      };
    }
  });
  const {
    data: systemHealth
  } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const now = new Date();
      const weekAgo = subDays(now, 7);
      const [errorLogs, totalEvents, totalUsers] = await Promise.all([
      // Check for any system issues (placeholder - would implement real error tracking)
      Promise.resolve([]), supabase.from('meetups').select('id', {
        count: 'exact',
        head: true
      }), supabase.from('profiles').select('id', {
        count: 'exact',
        head: true
      })]);
      return {
        status: 'healthy',
        // Could be 'healthy', 'warning', 'error'
        lastChecked: now,
        errors: errorLogs.length,
        uptime: '99.9%',
        // Would calculate from real data
        totalEvents: totalEvents.count || 0,
        totalUsers: totalUsers.count || 0
      };
    }
  });
  const statCards = [{
    title: 'Total Contributors',
    value: stats?.contributors || 0,
    subtitle: `${stats?.recentUsers || 0} this week`,
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  }, {
    title: 'Published Articles',
    value: stats?.publishedArticles || 0,
    subtitle: `${stats?.articles || 0} total drafts`,
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }, {
    title: 'Events Today',
    value: stats?.todaysEvents || 0,
    subtitle: `${stats?.upcomingEvents || 0} upcoming`,
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }, {
    title: 'Featured Events',
    value: stats?.featuredEvents || 0,
    subtitle: '3 max allowed',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  }];
  return <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with AI Canada Voice.
            </p>
          </div>
          
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {statCards.map(stat => {
          const Icon = stat.icon;
          return <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-md ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">
                    {isLoading ? '...' : stat.value}
                  </div>
                  <p className="text-xs text-gray-500">
                    {stat.subtitle}
                  </p>
                </CardContent>
              </Card>;
        })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors">
                <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-medium">Create Event</h4>
                <p className="text-sm text-gray-500">Add a new meetup or event</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors">
                <Users className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="font-medium">Add Contributor</h4>
                <p className="text-sm text-gray-500">Register a new expert</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors">
                <FileText className="h-6 w-6 text-purple-600 mb-2" />
                <h4 className="font-medium">Draft Article</h4>
                <p className="text-sm text-gray-500">Start writing content</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors">
                <TrendingUp className="h-6 w-6 text-orange-600 mb-2" />
                <h4 className="font-medium">View Analytics</h4>
                <p className="text-sm text-gray-500">Check engagement metrics</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        

      </div>
    </AdminLayout>;
};
export default AdminDashboard;