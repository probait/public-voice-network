
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
import { Loader2 } from 'lucide-react';

interface MeetupData {
  title: string;
  description: string;
  location: string;
  dateTime: string;
  maxAttendees: number;
  category: string;
  isVirtual: boolean;
  meetingLink: string;
}

const NewMeetupForm = ({ onSubmit }: { onSubmit?: () => void }) => {
  const [formData, setFormData] = useState<MeetupData>({
    title: '',
    description: '',
    location: '',
    dateTime: '',
    maxAttendees: 20,
    category: 'general',
    isVirtual: false,
    meetingLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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

    if (!formData.title.trim() || !formData.description.trim() || !formData.dateTime) {
      toast({
        title: "Please fill in all required fields",
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
      const { error } = await supabase
        .from('meetups')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          location: formData.isVirtual ? 'Virtual' : formData.location,
          date_time: formData.dateTime,
          max_attendees: formData.maxAttendees,
          category: formData.category,
          is_virtual: formData.isVirtual,
          meeting_link: formData.isVirtual ? formData.meetingLink : null
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
        maxAttendees: 20,
        category: 'general',
        isVirtual: false,
        meetingLink: ''
      });
      
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="maxAttendees" className="text-base font-medium">
                Max Attendees
              </Label>
              <Input
                id="maxAttendees"
                type="number"
                min="2"
                max="100"
                value={formData.maxAttendees}
                onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) || 20 }))}
                className="mt-2"
              />
            </div>
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
