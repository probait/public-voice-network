import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ThoughtsSubmission {
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
  status?: string;
  source?: string;
}

interface FetchThoughtsParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  featuredFilter?: string;
  categoryFilter?: string;
  provinceFilter?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export const useAdminThoughts = (params: FetchThoughtsParams) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: thoughtsData = { data: [], count: 0 }, isLoading } = useQuery({
    queryKey: ['admin-thoughts', params],
    queryFn: async () => {
      // Calculate offset for pagination
      const offset = (params.page - 1) * params.pageSize;
      
      let query = supabase
        .from('thoughts_submissions')
        .select('*', { count: 'exact' })
        .range(offset, offset + params.pageSize - 1);

      // Apply search filter if there's a search term
      if (params.searchTerm) {
        query = query.or(`name.ilike.%${params.searchTerm}%,email.ilike.%${params.searchTerm}%,subject.ilike.%${params.searchTerm}%,message.ilike.%${params.searchTerm}%,category.ilike.%${params.searchTerm}%,province.ilike.%${params.searchTerm}%`);
      }

      // Apply featured filter
      if (params.featuredFilter && params.featuredFilter !== 'all') {
        query = query.eq('featured', params.featuredFilter === 'featured');
      }

      // Apply category filter
      if (params.categoryFilter && params.categoryFilter !== 'all') {
        query = query.eq('category', params.categoryFilter);
      }

      // Apply province filter
      if (params.provinceFilter && params.provinceFilter !== 'all') {
        query = query.eq('province', params.provinceFilter);
      }

      // Apply ordering
      if (params.orderBy) {
        query = query.order(params.orderBy, { ascending: params.orderDirection === 'asc' });
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      return {
        data: data || [],
        count: count || 0
      };
    },
  });

  const { data: filterOptions = { categories: [], provinces: [] }, isLoading: isLoadingFilters } = useQuery({
    queryKey: ['admin-thoughts-filters'],
    queryFn: async () => {
      const [categoriesResult, provincesResult] = await Promise.all([
        supabase
          .from('thoughts_submissions')
          .select('category')
          .order('category'),
        supabase
          .from('thoughts_submissions')
          .select('province')
          .order('province')
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (provincesResult.error) throw provincesResult.error;

      return {
        categories: [...new Set(categoriesResult.data?.map(c => c.category) || [])],
        provinces: [...new Set(provincesResult.data?.map(p => p.province) || [])]
      };
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from('thoughts_submissions')
        .update({ featured })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { featured }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-thoughts'] });
      toast({
        title: featured ? "Featured" : "Unfeatured",
        description: `Thought ${featured ? 'added to' : 'removed from'} homepage`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  });

  const featureNextBatchMutation = useMutation({
    mutationFn: async () => {
      // Fetch a larger pool to filter, then take first 100 eligible
      const { data, error } = await supabase
        .from('thoughts_submissions')
        .select('id, message, created_at')
        .eq('source', 'bc_ai_survey_2025')
        .eq('featured', false)
        .order('created_at', { ascending: true })
        .limit(500);
      
      if (error) throw error;

      const pool = (data || []).filter(r => {
        const m = (r.message || '').trim();
        if (!m) return false;
        if (m.startsWith('Voice imported from the BC AI Survey')) return false;
        return m.length >= 60; // basic quality gate
      });

      if (pool.length === 0) {
        throw new Error('No eligible voices found');
      }

      const ids = pool.slice(0, 100).map(r => r.id);
      const { error: updErr } = await supabase
        .from('thoughts_submissions')
        .update({ featured: true })
        .in('id', ids);
      
      if (updErr) throw updErr;

      return ids.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['admin-thoughts'] });
      toast({ 
        title: 'Curated 100 voices', 
        description: `Featured ${count} new voices from the dataset.` 
      });
    },
    onError: (error) => {
      if (error.message === 'No eligible voices found') {
        toast({ 
          title: 'No eligible voices', 
          description: 'No more dataset entries meet curation criteria.' 
        });
      } else {
        toast({ 
          title: 'Curation failed', 
          description: 'Could not feature the next batch.', 
          variant: 'destructive' 
        });
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('thoughts_submissions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-thoughts'] });
      toast({
        title: 'Success',
        description: 'Submission deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete submission',
        variant: 'destructive',
      });
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('thoughts_submissions')
        .delete()
        .in('id', ids);
      if (error) throw error;
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['admin-thoughts'] });
      toast({
        title: 'Success',
        description: `${ids.length} submissions deleted successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete submissions',
        variant: 'destructive',
      });
    }
  });

  const exportMutation = useMutation({
    mutationFn: async (exportParams: Omit<FetchThoughtsParams, 'page' | 'pageSize'>) => {
      // Fetch ALL submissions for export (not just current page)
      let query = supabase
        .from('thoughts_submissions')
        .select('*');

      // Apply the same filters that are currently active
      if (exportParams.searchTerm) {
        query = query.or(`name.ilike.%${exportParams.searchTerm}%,email.ilike.%${exportParams.searchTerm}%,subject.ilike.%${exportParams.searchTerm}%,message.ilike.%${exportParams.searchTerm}%,category.ilike.%${exportParams.searchTerm}%,province.ilike.%${exportParams.searchTerm}%`);
      }

      if (exportParams.featuredFilter && exportParams.featuredFilter !== 'all') {
        query = query.eq('featured', exportParams.featuredFilter === 'featured');
      }

      if (exportParams.categoryFilter && exportParams.categoryFilter !== 'all') {
        query = query.eq('category', exportParams.categoryFilter);
      }

      if (exportParams.provinceFilter && exportParams.provinceFilter !== 'all') {
        query = query.eq('province', exportParams.provinceFilter);
      }

      // Apply ordering
      if (exportParams.orderBy) {
        query = query.order(exportParams.orderBy, { ascending: exportParams.orderDirection === 'asc' });
      }

      const { data: allSubmissions, error } = await query;

      if (error) throw error;

      const headers = [
        'Name',
        'Email', 
        'Province',
        'Category',
        'Subject',
        'Message',
        'Featured',
        'Submitted Date'
      ];

      const csvData = (allSubmissions || []).map(submission => [
        submission.name,
        submission.email,
        submission.province,
        submission.category,
        submission.subject,
        submission.message.replace(/"/g, '""'), // Escape quotes
        submission.featured ? 'Yes' : 'No',
        new Date(submission.created_at).toLocaleDateString()
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `thoughts-submissions-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return csvData.length;
    },
    onSuccess: (count) => {
      toast({
        title: "Export complete",
        description: `CSV file with ${count} thoughts has been downloaded`,
      });
    },
    onError: (error) => {
      toast({
        title: "Export failed",
        description: "There was an error exporting the CSV file",
        variant: "destructive",
      });
    }
  });

  return {
    submissions: thoughtsData.data,
    totalSubmissions: thoughtsData.count,
    isLoading,
    filterOptions,
    isLoadingFilters,
    toggleFeaturedMutation,
    featureNextBatchMutation,
    deleteMutation,
    bulkDeleteMutation,
    exportMutation
  };
};