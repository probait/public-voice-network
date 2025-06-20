
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
} from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import EventImageUpload from './event-form/EventImageUpload';
import EventBasicFields from './event-form/EventBasicFields';
import EventDateTimeFields from './event-form/EventDateTimeFields';
import EventLocationFields from './event-form/EventLocationFields';
import { eventSchema, categories, type EventFormData } from './event-form/eventFormSchema';
import { useEventImageUpload } from './event-form/useEventImageUpload';

interface AdminEventFormProps {
  event?: any;
  onClose: () => void;
}

const AdminEventForm = ({ event, onClose }: AdminEventFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    imageFile,
    imagePreview,
    isUploading,
    setIsUploading,
    handleImageChange,
    handleRemoveImage,
    uploadImage
  } = useEventImageUpload(event?.image_url);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      location: event?.location || '',
      date_time: event?.date_time ? new Date(event.date_time).toISOString().slice(0, 16) : '',
      max_attendees: event?.max_attendees || 50,
      category: event?.category || 'General',
      is_virtual: event?.is_virtual || false,
      meeting_link: event?.meeting_link || '',
      image_url: event?.image_url || '',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      let imageUrl = data.image_url;

      // Only upload new image if a file was selected
      if (imageFile) {
        setIsUploading(true);
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (error) {
          throw new Error('Failed to upload image');
        } finally {
          setIsUploading(false);
        }
      }

      const eventData = {
        title: data.title,
        description: data.description,
        location: data.location,
        date_time: new Date(data.date_time).toISOString(),
        max_attendees: data.max_attendees,
        category: data.category,
        is_virtual: data.is_virtual,
        meeting_link: data.is_virtual ? data.meeting_link || null : null,
        image_url: imageUrl,
        user_id: user?.id || '',
      };

      console.log('Saving event with image_url:', imageUrl);

      if (event) {
        const { error } = await supabase
          .from('meetups')
          .update(eventData)
          .eq('id', event.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('meetups')
          .insert(eventData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['meetups'] });
      queryClient.invalidateQueries({ queryKey: ['external-events'] });
      toast({ 
        title: event ? 'Event updated' : 'Event created',
        description: 'The event has been saved successfully.'
      });
      onClose();
    },
    onError: (error) => {
      toast({ 
        title: 'Error', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const onSubmit = (data: EventFormData) => {
    createMutation.mutate(data);
  };

  const watchIsVirtual = form.watch('is_virtual');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EventBasicFields control={form.control} categories={categories} />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <EventImageUpload
              imagePreview={imagePreview}
              fieldValue={field.value}
              onImageChange={(e) => handleImageChange(e, form.setValue)}
              onRemoveImage={() => handleRemoveImage(form.setValue)}
            />
          )}
        />

        <EventDateTimeFields control={form.control} />
        <EventLocationFields control={form.control} watchIsVirtual={watchIsVirtual} />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || isUploading}
            className="bg-red-600 hover:bg-red-700"
          >
            {(createMutation.isPending || isUploading) ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdminEventForm;
