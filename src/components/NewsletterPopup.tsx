import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsletterPopup({ isOpen, onClose }: NewsletterPopupProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email
      if (!email || !email.includes("@")) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }

      // Subscribe to newsletter
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email, source: "popup" }]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already subscribed",
            description: "You're already subscribed to our newsletter!",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for subscribing to our AI & Policy newsletter.",
        });
        
        // Set localStorage to prevent showing popup again for 30 days
        localStorage.setItem("newsletter-popup-dismissed", Date.now().toString());
        onClose();
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    // Set localStorage to prevent showing popup again for 7 days
    const dismissedUntil = Date.now() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem("newsletter-popup-dismissed", dismissedUntil.toString());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0 bg-white/95 backdrop-blur-md shadow-2xl">
        <DialogHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="p-2 bg-red-50 rounded-full">
              <Mail className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Join Our Newsletter
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base mt-2">
            Get monthly insights on AI and Policy news within Canada delivered directly to your inbox.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 text-base border-2 border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDismiss}
              disabled={isLoading}
              className="h-12 px-6 border-2 border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Maybe Later
            </Button>
          </div>
        </form>
        
        <p className="text-sm text-gray-500 text-center mt-4">
          By subscribing, you agree to receive our newsletter and can unsubscribe at any time.
        </p>
      </DialogContent>
    </Dialog>
  );
}