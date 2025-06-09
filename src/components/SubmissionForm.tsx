
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SubmissionData {
  concern: string;
  name: string;
  email: string;
  location: string;
  isAnonymous: boolean;
}

const SubmissionForm = ({ onSubmit }: { onSubmit?: (data: SubmissionData) => void }) => {
  const [formData, setFormData] = useState<SubmissionData>({
    concern: "",
    name: "",
    email: "",
    location: "",
    isAnonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.concern.trim() || !formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store in localStorage for demo purposes
    const submissions = JSON.parse(localStorage.getItem('communitySubmissions') || '[]');
    const newSubmission = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      location: formData.location || "Location not provided"
    };
    submissions.unshift(newSubmission);
    localStorage.setItem('communitySubmissions', JSON.stringify(submissions));
    
    toast({
      title: "Thank you for sharing!",
      description: "Your voice will be added to our community feed."
    });
    
    setFormData({
      concern: "",
      name: "",
      email: "",
      location: "",
      isAnonymous: false
    });
    
    if (onSubmit) {
      onSubmit(newSubmission);
    }
    
    setIsSubmitting(false);
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          setFormData(prev => ({
            ...prev,
            location: `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`
          }));
          toast({
            title: "Location detected",
            description: "You can edit this if it's not accurate."
          });
        },
        () => {
          toast({
            title: "Could not detect location",
            description: "Please enter your location manually."
          });
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="concern" className="text-base font-medium">
          What concern or issue would you like to share? *
        </Label>
        <Textarea
          id="concern"
          placeholder="Share your concern or issue here..."
          value={formData.concern}
          onChange={(e) => setFormData(prev => ({ ...prev, concern: e.target.value }))}
          className="mt-2 min-h-[120px] text-base"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-base font-medium">
            Your Name *
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-base font-medium">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-2"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location" className="text-base font-medium">
          Location
        </Label>
        <div className="mt-2 flex gap-2">
          <Input
            id="location"
            type="text"
            placeholder="City, State/Province, Country"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={detectLocation}
            className="shrink-0"
          >
            Detect
          </Button>
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
          Display as anonymous in community feed
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Your Voice"}
      </Button>
    </form>
  );
};

export default SubmissionForm;
