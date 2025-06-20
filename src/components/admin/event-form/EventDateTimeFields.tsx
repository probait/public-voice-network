
import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface EventDateTimeFieldsProps {
  control: Control<any>;
}

const EventDateTimeFields = ({ control }: EventDateTimeFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
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
        control={control}
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
  );
};

export default EventDateTimeFields;
