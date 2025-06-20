
import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface EventLocationFieldsProps {
  control: Control<any>;
  watchIsVirtual: boolean;
}

const EventLocationFields = ({ control, watchIsVirtual }: EventLocationFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
          control={control}
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
    </>
  );
};

export default EventLocationFields;
