
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useUserRole } from '@/hooks/useUserRole';
import { Users, FileText, Calendar, MessageSquare, TrendingUp, Star, Clock, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import MeetupLoadingSkeleton from '@/components/MeetupLoadingSkeleton';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();
  const { hasPermission } = useUserPermissions();
  
  const {
    data: stats,
    isLoading
  } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Always fetch all stats in parallel, regardless of permissions
      const [
        contributorsResponse,
        articlesResponse, 
        eventsResponse,
        usersResponse,
        featuredEventsResponse,
        upcomingEventsResponse,
        recentUsersResponse
      ] = await Promise.all([
        supabase.from('contributors').select('id', { count: 'exact', head: true }),
        supabase.from('articles').select('id, is_published', { count: 'exact' }),
        supabase.from('meetups').select('id, date_time'),
        supabase.from('profiles').select('id, created_at'),
        supabase.from('meetups').select('id').eq('homepage_featured', true),
        supabase.from('meetups').select('id').gte('date_time', new Date().toISOString()),
        supabase.from('profiles').select('id, created_at').gte('created_at', subDays(new Date(), 7).toISOString())
      ]);
      
      const publishedArticles = articlesResponse.data?.filter(a => a.is_published).length || 0;
      const todaysEvents = eventsResponse.data?.filter(e => 
        isAfter(new Date(e.date_time), new Date()) && 
        format(new Date(e.date_time), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      ).length || 0;
      
      return {
        contributors: contributorsResponse.count || 0,
        articles: articlesResponse.count || 0,
        publishedArticles,
        events: eventsResponse.data?.length || 0,
        users: usersResponse.data?.length || 0,
        featuredEvents: featuredEventsResponse.data?.length || 0,
        upcomingEvents: upcomingEventsResponse.data?.length || 0,
        recentUsers: recentUsersResponse.data?.length || 0,
        todaysEvents
      };
    },
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });

  const statCards = [
    {
      title: 'Total Contributors',
      value: stats?.contributors || 0,
      subtitle: `${stats?.recentUsers || 0} this week`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      section: 'contributors' as const
    },
    {
      title: 'Published Articles',
      value: stats?.publishedArticles || 0,
      subtitle: `${stats?.articles || 0} total drafts`,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      section: 'articles' as const
    },
    {
      title: 'Events Today',
      value: stats?.todaysEvents || 0,
      subtitle: `${stats?.upcomingEvents || 0} upcoming`,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      section: 'events' as const
    },
    {
      title: 'Featured Events',
      value: stats?.featuredEvents || 0,
      subtitle: '3 max allowed',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      section: 'events' as const
    }
  ];

  const quickActions = [
    {
      title: 'Create Event',
      description: 'Add a new meetup or event',
      icon: Calendar,
      color: 'text-blue-600',
      path: '/admin/events',
      section: 'events' as const
    },
    {
      title: 'Add Contributor',
      description: 'Register a new expert',
      icon: Users,
      color: 'text-green-600',
      path: '/admin/contributors',
      section: 'contributors' as const
    },
    {
      title: 'Draft Article',
      description: 'Start writing content',
      icon: FileText,
      color: 'text-purple-600',
      path: '/admin/articles',
      section: 'articles' as const
    }
  ];

  // Render loading skeleton while data is being fetched
  const renderStatCard = (stat: typeof statCards[0]) => {
    const Icon = stat.icon;
    
    if (isLoading) {
      return (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card key={stat.title} className="hover:shadow-md transition-shadow">
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
            {stat.value}
          </div>
          <p className="text-xs text-gray-500">
            {stat.subtitle}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <ProtectedAdminRoute>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with AI Canada Voice.
            </p>
          </div>
        </div>

        {/* Stats Grid - Only show cards for sections user has access to */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards
            .filter(stat => hasPermission(stat.section))
            .map(renderStatCard)}
        </div>

        {/* Quick Actions - Only show actions for sections user has access to */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions
                .filter(action => hasPermission(action.section))
                .map((action) => {
                  const Icon = action.icon;
                  return (
                    <button 
                      key={action.path}
                      onClick={() => navigate(action.path)}
                      className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                    >
                      <Icon className={`h-6 w-6 ${action.color} mb-2`} />
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </button>
                  );
                })}
            </div>
            {quickActions.filter(action => hasPermission(action.section)).length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No quick actions available. Contact your administrator for section access.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminDashboard;
