
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Calendar, MessageSquare, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [contributors, articles, events, prompts, users] = await Promise.all([
        supabase.from('contributors').select('id', { count: 'exact', head: true }),
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('meetups').select('id', { count: 'exact', head: true }),
        supabase.from('prompts').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true })
      ]);

      return {
        contributors: contributors.count || 0,
        articles: articles.count || 0,
        events: events.count || 0,
        prompts: prompts.count || 0,
        users: users.count || 0
      };
    },
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data: recentContributors } = await supabase
        .from('contributors')
        .select('name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentArticles } = await supabase
        .from('articles')
        .select('title, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        contributors: recentContributors || [],
        articles: recentArticles || []
      };
    },
  });

  const statCards = [
    {
      title: 'Total Contributors',
      value: stats?.contributors || 0,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Published Articles',
      value: stats?.articles || 0,
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'Upcoming Events',
      value: stats?.events || 0,
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Active Prompts',
      value: stats?.prompts || 0,
      icon: MessageSquare,
      color: 'text-orange-600'
    },
    {
      title: 'Registered Users',
      value: stats?.users || 0,
      icon: TrendingUp,
      color: 'text-red-600'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity?.contributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{contributor.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(contributor.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {!recentActivity?.contributors.length && (
                  <p className="text-gray-500 text-sm">No recent contributors</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity?.articles.map((article, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium truncate">{article.title}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {!recentActivity?.articles.length && (
                  <p className="text-gray-500 text-sm">No recent articles</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
