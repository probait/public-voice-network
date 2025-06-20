
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Meetup } from '@/types/admin-events';

export const useAdminEvents = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async (): Promise<Meetup[]> => {
      const { data, error } = await supabase
        .from('meetups')
        .select(`
          *,
          profiles!meetups_user_id_fkey(full_name),
          attendees(count)
        `)
        .order('date_time', { ascending: false });

      if (error) throw error;

      return (data || []).map(event => {
        // Safely extract the profiles data
        let profileData: { full_name: string | null } | null = null;
        
        if (event.profiles && 
            typeof event.profiles === 'object' && 
            event.profiles !== null && 
            'full_name' in event.profiles) {
          profileData = event.profiles as { full_name: string | null };
        }

        return {
          id: event.id,
          title: event.title,
          description: event.description,
          location: event.location,
          date_time: event.date_time,
          max_attendees: event.max_attendees,
          category: event.category,
          is_virtual: event.is_virtual,
          meeting_link: event.meeting_link,
          created_at: event.created_at,
          attendee_count: Array.isArray(event.attendees) ? event.attendees.length : 0,
          profiles: profileData
        };
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('meetups')
        .delete()
        .eq('id', eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: 'Event deleted successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting event', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (eventIds: string[]) => {
      const { error } = await supabase
        .from('meetups')
        .delete()
        .in('id', eventIds);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: 'Events deleted successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting events', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  return {
    events,
    isLoading,
    deleteMutation,
    bulkDeleteMutation
  };
};
