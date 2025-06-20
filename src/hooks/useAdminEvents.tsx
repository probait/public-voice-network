
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
        // Extract attendee count safely
        const attendeeCount = Array.isArray(event.attendees) ? event.attendees.length : 0;
        
        // Extract organizer name safely - handle all possible profile structures
        let organizerName: string | null = null;
        if (event.profiles) {
          if (typeof event.profiles === 'object' && 'full_name' in event.profiles) {
            organizerName = event.profiles.full_name;
          }
        }

        // Return the meetup object with safely processed data
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
          attendee_count: attendeeCount,
          profiles: organizerName ? { full_name: organizerName } : null
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
