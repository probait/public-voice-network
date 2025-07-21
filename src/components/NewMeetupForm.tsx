import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, X } from 'lucide-react';

interface MeetupData {
  title: string;
  description: string;
  location: string;
  dateTime: string;
  category: string;
  isVirtual: boolean;
  meetingLink: string;
  imageUrl: string;
}

const NewMeetupForm = ({ onSubmit }: { onSubmit?: () => void }) => {
  const [formData, setFormData] = useState<MeetupData>({
    title: '',
    description: '',
    location: '',
    dateTime: '',
    category: 'general',
    isVirtual: false,
    meetingLink: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `event-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('event-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to organize a meetup.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.dateTime || !formData.imageUrl) {
      toast({
        title: "Please fill in all required fields",
        description: "All fields including an event image are required.",
        variant: "destructive"
      });
      return;
    }

    // Check if the date is in the future
    if (new Date(formData.dateTime) <= new Date()) {
      toast({
        title: "Invalid date",
        description: "Please select a future date and time.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if a file was selected
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (error) {
          throw new Error('Failed to upload image');
        }
      }

        const { error } = await supabase
        .from('meetups')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          location: formData.isVirtual ? 'Virtual' : formData.location,
          date_time: formData.dateTime,
          category: formData.category,
          is_virtual: formData.isVirtual,
          meeting_link: formData.isVirtual ? formData.meetingLink : null,
          image_url: imageUrl
        });

      if (error) throw error;

      toast({
        title: "Meetup created!",
        description: "Your AI meetup has been scheduled successfully."
      });
      
      setFormData({
        title: '',
        description: '',
        location: '',
        dateTime: '',
        category: 'general',
        isVirtual: false,
        meetingLink: '',
        imageUrl: ''
      });
      setImageFile(null);
      setImagePreview('');
      
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error('Error creating meetup:', error);
      toast({
        title: "Error creating meetup",
        description: "There was an error scheduling your meetup. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-red-600">Organize an AI Meetup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-base font-medium">
              Meetup Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g. AI Ethics Discussion, Local LLM Workshop"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-base font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what will be discussed, who should attend, and what to expect..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-2 min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label className="text-base font-medium">Event Image *</Label>
            <div className="space-y-4 mt-2">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Event preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
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
                    onChange={handleImageChange}
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
          </div>

          <div>
            <Label htmlFor="dateTime" className="text-base font-medium">
              Date & Time *
            </Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-base font-medium">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Discussion</SelectItem>
                <SelectItem value="ethics">AI Ethics</SelectItem>
                <SelectItem value="technical">Technical Workshop</SelectItem>
                <SelectItem value="policy">AI Policy</SelectItem>
                <SelectItem value="safety">AI Safety</SelectItem>
                <SelectItem value="research">Research Presentation</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="virtual"
              checked={formData.isVirtual}
              onChange={(e) => setFormData(prev => ({ ...prev, isVirtual: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="virtual" className="text-sm">
              Virtual meetup
            </Label>
          </div>

          {formData.isVirtual ? (
            <div>
              <Label htmlFor="meetingLink" className="text-base font-medium">
                Meeting Link
              </Label>
              <Input
                id="meetingLink"
                placeholder="Zoom, Google Meet, or other video call link"
                value={formData.meetingLink}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                className="mt-2"
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="location" className="text-base font-medium">
                Location *
              </Label>
              <Input
                id="location"
                placeholder="Venue name, address, or landmark"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="mt-2"
                required={!formData.isVirtual}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Meetup
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewMeetupForm;
