import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

interface ArticleImageUploadProps {
  imagePreview: string;
  fieldValue: string;
  imageMetadata?: {
    width: number;
    height: number;
    fileSize: number;
  } | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

const ArticleImageUpload = ({ imagePreview, fieldValue, imageMetadata, onImageChange, onRemoveImage }: ArticleImageUploadProps) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium mb-2">Article Image</label>
      {imagePreview || fieldValue ? (
        <div className="relative">
          <img 
            src={imagePreview || fieldValue} 
            alt="Article preview" 
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=225&fit=crop";
            }}
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
          {imageMetadata && (
            <div className="absolute bottom-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
              {imageMetadata.width}×{imageMetadata.height} • {(imageMetadata.fileSize / 1024 / 1024).toFixed(1)}MB
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-2">Upload an article image</p>
          <Input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
            id="article-image-upload"
          />
          <Label 
            htmlFor="article-image-upload" 
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Choose Image
          </Label>
        </div>
      )}
    </div>
  );
};

export default ArticleImageUpload;