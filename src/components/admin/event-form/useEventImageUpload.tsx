
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEventImageUpload = (initialImageUrl?: string) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialImageUrl || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setValue: (name: string, value: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Image file selected:', file.name, file.size);
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        // Don't set the form value to the preview - we'll set it to the actual URL after upload
        console.log('Image preview set');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (setValue: (name: string, value: string) => void) => {
    setImageFile(null);
    setImagePreview('');
    setValue('image_url', '');
  };

  const uploadImage = async (file: File): Promise<string> => {
    console.log('Starting image upload for file:', file.name);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `event-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('event-images')
      .getPublicUrl(filePath);

    console.log('Image uploaded successfully. Public URL:', data.publicUrl);
    return data.publicUrl;
  };

  return {
    imageFile,
    imagePreview,
    isUploading,
    setIsUploading,
    handleImageChange,
    handleRemoveImage,
    uploadImage
  };
};
