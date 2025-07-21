
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
  );
};

export default EventDateTimeFields;
