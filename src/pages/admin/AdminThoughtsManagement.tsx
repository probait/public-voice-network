import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Download, Star } from "lucide-react";

interface ThoughtsSubmission {
  id: string;
  name: string;
  email: string;
  province: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const AdminThoughtsManagement = () => {
  const [submissions, setSubmissions] = useState<ThoughtsSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('thoughts_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch thoughts submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('thoughts_submissions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, status: newStatus } : sub
        )
      );

      toast({
        title: "Status updated",
        description: "Submission status has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('thoughts_submissions')
        .update({ featured: !currentFeatured })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, featured: !currentFeatured } : sub
        )
      );

      toast({
        title: currentFeatured ? "Unfeatured" : "Featured",
        description: `Thought ${currentFeatured ? 'removed from' : 'added to'} homepage`,
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

  const exportToCSV = () => {
    const headers = [
      'Name',
      'Email', 
      'Province',
      'Category',
      'Subject',
      'Message',
      'Status',
      'Featured',
      'Submitted Date'
    ];

    const csvData = submissions.map(submission => [
      submission.name,
      submission.email,
      submission.province,
      submission.category,
      submission.subject,
      submission.message.replace(/"/g, '""'), // Escape quotes
      submission.status,
      submission.featured ? 'Yes' : 'No',
      format(new Date(submission.created_at), 'yyyy-MM-dd HH:mm:ss')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `thoughts-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export complete",
      description: "CSV file has been downloaded",
    });
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500';
      case 'reviewed':
        return 'bg-yellow-500';
      case 'responded':
        return 'bg-green-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const featuredCount = submissions.filter(s => s.featured).length;

  if (loading) {
    return <div className="p-6">Loading thoughts submissions...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Thoughts Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage citizen thoughts and feature them on the homepage
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <Badge variant="outline" className="mr-2">
              {submissions.length} total
            </Badge>
            <Badge variant="outline" className="mr-2">
              <Star className="w-3 h-3 mr-1" />
              {featuredCount} featured
            </Badge>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id} className={submission.featured ? "border-yellow-200 bg-yellow-50/50" : ""}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{submission.subject}</CardTitle>
                    {submission.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    From: {submission.name} ({submission.email}) • {submission.province}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Category: {submission.category} • Submitted: {format(new Date(submission.created_at), 'PPP')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Message:</h4>
                  <p className="text-sm bg-muted p-3 rounded leading-relaxed">{submission.message}</p>
                </div>
                
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`featured-${submission.id}`}
                        checked={submission.featured}
                        onCheckedChange={() => toggleFeatured(submission.id, submission.featured)}
                      />
                      <label
                        htmlFor={`featured-${submission.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Feature on homepage
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Select
                      value={submission.status}
                      onValueChange={(value) => updateStatus(submission.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {submissions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No thoughts submissions yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminThoughtsManagement;