import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface PartnershipInquiry {
  id: string;
  organization_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  organization_type: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminPartnershipInquiries = () => {
  const [inquiries, setInquiries] = useState<PartnershipInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('partnership_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch partnership inquiries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('partnership_inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setInquiries(prev => 
        prev.map(inq => 
          inq.id === id ? { ...inq, status: newStatus } : inq
        )
      );

      toast({
        title: "Status updated",
        description: "Partnership inquiry status has been updated successfully",
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

  useEffect(() => {
    fetchInquiries();
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

  if (loading) {
    return <div className="p-6">Loading partnership inquiries...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Partnership Inquiries</h1>
        <Badge variant="outline">{inquiries.length} total inquiries</Badge>
      </div>

      <div className="grid gap-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{inquiry.organization_name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Contact: {inquiry.contact_name} ({inquiry.email})
                  </p>
                  {inquiry.phone && (
                    <p className="text-sm text-muted-foreground">
                      Phone: {inquiry.phone}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Type: {inquiry.organization_type} • Submitted: {format(new Date(inquiry.created_at), 'PPP')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(inquiry.status)}>
                    {inquiry.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Message:</h4>
                  <p className="text-sm bg-muted p-3 rounded">{inquiry.message}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Select
                    value={inquiry.status}
                    onValueChange={(value) => updateStatus(inquiry.id, value)}
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
            </CardContent>
          </Card>
        ))}
      </div>

      {inquiries.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No partnership inquiries yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPartnershipInquiries;