import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PartnershipInquiry {
  id: string;
  contact_name: string;
  email: string;
  phone?: string;
  organization_name: string;
  organization_type: string;
  message: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export const usePartnershipInquiries = () => {
  const [inquiries, setInquiries] = useState<PartnershipInquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchInquiries = async (filters?: {
    search?: string;
    status?: string;
    organizationType?: string;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }) => {
    setLoading(true);
    try {
      const {
        search = '',
        status = 'all',
        organizationType = 'all',
        orderBy = 'created_at',
        orderDirection = 'desc',
        page = 1,
        pageSize = 10
      } = filters || {};

      const offset = (page - 1) * pageSize;
      
      let query = supabase
        .from('partnership_inquiries')
        .select('*', { count: 'exact' })
        .range(offset, offset + pageSize - 1);

      // Apply search filter
      if (search) {
        query = query.or(`contact_name.ilike.%${search}%,email.ilike.%${search}%,organization_name.ilike.%${search}%,message.ilike.%${search}%`);
      }

      // Apply status filter
      if (status !== 'all') {
        query = query.eq('status', status);
      }

      // Apply organization type filter
      if (organizationType !== 'all') {
        query = query.eq('organization_type', organizationType);
      }

      // Apply ordering
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });

      const { data, error, count } = await query;

      if (error) throw error;
      
      setInquiries(data || []);
      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error fetching partnership inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch partnership inquiries",
        variant: "destructive",
      });
      return { data: [], count: 0 };
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('partnership_inquiries')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setInquiries(prev => 
        prev.map(inquiry => 
          inquiry.id === id ? { ...inquiry, status } : inquiry
        )
      );

      toast({
        title: "Status updated",
        description: `Partnership inquiry marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        variant: "destructive",
      });
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('partnership_inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInquiries(prev => prev.filter(inquiry => inquiry.id !== id));

      toast({
        title: "Deleted",
        description: "Partnership inquiry deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast({
        title: "Error", 
        description: "Failed to delete inquiry",
        variant: "destructive",
      });
    }
  };

  const bulkDelete = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('partnership_inquiries')
        .delete()
        .in('id', ids);

      if (error) throw error;

      setInquiries(prev => prev.filter(inquiry => !ids.includes(inquiry.id)));

      toast({
        title: "Deleted",
        description: `${ids.length} partnership inquiries deleted successfully`,
      });
    } catch (error) {
      console.error('Error bulk deleting inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to delete inquiries",
        variant: "destructive",
      });
    }
  };

  return {
    inquiries,
    loading,
    fetchInquiries,
    updateInquiryStatus,
    deleteInquiry,
    bulkDelete
  };
};