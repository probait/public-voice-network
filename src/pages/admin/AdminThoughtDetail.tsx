import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, MapPin, Calendar, Star, StarOff, MessageSquare, User } from 'lucide-react';

interface ThoughtsSubmission {
  id: string;
  name: string;
  email: string;
  province: string;
  category: string;
  subject: string;
  message: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const AdminThoughtDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<ThoughtsSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubmission = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('thoughts_submissions')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setSubmission(data);
    } catch (error) {
      console.error('Error fetching submission:', error);
      toast({
        title: "Error",
        description: "Failed to fetch thought submission",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async () => {
    if (!submission) return;

    try {
      const { error } = await supabase
        .from('thoughts_submissions')
        .update({ featured: !submission.featured })
        .eq('id', submission.id);

      if (error) throw error;

      setSubmission(prev => prev ? { ...prev, featured: !prev.featured } : null);

      toast({
        title: submission.featured ? "Unfeatured" : "Featured",
        description: `Thought ${submission.featured ? 'removed from' : 'added to'} homepage`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout requiredRole="admin">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!submission) {
    return (
      <AdminLayout requiredRole="admin">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Thought Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The thought submission you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/admin/thoughts">Return to Thoughts Management</Link>
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/admin/thoughts">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Thoughts
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thought Submission</h1>
              <p className="text-gray-600 mt-1">View and manage citizen submission</p>
            </div>
          </div>
          
          <Button
            onClick={toggleFeatured}
            variant={submission.featured ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            {submission.featured ? (
              <>
                <Star className="h-4 w-4 fill-current" />
                Featured
              </>
            ) : (
              <>
                <StarOff className="h-4 w-4" />
                Feature
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {submission.subject}
                  </CardTitle>
                  {submission.featured && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {submission.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Citizen Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900 font-medium">{submission.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a 
                      href={`mailto:${submission.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {submission.email}
                    </a>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Province</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{submission.province}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <Badge variant="outline" className="mt-1">
                    {submission.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Submission Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted</label>
                  <p className="text-gray-900">{formatDate(submission.created_at)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900">{formatDate(submission.updated_at)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminThoughtDetail;