
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Upload, X } from 'lucide-react';

interface EventImageUploadProps {
  imagePreview: string;
  fieldValue: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

const EventImageUpload = ({ imagePreview, fieldValue, onImageChange, onRemoveImage }: EventImageUploadProps) => {
  return (
    <FormItem>
      <FormLabel>Event Image *</FormLabel>
      <FormControl>
        <div className="space-y-4">
          {imagePreview || fieldValue ? (
            <div className="relative">
              <img 
                src={imagePreview || fieldValue} 
                alt="Event preview" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onRemoveImage}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">Upload an event image</p>
              <Input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
                id="image-upload"
              />
              <Label 
                htmlFor="image-upload" 
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Choose Image
              </Label>
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default EventImageUpload;
