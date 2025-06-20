
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  date_time: z.string().min(1, 'Date and time is required'),
  max_attendees: z.number().min(1, 'Must allow at least 1 attendee').max(1000, 'Maximum 1000 attendees'),
  category: z.string().min(1, 'Category is required'),
  is_virtual: z.boolean(),
  meeting_link: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type EventFormData = z.infer<typeof eventSchema>;

interface AdminEventFormProps {
  event?: any;
  onClose: () => void;
}

const categories = [
  'AI Research',
  'Machine Learning',
  'Ethics & Policy',
  'Industry Applications',
  'Startups & Innovation',
  'Education & Training',
  'Networking',
  'Conference',
  'Workshop',
  'Panel Discussion',
  'General'
];

const AdminEventForm = ({ event, onClose }: AdminEventFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const eventData = {
        title: data.title,
        description: data.description,
        location: data.location,
        date_time: new Date(data.date_time).toISOString(),
        max_attendees: data.max_attendees,
        category: data.category,
        is_virtual: data.is_virtual,
        meeting_link: data.is_virtual ? data.meeting_link || null : null,
        user_id: user?.id || '',
      };

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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title *</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your event"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date & Time *</FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_attendees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Attendees *</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="1"
                    max="1000"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_virtual"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Virtual Event</FormLabel>
                <div className="text-sm text-gray-500">
                  Toggle if this is an online event
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {watchIsVirtual ? 'Platform/Instructions' : 'Location'} *
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={
                    watchIsVirtual 
                      ? "e.g., Zoom, Google Meet, or instructions" 
                      : "Enter event location"
                  }
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchIsVirtual && (
          <FormField
            control={form.control}
            name="meeting_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Link</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://zoom.us/j/..."
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {createMutation.isPending ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdminEventForm;
