
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

interface SubmissionData {
  title: string;
  content: string;
  location: string;
  category: string;
  isAnonymous: boolean;
}

const NewSubmissionForm = ({ onSubmit }: { onSubmit?: () => void }) => {
  const [formData, setFormData] = useState<SubmissionData>({
    title: '',
    content: '',
    location: '',
    category: '',
    isAnonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to start a campaign.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          title: formData.title,
          content: formData.content,
          location: formData.location || null,
          category: formData.category || null,
          is_anonymous: formData.isAnonymous
        });

      if (error) throw error;

      toast({
        title: "Campaign started!",
        description: "Your campaign has been published successfully."
      });
      
      setFormData({
        title: '',
        content: '',
        location: '',
        category: '',
        isAnonymous: false
      });
      
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error('Error submitting:', error);
      toast({
        title: "Error starting campaign",
        description: "There was an error publishing your campaign. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-red-600">Start a Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-base font-medium">
              Campaign Title *
            </Label>
            <Input
              id="title"
              placeholder="What change do you want to see?"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-base font-medium">
              Tell your story *
            </Label>
            <Textarea
              id="content"
              placeholder="Explain why this issue matters and what change you want to see..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="mt-2 min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="text-base font-medium">
                Location
              </Label>
              <Input
                id="location"
                placeholder="City, State/Province, Country"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="mt-2"
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
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="social-justice">Social Justice</SelectItem>
                  <SelectItem value="politics">Politics</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="anonymous" className="text-sm">
              Display as anonymous
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start Your Campaign
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewSubmissionForm;
