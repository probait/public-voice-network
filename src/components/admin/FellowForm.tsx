import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const fellowSchema = z.object({
  contributor_id: z.string().optional(),
  program_description: z.string().min(1, 'Program description is required'),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  is_current: z.boolean().default(true),
});

type FellowFormData = z.infer<typeof fellowSchema>;

interface FellowFormProps {
  fellow?: any;
  onClose: () => void;
}

const FellowForm = ({ fellow, onClose }: FellowFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FellowFormData>({
    resolver: zodResolver(fellowSchema),
    defaultValues: {
      contributor_id: fellow?.contributor_id || 'none',
      program_description: fellow?.program_description || '',
      start_date: fellow?.start_date ? new Date(fellow.start_date) : undefined,
      end_date: fellow?.end_date ? new Date(fellow.end_date) : undefined,
      is_current: fellow?.is_current ?? true,
    },
  });

  // Fetch contributors for the dropdown
  const { data: contributors } = useQuery({
    queryKey: ['contributors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contributors')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: FellowFormData) => {
      const fellowData = {
        ...data,
        contributor_id: data.contributor_id === 'none' ? null : data.contributor_id || null,
        start_date: data.start_date ? data.start_date.toISOString().split('T')[0] : null,
        end_date: data.end_date ? data.end_date.toISOString().split('T')[0] : null,
      };

      if (fellow) {
        const { error } = await supabase
          .from('fellows')
          .update(fellowData)
          .eq('id', fellow.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('fellows')
          .insert([fellowData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fellows'] });
      toast({
        title: fellow ? 'Fellow updated successfully' : 'Fellow created successfully',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error saving fellow',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: FellowFormData) => {
    createMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="contributor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contributor (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a contributor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No contributor</SelectItem>
                  {contributors?.map((contributor) => (
                    <SelectItem key={contributor.id} value={contributor.id}>
                      {contributor.name}
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
          name="program_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the fellowship program..."
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
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_current"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Current Fellow</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Is this person currently in the fellowship program?
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

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saving...' : fellow ? 'Update Fellow' : 'Create Fellow'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FellowForm;