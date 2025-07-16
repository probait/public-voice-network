import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useArticleImageUpload = (initialImageUrl?: string) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialImageUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [imageMetadata, setImageMetadata] = useState<{
    width: number;
    height: number;
    fileSize: number;
  } | null>(null);

  const extractImageMetadata = (file: File): Promise<{ width: number; height: number; fileSize: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
            fileSize: file.size
          });
        };
        img.src = result;
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, setValue: (name: string, value: any) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Article image file selected:', file.name, file.size);
      setImageFile(file);
      
      // Extract metadata
      const metadata = await extractImageMetadata(file);
      setImageMetadata(metadata);
      console.log('Article image metadata extracted:', metadata);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        // Set a temporary value to satisfy form validation while we have a pending upload
        setValue('image_url', 'pending_upload');
        console.log('Article image preview set and form field updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (setValue: (name: string, value: any) => void) => {
    setImageFile(null);
    setImagePreview('');
    setImageMetadata(null);
    setValue('image_url', '');
  };

  const uploadImage = async (file: File): Promise<string> => {
    console.log('Starting article image upload for file:', file.name);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `article-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('event-images') // Using the same bucket for now
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('event-images')
      .getPublicUrl(filePath);

    console.log('Article image uploaded successfully. Public URL:', data.publicUrl);
    return data.publicUrl;
  };

  return {
    imageFile,
    imagePreview,
    imageMetadata,
    isUploading,
    setIsUploading,
    handleImageChange,
    handleRemoveImage,
    uploadImage
  };
};