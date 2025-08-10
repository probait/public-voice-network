
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
      console.log('Fetching admin events...');
      
      // First get all meetups including image_url
      const { data: meetupsData, error } = await supabase
        .from('meetups')
        .select(`
          id,
          title,
          description,
          location,
          date_time,
          category,
          is_virtual,
          meeting_link,
          created_at,
          user_id,
          homepage_featured,
          image_url,
          is_published,
          external_url,
          external_link_text
        `)
        .order('date_time', { ascending: false });

      if (error) {
        console.error('Error fetching meetups:', error);
        throw error;
      }

      console.log('Meetups data:', meetupsData);

      if (!meetupsData || meetupsData.length === 0) {
        return [];
      }


      // Get profiles for organizers
      const userIds = meetupsData.map(m => m.user_id).filter(Boolean);
      let profilesData: any[] = [];
      
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);
        
        if (!profilesError && profiles) {
          profilesData = profiles;
        }
      }

      // Combine the data
      return meetupsData.map(meetup => {
        const profile = profilesData.find(p => p.id === meetup.user_id);
        
        return {
          id: meetup.id,
          title: meetup.title,
          description: meetup.description,
          location: meetup.location,
          date_time: meetup.date_time,
          category: meetup.category,
          is_virtual: meetup.is_virtual,
          meeting_link: meetup.meeting_link,
          created_at: meetup.created_at,
          homepage_featured: meetup.homepage_featured,
          image_url: meetup.image_url,
          is_published: meetup.is_published,
          external_url: meetup.external_url,
          external_link_text: meetup.external_link_text,
          profiles: profile ? { full_name: profile.full_name } : null
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
      queryClient.invalidateQueries({ queryKey: ['external-events'] });
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
      queryClient.invalidateQueries({ queryKey: ['external-events'] });
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

  const toggleHomepageFeaturedMutation = useMutation({
    mutationFn: async ({ eventId, featured }: { eventId: string; featured: boolean }) => {
      const { error } = await supabase
        .from('meetups')
        .update({ homepage_featured: featured })
        .eq('id', eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['external-events'] });
      toast({ title: 'Event feature status updated successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error updating event feature status', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const togglePublishedMutation = useMutation({
    mutationFn: async ({ eventId, published }: { eventId: string; published: boolean }) => {
      const { error } = await supabase
        .from('meetups')
        .update({ is_published: published })
        .eq('id', eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['external-events'] });
      toast({ title: 'Event published status updated successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error updating event published status', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  return {
    events,
    isLoading,
    deleteMutation,
    bulkDeleteMutation,
    toggleHomepageFeaturedMutation,
    togglePublishedMutation
  };
};
